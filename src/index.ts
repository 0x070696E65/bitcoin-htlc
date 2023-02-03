import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { lock } from "./lock"
import { withdraw } from "./withdraw"
import { refund } from "./refund"

const ECPair = ECPairFactory(ecc);

const network = bitcoin.networks.testnet
const testnet = true;
const baseUrl = `https://api.blockcypher.com/v1/btc/${testnet ? "test3" : "main"}`;

const { alice, bob } = require('../wallets.json')

const Alice = ECPair.fromWIF(alice[1].wif, network);
const Bob = ECPair.fromWIF(bob[1].wif, network);

(async()=>{
  const sendingSat = 5000;
  const feeSat = 1700;
  const txId = "e3d62b3a192dfe17f4c90f68758de164f1ae25aff8a4dd73d8e6a65dc6181f90"
  const contractAddress = "tb1qtrd3hq2h66lf7p86kq523jn4adeak8c7zulw9460yf5wz4x88ngqu3ja0j"
  const witnessScript = "aa20f296feceb54490af7fa0085d8da1657a0092a00750cb0b28caec10268425b57687632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d670333e824b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac"
  const proof = "32cf8ebe1a431bce781aaa47f1ca8573aeb5dcba235ebdf06458b938304d5adf"
  const lockTime = 2;
  //lock(network, true, baseUrl, lockTime, Alice, Bob, sendingSat, feeSat);
  //withdraw(network, true, baseUrl, txId, contractAddress, witnessScript, Bob, proof, feeSat);
  //refund(network, true, baseUrl, txId, contractAddress, witnessScript, Alice, feeSat);
})();
