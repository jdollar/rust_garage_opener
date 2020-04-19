import React from 'react';
import { ChangeDoorStateRequest } from './pb/garage_opener_pb';
import { GarageOpenerClient } from './pb/garage_opener_grpc_web_pb';

function callDoorChangeEndpoint() {
  const garageOpenerService = new GarageOpenerClient('http://192.168.1.20:8080');

  const changeDoorStateRequest = new ChangeDoorStateRequest();
  changeDoorStateRequest.setPassword("1234");
  changeDoorStateRequest.setAction(0);
  garageOpenerService.changeDoorState(changeDoorStateRequest, null, (err, res) => {
    if (err) {
      throw new Error(err);
    }

    console.log('Response', res);
  })
}

export function RelayButton() {
  return (
    <button onClick={callDoorChangeEndpoint}>
      relayButton
    </button>
  )
}
