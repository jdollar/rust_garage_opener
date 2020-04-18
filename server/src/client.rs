use tonic::Request;

use garageopener::garage_opener_client::GarageOpenerClient;
use garageopener::{Empty, ChangeDoorStateRequest};
use garageopener::change_door_state_request::Action;

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

  let response2 = client
    .change_door_state(Request::new(ChangeDoorStateRequest {
      password: "1224".into(),
      action: Action::Open as i32
    }))
    .await;

  println!("RESPONSE2 = {:?}", response2);

  let response3 = client
    .change_door_state(Request::new(ChangeDoorStateRequest {
      password: "1234".into(),
      action: Action::Open as i32
    }))
    .await?;

  println!("RESPONSE3 = {:?}", response3);

  Ok(())
}
