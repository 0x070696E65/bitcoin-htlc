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
  const txId = "98c146d01cb9536e984e7ce4a7eabce5b154e8d1cd62490285ebdcce42ed2844"
  const contractAddress = "tb1qp8tdj5vck9s56lsyzs02sn7ljlmdjgkxlyt0q9y3javmsh44jw9qy6489s"
  const witnessScript = "aa2006004014b130c9aa363e3b0c3f5856a139ec5c0ad2f86035673a9feceaa3f80487632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d670392e724b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac"
  const proof = "e049d453b5de923fb495d0ace521f94ea515232ea332bb27432f48aec64a5879"
  const lockTime = 1;
  //lock(network, true, baseUrl, lockTime, Alice, Bob, sendingSat, feeSat);
  //withdraw(network, true, baseUrl, txId, contractAddress, witnessScript, Bob, proof, feeSat);
  //refund(network, true, baseUrl, txId, contractAddress, witnessScript, Alice, feeSat);
})();
