import React from 'react';
import { Button } from '@material-ui/core';
import { ChangeDoorStateRequest } from './pb/garage_opener_pb';
import { GarageOpenerContext } from './GarageOpenerContext';

function callDoorChangeEndpoint(garageOpenerContext) {
  return async function() {
    const { garageOpenerService } = garageOpenerContext;

    const changeDoorStateRequest = new ChangeDoorStateRequest();
    changeDoorStateRequest.setPassword("1234");
    changeDoorStateRequest.setAction(0);

    return new Promise((resolve, reject) => {
      garageOpenerService.changeDoorState(changeDoorStateRequest, null, (err, res) => {
        if (err) {
          reject(err);
        } else {
          console.log('Response', res);
          resolve(res)
        }
      })
    })
      .catch(err => console.error('Error: ', err));
  }
}

export function RelayButton() {
  return (
    <GarageOpenerContext.Consumer>
      { garageOpenerContext => (
        <Button onClick={callDoorChangeEndpoint(garageOpenerContext)} variant="contained" color="primary">
          Open/Close
        </Button>
      )}
    </GarageOpenerContext.Consumer>
  )
}
