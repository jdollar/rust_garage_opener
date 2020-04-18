#[derive(Debug)]
struct GarageOpenerService;

use tonic::transport::Server;
use tonic::{Request, Response, Status};

use garageopener::garage_opener_server::{GarageOpener, GarageOpenerServer};
use garageopener::{Empty, DoorState};

pub mod garageopener {
  tonic::include_proto!("garageopener");
}

#[tonic::async_trait]
impl GarageOpener for GarageOpenerService {
  async fn get_garage_door_state(&self, _request: Request<Empty>) -> Result<Response<DoorState>, Status> {
    Ok(Response::new(DoorState::default()))
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:10000".parse().unwrap();

    println!("GarageDoorServer listening on: {}", addr);

    let garage_opener = GarageOpenerService {};

    let svc = GarageOpenerServer::new(garage_opener);

    Server::builder().add_service(svc).serve(addr).await?;

    Ok(())
}
