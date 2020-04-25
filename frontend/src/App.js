import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Snackbar, Toolbar, IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { Alert as MuiAlert } from '@material-ui/lab';
import { DoorStatusView } from './DoorStatusView';
import { OpenCloseForm } from './OpenCloseForm';
import { SnackbarContext } from './withSnackbar';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '1em',
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function handleSnackbarClose(setSnackbarOpt) {
  return function(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpt({ open: false });
  };
}

function App() {
  const classes = useStyles();

  const [snackbarOpts, setSnackbarOpts] = useState({ open: false });

  // App probably isn't going to change the setSnackbarOpts, but if we need to add
  // additional here we might want to determine a different solution for providing this
  // context value. Wanted to avoid https://reactjs.org/docs/context.html#caveats in regards
  // to a new object being created everytime
  const [snackbarProviderState] = useState(() => ({ setSnackbarOpts }));

  return (
    <React.Fragment>
      <SnackbarContext.Provider value={snackbarProviderState}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit">
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>
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
            <OpenCloseForm />
          </Grid>
        </Grid>
      </SnackbarContext.Provider>

      <Snackbar
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        open={snackbarOpts.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose(setSnackbarOpts)}
      >
        <Alert onClose={handleSnackbarClose(setSnackbarOpts)} severity={snackbarOpts.severity || 'info'}>
          { snackbarOpts.message }
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default App;
