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
  const txId = "4e5dc85f4fd1e379f496abcb3bf0c8ab2982218b597e8a0267eb767c69e7692b"
  const contractAddress = "tb1qpznsuq88an8mf9h09zk7l94u32plh4ukm9xx0d9xxt2pnxlxm8sqclp4m3"
  const witnessScript = "aa20dff17b6d67736ac44cf00e0d136368c20b00d85daf3e8d2241161b663ff3478c87632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d670372e724b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac"
  const proof = "717934d6f8392a882a3e3ace607269160e48a75807f0e9bd994eb5f055456e83"
  const lockTime = 2418545;

  //lock(network, true, baseUrl, 2, Alice, Bob, sendingSat, feeSat);
  //withdraw(network, true, baseUrl, txId, contractAddress, witnessScript, Bob, proof, feeSat);
  refund(network, true, baseUrl, txId, contractAddress, witnessScript, lockTime, Alice, feeSat);
})();
