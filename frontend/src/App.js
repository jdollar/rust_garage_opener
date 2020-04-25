import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Snackbar, Toolbar, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Menu as MenuIcon, Settings } from '@material-ui/icons';
import { Alert as MuiAlert } from '@material-ui/lab';
import { DoorStatusView } from './DoorStatusView';
import { OpenCloseForm } from './OpenCloseForm';
import { SnackbarContext } from './withSnackbar';
import { SetupDialog } from './SetupDialog';
import { GarageOpenerContext } from './withGarageOpenerContext';
import { GarageOpenerClient } from './pb/garage_opener_grpc_web_pb';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '1em',
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
}));

const useGarageOpenerIpState = createPersistedState('garageOpenerIp');
const useGarageOpenerPortState = createPersistedState('garageOpenerPort');

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

function handleSetupValueUpdate({ setGarageOpenerIp, setGarageOpenerPort, setGarageOpenerContextState }) {
  return function({ ip, port }) {
    setGarageOpenerIp(ip);
    setGarageOpenerPort(port);
    setGarageOpenerContextState({
      garageOpenerService: (ip && port) ? new GarageOpenerClient(`http://${ip}:${port}`) : undefined,
    });
  };
}

function App() {
  const classes = useStyles();

  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [garageOpenerIp, setGarageOpenerIp] = useGarageOpenerIpState(null);
  const [garageOpenerPort, setGarageOpenerPort] = useGarageOpenerPortState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpts, setSnackbarOpts] = useState({ open: false });

  // App probably isn't going to change the setSnackbarOpts, but if we need to add
  // additional here we might want to determine a different solution for providing this
  // context value. Wanted to avoid https://reactjs.org/docs/context.html#caveats in regards
  // to a new object being created everytime
  const [snackbarProviderState] = useState(() => ({ setSnackbarOpts }));
  const [garageOpenerContextState, setGarageOpenerContextState] = useState(() => ({
    garageOpenerService: garageOpenerIp && new GarageOpenerClient(`http://${garageOpenerIp}:${garageOpenerPort}`),
  }));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSetupClick = () => {
    setSetupDialogOpen(true);
  }

  return (
    <React.Fragment>
      <GarageOpenerContext.Provider value={garageOpenerContextState}>
        <SnackbarContext.Provider value={snackbarProviderState}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                onClick={handleMenuClick}
                className={classes.menuButton}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleSetupClick}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Setup"/>
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          {
            (garageOpenerIp && garageOpenerPort)
            ? (
              <Grid
                className={classes.root}
                direction="column"
                container
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <DoorStatusView />
                </Grid>
                <Grid item>
                  <OpenCloseForm />
                </Grid>
              </Grid>
            )
            : null
          }
          <SetupDialog
            open={setupDialogOpen}
            setOpen={setSetupDialogOpen}
            values={{
              ip: garageOpenerIp,
              port: garageOpenerPort,
            }}
            setValues={handleSetupValueUpdate({ setGarageOpenerIp, setGarageOpenerPort, setGarageOpenerContextState })}
          />
        </SnackbarContext.Provider>
      </GarageOpenerContext.Provider>

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
