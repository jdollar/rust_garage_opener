import React from 'react';
import clsx from 'clsx';
import { Button, makeStyles } from '@material-ui/core';
import { ChangeDoorStateRequest } from './pb/garage_opener_pb';
import { withGarageOpenerContext } from './withGarageOpenerContext';
import { withSnackbar } from './withSnackbar';

const useStyles = makeStyles(() => ({
  root: {},
}));

function callDoorChangeEndpoint({ snackbarContext, garageOpenerContext, password }) {
  return async function() {
    const { garageOpenerService } = garageOpenerContext;
    const { setSnackbarOpts } = snackbarContext;

    const changeDoorStateRequest = new ChangeDoorStateRequest();
    changeDoorStateRequest.setPassword(password);

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
      .then(() => {
        setSnackbarOpts({
          open: true,
          message: 'Door has been updated!',
          severity: 'success',
        });
      })
      .catch(err => {
        setSnackbarOpts({
          open: true,
          message: err.message,
          severity: 'error',
        });
      });
  }
}

function Content(props) {
  const { snackbarContext, garageOpenerContext, password, classes: propClasses } = props;
  const classes = useStyles();

  const onClick = callDoorChangeEndpoint({
    snackbarContext,
    garageOpenerContext,
    password,
  });

  return (
    <Button
      className={clsx(propClasses.root, classes.root)}
      onClick={onClick}
      variant="contained"
      color="primary">
      Open/Close
    </Button>
  )
}

export const RelayButton = withSnackbar(
  withGarageOpenerContext(
    Content,
  ),
);
