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
  //lock(network, true, baseUrl, 3, Alice, Bob, sendingSat, feeSat);
  //withdraw(network, true, baseUrl, "8f3368c94e9612cf8667f56f12ec5a22261c5e097331270dc04f116f166c0a8d", "tb1qtd8z86gv0e68gdclfrfkuyjk9v6az2m8q2d2fd9zhlv553uqcrqq7x6f47", "aa2019aee0e9f5916cbd2a96e4707ae851b3aecd3a094af1261a10c382fc37ad56b087632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d67036ae724b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac", Bob, "fa86c053566962425bafc51efe57452cdcf3b5766033de95986103376e36217c", feeSat);
  //refund(network, true, baseUrl, "29f8faa916b360e043d4ae5efef824509de945e0147b519fef2f7dde0f967a3d", "tb1q9tqh0mm0txmvnhv5uy8yl7mt77a09qkd4ez2gp6q7q8txh6fkvyqucswr3", "aa20881a4aca432c6c802ccc8bf8e86f87e77010e25d70ba847d242a195795d53b6a87632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d67036be724b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac", 2418539, Bob, feeSat);
})();
