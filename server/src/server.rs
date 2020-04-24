use confy;
use std::sync::Arc;
use serde::{Serialize, Deserialize};
use tonic::transport::Server;
use tonic::{Request, Response, Status, Code};
use tokio::sync::mpsc;
use gpio_cdev::{Chip,LineRequestFlags,LineHandle};
use std::result::Result;
use std::thread::sleep;
use std::time::Duration;

use garageopener::garage_opener_server::{GarageOpener, GarageOpenerServer};
use garageopener::{Empty, ChangeDoorStateRequest, ChangeDoorStateResponse, DoorState};
use garageopener::door_state::State;

#[derive(Debug, Serialize, Deserialize)]
struct GpioConfig {
    chip: String,
    line: u32
}

#[derive(Debug, Serialize, Deserialize)]
struct RelayConfig {
    time_ms: u64,
    gpio: GpioConfig
}

#[derive(Debug, Serialize, Deserialize)]
struct SwitchConfig {
    gpio: GpioConfig
}

#[derive(Debug, Serialize, Deserialize)]
struct GarageOpenerConfig {
    port: u16,
    password: String,
    relay: RelayConfig,
    open_switch: SwitchConfig
}

impl ::std::default::Default for GarageOpenerConfig {
    fn default() -> Self {
        GarageOpenerConfig {
            port: 10000,
            password: "1234".into(),
            relay: RelayConfig {
                gpio: GpioConfig {
                    chip: "/dev/gpiochip0".into(),
                    line: 17
                },
                time_ms: 1000
            },
            open_switch: SwitchConfig {
                gpio: GpioConfig {
                    chip: "/dev/gpiochip0".into(),
                    line: 27
                }
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
    relay_handle: Arc<LineHandle>,
    open_switch_handle: Arc<LineHandle>
}

#[tonic::async_trait]
impl GarageOpener for GarageOpenerService {
    type GetGarageDoorStateStream = mpsc::Receiver<Result<DoorState, Status>>;

    async fn get_garage_door_state(&self, _request: Request<Empty>) -> Result<Response<Self::GetGarageDoorStateStream>, Status> {
        let (mut tx, rx) = mpsc::channel(1);
        let open_switch = self.open_switch_handle.clone();

        dbg!("Before Spawn");

        tokio::spawn(async move {
            loop {
                dbg!("Inside Loop");
                // Need to figure out how to match against their result type
                let is_open = open_switch.get_value().unwrap();

                let state = if is_open == 1 {
                    State::Opened
                } else {
                    State::Unknown
                };

                dbg!("Before send Match");
                match tx.send(Ok(DoorState { state: state as i32 })).await {
                    Err(_) => break,
                    x => {
                        dbg!(&x);
                        dbg!(x.unwrap());
                        sleep(Duration::from_millis(1000));
                    }
                };
                dbg!("After Match");
            }
        });

        Ok(Response::new(rx))
    }

    async fn change_door_state(&self, request: Request<ChangeDoorStateRequest>) -> Result<Response<ChangeDoorStateResponse>, Status> {
        if request.into_inner().password != self.cfg.password {
            return Err(Status::new(Code::Unauthenticated, "Password provided is incorrect"));
        }

        match self.relay_handle.set_value(0) {
            Err(_) => return Err(Status::new(Code::Internal, "Error turning the relay on")),
            _ => ()
        }

        sleep(Duration::from_millis(self.cfg.relay.time_ms));

        match self.relay_handle.set_value(1) {
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

    // Setup gpio
    let mut relay_chip = Chip::new(&cfg.relay.gpio.chip)?;
    let mut open_switch_chip = Chip::new(&cfg.open_switch.gpio.chip)?;

    let relay_handle = relay_chip
        .get_line(cfg.relay.gpio.line)?
        .request(LineRequestFlags::OUTPUT, 1, "garage-relay")?;

    let open_switch_handle = open_switch_chip
        .get_line(cfg.open_switch.gpio.line)?
        .request(LineRequestFlags::INPUT, 0, "garage-open-switch")?;
    
    let addr = format!("[::1]:{}", cfg.port).parse().unwrap();
    
    println!("GarageDoorServer listening on: {}", addr);
    
    let garage_opener = GarageOpenerService {
        cfg: Arc::new(cfg),
        relay_handle: Arc::new(relay_handle),
        open_switch_handle: Arc::new(open_switch_handle)
    };
    
    let svc = GarageOpenerServer::new(garage_opener);
    
    Server::builder().add_service(svc).serve(addr).await?;
    
    Ok(())
}
