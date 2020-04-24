import React from 'react';
import { GarageOpenerClient } from './pb/garage_opener_grpc_web_pb';

export const GarageOpenerContext = React.createContext({
  garageOpenerService: new GarageOpenerClient('http://192.168.1.22:8080'),
});
