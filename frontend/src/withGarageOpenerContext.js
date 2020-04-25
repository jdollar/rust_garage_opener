import React from 'react';
import { GarageOpenerClient } from './pb/garage_opener_grpc_web_pb';

const GarageOpenerContext = React.createContext({
  garageOpenerService: new GarageOpenerClient('http://192.168.1.22:8080'),
});

export function withGarageOpenerContext(WrappedComponent) {
  return (props) => (
    <GarageOpenerContext.Consumer>
      { 
        garageOpenerContext => (
          <WrappedComponent garageOpenerContext={garageOpenerContext} {...props} />
        )
      }
    </GarageOpenerContext.Consumer>
  )
}
