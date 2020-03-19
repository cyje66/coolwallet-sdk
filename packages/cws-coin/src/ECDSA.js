import * as derivation from './derive';

export default class ECDSACoin {
  constructor(transport, appPrivateKey, appId, coinType) {
    this.transport = transport;
    this.appPrivateKey = appPrivateKey;
    this.appId = appId;
    this.coinType = coinType;
    this.accPublicKey = '';
    this.accChainCode = '';

    this.getPublicKey = this.getPublicKey.bind(this);
  }

  /**
   * For ECDSA based coins
   * @param {Number} addressIndex address index in BIP44 pointing to the target public key.
   * @returns {Promise < string >}
   */
  async getPublicKey(addressIndex) {
    if (this.accPublicKey === '' || this.accChainCode === '') {
      const { accountPublicKey, accountChainCode } = await derivation.getAccountExtKey(
        this.transport,
        this.appId,
        this.appPrivateKey,
        this.coinType,
        0
      );
      this.accPublicKey = accountPublicKey;
      this.accChainCode = accountChainCode;
    }
    const nodeInfo = derivation.derivePubKey(this.accPublicKey, this.accChainCode, 0, addressIndex);
    return nodeInfo.publicKey;
  }

  /**
   * For ECDSA based coins
   * @returns {Promise < { publicKey: string, parentPublicKey: string, parentChainCode: string } >}
   */
  async getBIP32NodeInfo() {
    const { accountPublicKey, accountChainCode } = await derivation.getAccountExtKey(
      this.transport,
      this.appId,
      this.appPrivateKey,
      this.coinType,
      0
    );
    const { parentPublicKey, parentChainCode } = derivation.derivePubKey(
      accountPublicKey,
      accountChainCode,
      0
    );
    return { parentPublicKey, parentChainCode };
  }
}
