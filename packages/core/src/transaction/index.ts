import { executeCommand } from '../apdu/execute';
import { RESPONSE } from '../config/response';
import { getCommandSignature, getCommandSignatureWithoutNonce } from "../core/auth";
import Transport from '../transport';
import { addressIndexToKeyId } from '../core/txUtil'
import { Commands } from "../apdu/command";


/**
 * Set change address's path to CoolWallet.
 * 
 * @param transport 
 * @param appId 
 * @param appPrivateKey 
 * @param coinType 
 * @param changeAddressIndex 
 * @param redeemType 00=P2PKH 01=P2SH
 */
export const setChangeKeyid = async (
  transport: Transport,
  appId: string,
  appPrivateKey: string,
  coinType: string,
  changeAddressIndex: number,
  redeemType: string
) => {
  const changeKeyId = addressIndexToKeyId(coinType, changeAddressIndex);
  const sig = await getCommandSignature(
    transport,
    appId,
    appPrivateKey,
    Commands.SET_CHANGE_KEYID,
    changeKeyId,
    redeemType
  );
  const keyWithSig = changeKeyId + sig.signature;
  return executeCommand(transport, Commands.SET_CHANGE_KEYID, 'SE', keyWithSig, redeemType);
};

/**
 * send output data for bitcoin family
 * @param {Transport} transport
 * @param {String} txDataHex hex string data for SE
 * @param {String} txDataType hex P1 string
 */
/*export const prepareOutputData = async (
  transport: Transport,
  txDataHex: string,
  txDataType: string
) => {
  const { outputData } = await executeCommand(transport, Commands.TX_PREPARE, 'SE', txDataHex, txDataType);
  return outputData;
};*/

/**
 * get command signature for CoolWalletS
 * @param {Transport} transport
 * @param {String} txDataHex hex string data for SE
 * @param {String} txDataType hex P1 string
 * @param {String} appPrivateKey
 * @return {String} signature
 */
export const prepareTx = async (
  transport: Transport,
  txDataHex: string,
  txDataType: string,
  appPrivateKey: string
): Promise<string> => {
  if (txDataType != '00') {
    // send output data for bitcoin family
    const { outputData } = await executeCommand(transport, Commands.TX_PREPARE, 'SE', txDataHex, txDataType);
    return outputData;
  } else {
    const sig = await getCommandSignatureWithoutNonce(
      transport,
      appPrivateKey,
      Commands.SET_CHANGE_KEYID,
      txDataHex,
      txDataType
    );
    let encryptedSignature;
    const sendData = txDataHex + sig;
    const patch = Math.ceil(sendData.length / 500);
    for (let i = 0; i < patch; i++) {
      const patchData = sendData.substr(i * 500, 500);
      const p2 = patch === 1 ? "00" : (i === patch - 1 ? "8" : "0") + (i + 1);
      // eslint-disable-next-line no-await-in-loop
      const result = await executeCommand(transport, Commands.TX_PREPARE, 'SE', patchData, txDataType, p2);
      encryptedSignature = result.outputData;
    }
    if (encryptedSignature) {
      return encryptedSignature;
    } else {
      throw new Error('prepareTx get encryptedSignature failed')
    }
  }
};

/**
 * Send sign data to CoolWalletS
 * @param {Transport} transport
 * @param {string} payload
 * @param {string} P1
 * @param {string} P2
 * @return {Promise<string>}
 */
export const txPrep = async (
  transport: Transport,
  payload: string,
  P1: string,
  P2: string
): Promise<string> => {
  const { outputData } = await executeCommand(transport, Commands.TX_PREPARE, 'SE', payload, P1, P2);
  return outputData;
};

/**
 * Scriptable step 1
 * @todo append signature
 */
export const sendScript = async (transport: Transport, script: string) => {
  const { status } = await executeCommand(
    transport,
    Commands.SEND_SCRIPT,
    'SE',
    script,
    undefined,
    undefined,
    true
  );
  return status === RESPONSE.SUCCESS;
};

/**
 * Scriptable step 2
 */
export const executeScript = async (
  transport: Transport,
  appId: string,
  appPrivKey: string,
  argument: string,
) => {
  const { signature } = await getCommandSignature(
    transport,
    appId,
    appPrivKey,
    Commands.EXECUTE_SCRIPT,
    argument,
    undefined,
    undefined
  );
  const { outputData: encryptedSignature } = await executeCommand(
    transport,
    Commands.EXECUTE_SCRIPT,
    'SE',
    argument + signature,
    undefined,
    undefined,
    true,
    true,
  );
  return encryptedSignature;
};

/**
 * Scriptable step 3
 * @param {*} transport
 * @param {*} argument
 */
export const executeUtxoScript = async (
  transport: Transport,
  appId: string,
  appPrivKey: string,
  utxoArgument: string,
  //todo
  P1 = "11"
) => {
  const { signature } = await getCommandSignature(
    transport,
    appId,
    appPrivKey,
    Commands.EXECUTE_UTXO_SCRIPT,
    utxoArgument,
    P1,
    undefined
  );
  const { outputData: encryptedSignature } = await executeCommand(
    transport,
    Commands.EXECUTE_UTXO_SCRIPT,
    'SE',
    utxoArgument + signature,
    P1,
    undefined,
    true,
    true,
  );
  return encryptedSignature;
};

/**
 * Get full transactino composed by SE. Can be use to check if card supports scripts.
 * @todo append signature
 * @param {Transport} transport
 */
export const getSignedHex = async (transport: Transport) => {
  const { outputData: signedTx } = await executeCommand(transport, Commands.GET_SIGNED_HEX, 'SE');
  return signedTx;
};

/**
 * Inform CoolWalletS that tx_prepare is completed.
 * @param {Transport} transport
 * @return {Promse<boolean>}
 */
export const finishPrepare = async (transport: Transport): Promise<boolean> => {
  await executeCommand(transport, Commands.FINISH_PREPARE, 'SE');
  return true;
};

/**
 * Get an one-time key to decrypt received signatures.
 * @param {Transport} transport
 * @return {Promise<string>}
 */
export const getSignatureKey = async (transport: Transport): Promise<string> => {
  const { outputData: signatureKey } = await executeCommand(transport, Commands.GET_TX_KEY, 'SE');
  return signatureKey;
};

/**
 * Clear memory on CoolWalletS
 * @param {Transport} transport
 * @return {Promise<boolean>}
 */
export const clearTransaction = async (transport: Transport): Promise<boolean> => {
  await executeCommand(transport, Commands.CLEAR_TX, 'SE');
  return true;
};

/**
 * get Transactino detail shown on hardware.
 * @param {Transport} transport
 * @return {Promise<boolean>} true: success, false: canceled.
 */
export const getTxDetail = async (transport: Transport): Promise<boolean> => {
  const { status } = await executeCommand(transport, Commands.GET_TX_DETAIL, 'SE');
  return status === RESPONSE.SUCCESS;
};

/**
 * set built-in ERC20 token payload in CWS.
 * @param {Transport} transport
 * @param {string} payload
 * @param {number} sn 1: normal erc20, 2: second token in 0x.
 * @return {Promise<boolean>}
 */
export const setToken = async (transport: Transport, payload: string, sn: number = 1): Promise<boolean> => {
  const { status } = sn === 1
    ? await executeCommand(transport, Commands.SET_ERC20_TOKEN, 'SE', payload)
    : await executeCommand(transport, Commands.SET_SECOND_ERC20_TOKEN, 'SE', payload);
  return status === RESPONSE.SUCCESS;
};

/**
 * Set custom ERC20
 * @param {Transport} transport
 * @param {string} payload
 * @param {number} sn 1: normal erc20, 2: second token in 0x.
 * @return {Promise<boolean>}
 */
export const setCustomToken = async (transport: Transport, payload: string, sn: number = 1): Promise<boolean> => {
  const { status } = sn === 1
    ? await executeCommand(transport, Commands.SET_ERC20_TOKEN, 'SE', payload, '04', '18')
    : await executeCommand(transport, Commands.SET_SECOND_ERC20_TOKEN, 'SE', payload, '04', '18');
  return status === RESPONSE.SUCCESS;
};
