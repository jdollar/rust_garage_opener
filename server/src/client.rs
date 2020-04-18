use tonic::Request;

use garageopener::garage_opener_client::GarageOpenerClient;
use garageopener::{Empty};

pub mod garageopener {
  tonic::include_proto!("garageopener");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut client = GarageOpenerClient::connect("http://[::1]:10000").await?;

  let response = client
    .get_garage_door_state(Request::new(Empty {}))
    .await?;

  println!("RESPONSE = {:?}", response);

  Ok(())
}
