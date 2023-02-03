import * as bitcoin from 'bitcoinjs-lib';
import axios from "axios";
const crypto = require('crypto');
import mempoolJS from "@mempool/mempool.js";

export interface HashPair {
    secret: string;
    proof: string;
}

export function createHashPair(): HashPair {
    const s = crypto.randomBytes(32);
    const p1 = crypto.createHash('sha256').update(s).digest();
    const p2 = crypto.createHash('sha256').update(p1).digest();
    return {
        proof: s.toString('hex'),
        secret: p2.toString('hex'),
    };
}

/**
 * WIFと指定したアドレスの整合性をチェック
 */
export function checkAddressByWif(address: string, wif: string, network: bitcoin.networks.Network) {
    const keyPair = bitcoin.ECPair.fromWIF(wif, network);
    const obj = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });
    if (obj.address !== address) {
        console.error("指定されたアドレスとWIFに整合性がありません。");
        return process.exit(0);;
    }
}

const { bitcoin: { transactions, blocks, addresses } } = mempoolJS({
    hostname: 'mempool.space',
    network: 'testnet'
});

export async function getTransactionData(txid: string): Promise<any>{
    return transactions.getTx({ txid });
}

/**
* トランザクションを作成＆署名されたトランザクションHexを返します。
*/
export function buildAndSignTx({
    sender,
    address,
    network,
    recipient,
    sendingSat,
    feeSat,
    utxos,
}: any) 
{
    // input元(utxo)のtxを追加:
    const psbt = new bitcoin.Psbt({ network });
    let total = 0;
    const pubKeyHash = bitcoin.crypto.hash160(sender.publicKey).toString('hex')
    for (let len = utxos.length, i = 0; i < len; i++) {
        const { txid, vout, value } = utxos[i];
        psbt.addInput({
            hash: txid,
            index: vout,
            // sequence: 0xffffffff,
            // IMPORTANT: needs for a tx with witness!
            witnessUtxo: {
                script: Buffer.from('0014' + pubKeyHash, 'hex'),
                value,
            },
        });
        total += value;
    }

    // output先(送金先)を追加:
    psbt.addOutput({
        address: recipient,
        value: sendingSat,
    });
    // NOTE: お釣りは送金元に返す:
    const changeSat = total - sendingSat - feeSat;
    if(changeSat<0){
        console.log(`ERROR: 残高が不足しています。残高(UTXOトータル): ${total} satoshi`);
        return process.exit(0);
    }
    psbt.addOutput({
        address: address,
        value: changeSat,
    });

    console.log("トランザクション詳細:");
    console.log("送金元:", address);
    console.log("着金先:", recipient);
    console.log("現在の送金元UTXOトータル残高(satoshi):", total);
    console.log("送金額(satoshi):", sendingSat);
    console.log("手数料(satoshi):", feeSat);
    console.log("お釣り(satoshi):", changeSat);
    console.log("");

    for (let len = utxos.length, i = 0; i < len; i++) {
        psbt.signInput(i, sender);
        psbt.validateSignaturesOfInput(i);
    }
    psbt.finalizeAllInputs();
    // tx hex取得
    const txHex = psbt.extractTransaction().toHex();
    return txHex;
}

export async function getUtxos({ address }: any): Promise<any> {
    return await addresses.getAddressTxsUtxo({ address });
}

export async function getCurrentBlockHeight(): Promise<number>{
    return await blocks.getBlocksTipHeight();
}

export async function postTransaction(txhex: string): Promise<any>{  
    const endpoint = "https://mempool.space/testnet/api/tx";
    console.log("Broadcasting Transaction to " + endpoint);
    return new Promise(function(resolve, reject) {
        axios
        .post(endpoint, txhex)
        .then(res=>{
            resolve(res.data);
        })
        .catch(error=>{
            reject(error)
        })
    })  
}
