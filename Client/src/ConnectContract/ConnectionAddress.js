import abi from './AidABI.json';
import forecastAbi from './ForeCastABI.json';

export const AidAddress = import.meta.env.VITE_AID_ADDRESS;
export const ForeCastAddress = import.meta.env.VITE_FORECAST_ADDRESS;
export const AidABI = abi.abi
export const ForeCastABI = forecastAbi.abi

