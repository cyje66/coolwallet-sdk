import { coin as COIN, transport } from '@coolwallet/core';
import * as txUtil from './util/transactionUtil';
import * as scriptUtil from './util/scriptUtil';
import * as types from './config/types'
import { TX_TYPE } from './config/types'
import * as params from './config/params';
import * as sign from './sign';
import { SDKError } from '@coolwallet/core/lib/error';

export { TX_TYPE };

type Transport = transport.default;

export default class ATOM extends COIN.ECDSACoin implements COIN.Coin {
  public Types: any;

  constructor() {
    super(params.COIN_TYPE);
    this.Types = types;
  }

  /**
   * Get Cosmos address by index
   */
  async getAddress(transport: Transport, appPrivateKey: string, appId: string, addressIndex: number): Promise<string> {
    const publicKey = await this.getPublicKey(transport, appPrivateKey, appId, addressIndex);
    return txUtil.publicKeyToAddress(publicKey);
  }


  /**
   * Sign transaction.
   */
  async signTransaction(
    signData: types.SignDataType
  ): Promise<string> {
    const chainId = signData.transaction.chainId
    // const chain_id = 'cosmoshub-3'
    switch (chainId) {
      case types.CHAIN_ID.ATOM:
        return this.signCosmosTransaction(signData);
      default:
        throw new SDKError(this.signTransaction.name, `not support input chainId: ${chainId}`);

    }
  }

  /**
 * Sign Cosmos tansfer transaction.
 */
  async signCosmosTransaction(
    signData: types.SignDataType
  ): Promise<string> {

    let { addressIndex } = signData

    let script;
    let argument;
    switch (signData.txType) {
      case types.TX_TYPE.SEND:
        script = params.TRANSFER.script + params.TRANSFER.signature;
        argument = scriptUtil.getCosmosSendArgement(signData.transaction, addressIndex)
        break;
      case types.TX_TYPE.DELEGATE:
        script = params.DELEGATE.script + params.DELEGATE.signature;
        argument = scriptUtil.getCosmosDelgtOrUnDelArgement(signData.transaction, addressIndex)
        break;
      case types.TX_TYPE.UNDELEGATE:
        script = params.UNDELEGATE.script + params.UNDELEGATE.signature;
        argument = scriptUtil.getCosmosDelgtOrUnDelArgement(signData.transaction, addressIndex)
        break;
      case types.TX_TYPE.WITHDRAW:
        script = params.WITHDRAW.script + params.WITHDRAW.signature;
        argument = scriptUtil.getCosmosWithdrawArgement(signData.transaction, addressIndex)
        break;
      default:
        throw new SDKError(this.signCosmosTransaction.name, `not support input tx type`);
    }

    const signature = sign.signTransaction(signData, script, argument)
    return signature;
  }
}