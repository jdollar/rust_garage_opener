import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { House, Check, Clear, HelpOutline } from '@material-ui/icons';
import { Empty, DoorState } from './pb/garage_opener_pb';
import { GarageOpenerContext } from './GarageOpenerContext';

// proto.garageopener.DoorState.State = {
//   OPENED: 0,
//   CLOSED: 1,
//   UNKNOWN: 2
// };
const configureStream = (params) => {
  const {
    garageOpenerService,
    streamOpts: { stream, setStream },
    setDoorStatus,
  } = params

  if (stream) {
    return stream;
  }
  
  console.log('generating new stream');
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 100000);
  const newStream = garageOpenerService.getGarageDoorState(new Empty(), { deadline: deadline.getTime() });

  newStream.on('data', function(response) {
    console.log('state: ', response.getState());
    setDoorStatus(response.getState());
  });
  newStream.on('status', function(status) {
    console.log(status.code);
    console.log(status.details);
    console.log(status.metadata);
  });
  newStream.on('error', function(err) {
    console.error(err);
  })
  newStream.on('end', function(end) {
    // stream end signal
    console.log('end');
  });

  setStream(newStream);
}

function StatusDisplay(props) {
  const { doorStatus } = props;

  const StateIcon = {
    [DoorState.State.OPENED]: Clear,
    [DoorState.State.CLOSED]: Check,
  }[doorStatus] || HelpOutline;

  return (
    <Grid container>
      <Grid item>
        <House />
      </Grid>
      <Grid item>
        <StateIcon />
      </Grid>
    </Grid>
  );
}

function Content(props) {
  console.log('rendering door status', props);
  const { garageOpenerContext: { garageOpenerService } } = props;

  const [ stream, setStream ] = useState(null);
  const [ doorStatus, setDoorStatus ] = useState(null);
  
  configureStream({ garageOpenerService, streamOpts: { stream, setStream }, setDoorStatus });

  return (
    <StatusDisplay doorStatus={doorStatus} />
  );
}

export function DoorStatusView() {
  return (
    <GarageOpenerContext.Consumer>
      { garageOpenerContext => <Content garageOpenerContext={garageOpenerContext} /> }
    </GarageOpenerContext.Consumer>
  );
}
