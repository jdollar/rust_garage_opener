import React from 'react';

export const SnackbarContext = React.createContext({
  setSnackbarOpts: () => {},
});

export function withSnackbar(WrappedComponent) {
  return (props) => (
    <SnackbarContext.Consumer>
      { 
        snackbarContext => (
          <WrappedComponent snackbarContext={snackbarContext} {...props} />
        )
      }
    </SnackbarContext.Consumer>
  )
}
