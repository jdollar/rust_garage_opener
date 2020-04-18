use confy;
use std::sync::Arc;
use serde::{Serialize, Deserialize};
use tonic::transport::Server;
use tonic::{Request, Response, Status, Code};
use gpio_cdev::{Chip,LineRequestFlags,LineHandle};
use std::thread::sleep;
use std::time::Duration;

use garageopener::garage_opener_server::{GarageOpener, GarageOpenerServer};
use garageopener::{Empty, ChangeDoorStateRequest, ChangeDoorStateResponse, DoorState};

#[derive(Debug, Serialize, Deserialize)]
struct RelayConfig {
    chip: String,
    line: u32,
    time_ms: u64
}

#[derive(Debug, Serialize, Deserialize)]
struct GarageOpenerConfig {
    port: u16,
    password: String,
    relay: RelayConfig
}

impl ::std::default::Default for GarageOpenerConfig {
    fn default() -> Self {
        GarageOpenerConfig {
            port: 10000,
            password: "1234".into(),
            relay: RelayConfig {
                chip: "/dev/gpiochip0".into(),
                line: 17,
                time_ms: 1000
            }
        }
    }
}

pub mod garageopener {
    tonic::include_proto!("garageopener");
}

#[derive(Debug)]
pub struct GarageOpenerService {
    cfg: Arc<GarageOpenerConfig>,
    gpio_handle: Arc<LineHandle>
}

#[tonic::async_trait]
impl GarageOpener for GarageOpenerService {
    async fn get_garage_door_state(&self, _request: Request<Empty>) -> Result<Response<DoorState>, Status> {
        dbg!(&self.cfg);
        Ok(Response::new(DoorState::default()))
    }

    async fn change_door_state(&self, request: Request<ChangeDoorStateRequest>) -> Result<Response<ChangeDoorStateResponse>, Status> {
        if request.into_inner().password != self.cfg.password {
            return Err(Status::new(Code::Unauthenticated, "Password provided is incorrect"));
        }

        match self.gpio_handle.set_value(0) {
            Err(_) => return Err(Status::new(Code::Internal, "Error turning the relay on")),
            _ => ()
        }

        sleep(Duration::from_millis(self.cfg.relay.time_ms));

        match self.gpio_handle.set_value(1) {
            Err(_) => return Err(Status::new(Code::Internal, "Error turning the relay off")),
            _ => ()
        }

        Ok(Response::new(ChangeDoorStateResponse {
            success: true
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cfg: GarageOpenerConfig = confy::load("garage-opener")?;
    
    dbg!(&cfg);

    // Setup relay
    let mut chip = Chip::new(&cfg.relay.chip)?;

    let handle = chip
        .get_line(cfg.relay.line)?
        .request(LineRequestFlags::OUTPUT, 1, "garage-switch")?;
    
    let addr = format!("[::1]:{}", cfg.port).parse().unwrap();
    
    println!("GarageDoorServer listening on: {}", addr);
    
    let garage_opener = GarageOpenerService {
        cfg: Arc::new(cfg),
        gpio_handle: Arc::new(handle),
    };
    
    let svc = GarageOpenerServer::new(garage_opener);
    
    Server::builder().add_service(svc).serve(addr).await?;
    
    Ok(())
}
