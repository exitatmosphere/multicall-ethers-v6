import { Interface } from "ethers";

export type CallInput = {
  target: string;
  interface: Interface;
  function: string;
  args?: any[];
};
