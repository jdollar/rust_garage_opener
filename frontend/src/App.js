import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { DoorStatusView } from './DoorStatusView';
import { RelayButton } from './RelayButton';

const useStyles = makeStyles(() => ({
  root: {
    margin: '1em',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      direction="column"
      container
      alignItems="center"
    >
      <Grid item>
        <DoorStatusView />
      </Grid>
      <Grid item>
        <RelayButton />
      </Grid>
    </Grid>
  );
}

export default App;
