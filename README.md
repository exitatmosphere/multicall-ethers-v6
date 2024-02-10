# multicall-ethers-v6

Stripped clone of [@indexed-finance/multicall](https://github.com/indexed-finance/multicall) without uniswap specific functional which works with ethers-v6.

## Usage example

```typescript
import { ethers } from "ethers";
import MultiCallClient, { CallInput } from "multicall-ethers-v6";
import {
  UniswapV2Factory__factory,
  UniswapV2Router02__factory,
} from "./contracts/types";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://cloudflare-eth.com");
  const multiCallClient = new MultiCallClient(provider);

  const factoryAddr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const factoryIface = UniswapV2Factory__factory.createInterface();

  const routerAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const routerIface = UniswapV2Router02__factory.createInterface();

  const inputs: CallInput[] = [
    {
      target: factoryAddr,
      interface: factoryIface,
      function: "allPairs",
      args: [0],
    },
    {
      target: routerAddr,
      interface: routerIface,
      function: "WETH",
    },
  ];

  const [blockNumber, result] = await multiCallClient.multiCall(inputs);

  console.log(`Block number: ${blockNumber}`);
  console.log(`First pair addr: ${result[0]}`);
  console.log(`WETH addr: ${result[1]}`);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
```
