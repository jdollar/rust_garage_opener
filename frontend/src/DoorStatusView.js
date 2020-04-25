import React, { useState, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Check, Clear, HelpOutline } from '@material-ui/icons';
import { Empty, DoorState } from './pb/garage_opener_pb';
import { withGarageOpenerContext } from './withGarageOpenerContext';

const useStatusDisplayStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  icon: {
    fontSize: '20em',
  },
}));

function StatusDisplay(props) {
  const { doorStatus } = props;
  const classes = useStatusDisplayStyles();

  const StateIcon = {
    [DoorState.State.OPENED]: Clear,
    [DoorState.State.CLOSED]: Check,
  }[doorStatus] || HelpOutline;

  return (
    <Grid
      container
      className={classes.root}
    >
      <Grid item>
        <StateIcon
          classes={{ root: classes.icon }}
        />
      </Grid>
    </Grid>
  );
}

function setupStream(params) {
  const { garageOpenerService, setStream } = params;
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 100000);
  const newStream = garageOpenerService.getGarageDoorState(new Empty(), { deadline: deadline.getTime() });

  newStream.on('status', function(status) {
    console.log(status.code);
    console.log(status.details);
    console.log(status.metadata);
  });
  newStream.on('error', function(err) {
    console.error(err);

    // Wait a second and try again
    setTimeout(() => {
      setupStream(params);
    }, 1000);
  })
  newStream.on('end', function(end) {
    // stream end signal
    console.log('end');
  });

  setStream(newStream);
}

function Content(props) {
  const { garageOpenerContext: { garageOpenerService } } = props;

  const [ stream, setStream ] = useState(null);
  const [ doorStatus, setDoorStatus ] = useState(DoorState.State.UNKOWN);

  // Configure stream to update door status when we detect a change
  useEffect(() => {
    if (stream) {
      stream.on('data', function(response) {
        if (doorStatus !== response.getState()) {
          setDoorStatus(response.getState());
        }
      })
    }
  }, [stream, doorStatus])

  // Create new stream on initial load
  useEffect(() => {
    setupStream({ garageOpenerService, setStream });
  }, [garageOpenerService]);

  return (
    <StatusDisplay
      doorStatus={doorStatus}
    />
  );
}

export const DoorStatusView = withGarageOpenerContext(Content);
