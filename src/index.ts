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
  const txId = "febfb72e432db26f31f091e85c1fe5a55b55718d92e9329fe9a27b1b767945c3"
  const contractAddress = "tb1qwcmx3fxu6ltgnd6pxw0rnzgk55p408vqzaga0yc08jqqsp8sgy8sg5xuys"
  const witnessScript = "aa20be81810b02e682d2adbd3e7598e8dd6cfeaabbcb9e542f6e4a973e9dcb3d31a587632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d670370e724b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac"
  const proof = "717934d6f8392a882a3e3ace607269160e48a75807f0e9bd994eb5f055456e83"
  const lockTime = 2418544;

  //lock(network, true, baseUrl, 1, Alice, Bob, sendingSat, feeSat);
  //withdraw(network, true, baseUrl, txId, contractAddress, witnessScript, Bob, proof, feeSat);
  //refund(network, true, baseUrl, txId, contractAddress, witnessScript, lockTime, Alice, feeSat);
})();
