import React, { useState } from 'react';
import { Grid, TextField, makeStyles } from '@material-ui/core';
import { RelayButton } from './RelayButton';

const useStyles = makeStyles(() => ({
  root: {},
  buttonGrid: {
    width: '100%'
  },
  button: {
    width: '100%'
  }
}));

function passwordOnChange({ setPassword }) {
  return function(event) {
    setPassword(event.target.value);
  };
}

export function OpenCloseForm(props) {
  const classes = useStyles();

  const [password, setPassword] = useState('');

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      alignItems="center"
      spacing={2}
    >
      <Grid
        item
      >
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          autoComplete="current-password"
          onChange={passwordOnChange({ setPassword })}
        />
      </Grid>
      <Grid
        item
        className={classes.buttonGrid}
      >
        <RelayButton
          classes={{ root: classes.button }}
          password={password}
        />
      </Grid>
    </Grid>
  );
}
