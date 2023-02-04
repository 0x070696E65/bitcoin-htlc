import * as bitcoin from 'bitcoinjs-lib';
import { btcSwap } from './btcSwap';
import Mona from "./mona"
import BitCoin from "./bitcoin"
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';

const ECPair = ECPairFactory(ecc);
const aliceWif = "cNaEjitvA19JZxWAFyCFMsm16TvGEmVAW3AkPnVr8E9vgwdZWMGV"
const bobWif = "cQBwuzEBYQrbWKFZZFpgitRpdDDxUrT1nzvhDWhxMmFtWdRnrCSm"

const coininfo = require('coininfo')
//const network = coininfo.monacoin.test.toBitcoinJS()
const network = bitcoin.networks.testnet
const Alice = ECPair.fromWIF(aliceWif, network);
const Bob = ECPair.fromWIF(bobWif, network);

const swap = new btcSwap(new BitCoin(), network);
const amount = 5000;
const fee = 1800;
const txId = "d40fbb97b950da5dcfb716c9a81fee8f6284ca08ddaa6797c5a57958932927fe"
const contractAddress = "tb1qp857uznpqha0zasm95y20zmw3rwlzmsc22r6gng4d0qg64qqljdqnek6zj"
const witnessScript = "aa20b78e98c4faa90b748d77af5992c8cf12fd1592c8ee517f6a64171ba5f1f9470b87632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d6703b4e824b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac"
const proof = "77028a41f5265fed98d0baf07a9c1477b62498c197d6bb87188b06263917dbe1"
const lockTime = 2;
//swap.lock(lockTime, Alice, Bob, amount, fee)
//swap.withdraw(txId, contractAddress, witnessScript, Bob, proof, fee)
swap.refund(txId, contractAddress, witnessScript, Alice, fee)