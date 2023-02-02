import * as bitcoin from 'bitcoinjs-lib';
import axios from "axios";
const crypto = require('crypto');

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

export async function getCurrentBlockHeight(baseUrl: string): Promise<number>{
    const endpoint = baseUrl;
    return new Promise(function(resolve, reject) {
        axios
        .get(endpoint)
        .then(res=>{
            resolve(res.data.height);
        })
        .catch(error=>{
            reject(error)
        })
    })
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
    for (let len = utxos.length, i = 0; i < len; i++) {
        const { hash, index, value, script } = utxos[i];
        psbt.addInput({
            hash,
            index,
            // sequence: 0xffffffff,
            // IMPORTANT: needs for a tx with witness!
            witnessUtxo: {
                script: Buffer.from(script, 'hex'),
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
    
/**
 * UTXOを取得
 * @return {Array<{hash, index, value, script}>}
 */
export function getUtxos({ address, testnet = false }: any): Promise<[]> {
    const endpoint = `https://api.blockcypher.com/v1/btc/${testnet ? "test3" : "main"}/addrs/${address}?unspentOnly=true&includeScript=true`;
    console.log("Fetching UTXOs from " + endpoint);
    return new Promise(function(resolve, reject) {
        axios
        .get(endpoint)
        .then((res) => {
            let txrefs: any = [];
            if(res.data.txrefs != undefined) txrefs = txrefs.concat(res.data.txrefs);
            if(res.data.unconfirmed_txrefs != undefined) txrefs = txrefs.concat(res.data.unconfirmed_txrefs);
            const ret: any = [];
            for (let len = txrefs.length, i = 0; i < len; i++) {
                const item = txrefs[i];
                const hash = item.tx_hash;
                const index = item.tx_output_n;
                const value = item.value;
                const script = item.script;
                ret.push({
                hash,
                index,
                value,
                script,
                });
            }
            resolve(ret);
        })
        .catch(err=>{
            reject(err)
        })
    })
}

export async function getTransactionData(baseUrl: string, txId: string): Promise<any>{
    const endpoint = `${baseUrl}/txs/${txId}`;
    return new Promise(function(resolve, reject) {
        axios
        .get(endpoint)
        .then((res) => {
            resolve(res.data)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

export async function postTransaction(baseUrl: string, txHex: string, testnet = false): Promise<any> {
    const endpoint = `${baseUrl}/txs/push`;
    console.log("Broadcasting Transaction to " + endpoint);
    return new Promise(function(resolve, reject) {
        axios
        .post(endpoint, {
            "tx": txHex
        })
        .then(res=>{
            resolve(res.data);
        })
        .catch(error=>{
            reject(error)
        })
    })
}