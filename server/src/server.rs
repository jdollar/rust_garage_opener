use confy;
use std::sync::Arc;
use serde::{Serialize, Deserialize};
use tonic::transport::Server;
use tonic::{Request, Response, Status};

use garageopener::garage_opener_server::{GarageOpener, GarageOpenerServer};
use garageopener::{Empty, DoorState};

#[derive(Debug, Serialize, Deserialize)]
struct GarageOpenerConfig {
    port: u16,
    gpiochip: String,
    relay_line: u8,
    relay_time_ms: usize,
}

impl ::std::default::Default for GarageOpenerConfig {
    fn default() -> Self {
      GarageOpenerConfig {
        port: 10000,
        gpiochip: "/dev/gpiochip0".into(),
        relay_line: 17,
        relay_time_ms: 1000
      }
    }
}

pub mod garageopener {
  tonic::include_proto!("garageopener");
}

#[derive(Debug)]
pub struct GarageOpenerService {
  cfg: Arc<GarageOpenerConfig>
}

#[tonic::async_trait]
impl GarageOpener for GarageOpenerService {
  async fn get_garage_door_state(&self, _request: Request<Empty>) -> Result<Response<DoorState>, Status> {
    dbg!(&self.cfg);
    Ok(Response::new(DoorState::default()))
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cfg: GarageOpenerConfig = confy::load("garage-opener")?;

    dbg!(&cfg);

    let addr = format!("[::1]:{}", cfg.port).parse().unwrap();

    println!("GarageDoorServer listening on: {}", addr);

    let garage_opener = GarageOpenerService {
      cfg: Arc::new(cfg),
    };

    let svc = GarageOpenerServer::new(garage_opener);

    Server::builder().add_service(svc).serve(addr).await?;

    Ok(())
}
