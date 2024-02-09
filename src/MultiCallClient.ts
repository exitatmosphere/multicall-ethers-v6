import { AbiCoder, Interface, Provider } from "ethers";
import { CallInput } from "./types";
import { MultiCall__factory } from "../typechain-types/factories/MultiCall__factory";

export class MultiCallClient {
  constructor(private readonly _provider: Provider) {}

  public async multiCall(inputs: CallInput[]): Promise<[number, any[]]> {
    const targets: string[] = [];
    const datas: string[] = [];
    const interfaces: Interface[] = [];

    for (let input of inputs) {
      const iface = input.interface;
      const calldata = iface.encodeFunctionData(input.function, input.args);

      targets.push(input.target);
      datas.push(calldata);
      interfaces.push(iface);
    }

    const abiCoder = AbiCoder.defaultAbiCoder();
    const inputData = abiCoder.encode(
      ["address[]", "bytes[]"],
      [targets, datas]
    );
    const fulldata = MultiCall__factory.bytecode.concat(inputData.slice(2));
    const encodedReturnData = await this._provider.call({ data: fulldata });
    const [blockNumber, returndatas] = abiCoder.decode(
      ["uint256", "bytes[]"],
      encodedReturnData
    );

    const results: any[] = [];
    for (let i = 0; i < inputs.length; i++) {
      const returndata = returndatas[i];
      let result: any;

      if (returndata == "0x") {
        result = null;
      } else {
        result = interfaces[i].decodeFunctionResult(
          inputs[i].function,
          returndata
        );
        if (Array.isArray(result) && result.length == 1) {
          result = result[0];
        }
      }

      results.push(result);
    }

    return [Number(blockNumber), results];
  }
}
