use tonic::Request;

use garageopener::garage_opener_client::GarageOpenerClient;
use garageopener::{Empty, ChangeDoorStateRequest};

pub mod garageopener {
  tonic::include_proto!("garageopener");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut client = GarageOpenerClient::connect("http://[::1]:10000").await?;

  // let response = client
  //   .get_garage_door_state(Request::new(Empty {}))
  //   .await?;

  // println!("RESPONSE = {:?}", response);

  let mut stream = client
      .get_garage_door_state(Request::new(Empty {}))
      .await?
      .into_inner();

  while let Some(door_state) = stream.message().await? {
      println!("State = {:?}", door_state);
  }

  let response2 = client
    .change_door_state(Request::new(ChangeDoorStateRequest {
      password: "1224".into(),
    }))
    .await;

  println!("RESPONSE2 = {:?}", response2);

  let response3 = client
    .change_door_state(Request::new(ChangeDoorStateRequest {
      password: "1234".into(),
    }))
    .await?;

  println!("RESPONSE3 = {:?}", response3);

  Ok(())
}
