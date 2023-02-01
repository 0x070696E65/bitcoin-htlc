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
  const txId = "64c67cd588c3d5025f9f4e87cbab22505d467613fc0f05a448212940f7ee2397"
  const contractAddress = "tb1qlqudw78g9fncn83qdr79p0g4vmvwn7erha9v35sngv0h7uxsyvzsawu04w"
  const witnessScript = "aa2086b81cc3f4b1ab2c0012ec5c12dc3910bc25c24a1ddedcf344e74263895a53f187632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d670374e724b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac"
  const proof = "717934d6f8392a882a3e3ace607269160e48a75807f0e9bd994eb5f055456e83"
  const lockTime = 3;
  //lock(network, true, baseUrl, 3, Alice, Bob, sendingSat, feeSat);
  //withdraw(network, true, baseUrl, txId, contractAddress, witnessScript, Bob, proof, feeSat);
  //refund(network, true, baseUrl, txId, contractAddress, witnessScript, Alice, feeSat);
})();
