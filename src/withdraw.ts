import * as bitcoin from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
import {witnessStackToScriptWitness} from './witnessStackToScriptWitness';
import { postTransaction, getTransactionData } from "./utils";

export async function withdraw(network: bitcoin.networks.Network, testnet: boolean, baseUrl: string, txId: string, contractAddress: string, witnessScript: string, receiver: ECPairInterface, preImage: string, feeSat: number){
    const psbt = new bitcoin.Psbt({network});
    const receiverAddress = bitcoin.payments.p2wpkh({ pubkey: receiver.publicKey, network }).address;
    const txInfo = await getTransactionData(baseUrl, txId);
    let totalValue = 0;
    let value = 0;

    let index = 0;
    for(let i = 0; i < txInfo.outputs.length; i++){
        totalValue += txInfo.outputs[i].value;
        if(txInfo.outputs[i].addresses[0] == contractAddress){
            value = txInfo.outputs[i].value;
            index = i
        };
    }

    psbt
    .addInput({
        hash: txId,
        index,
        sequence: 0xfffffffe,
        witnessUtxo: {
            script: Buffer.from('0020' +
            bitcoin.crypto.sha256(Buffer.from(witnessScript, 'hex')).toString('hex'),
            'hex'),
            value
    },
        witnessScript: Buffer.from(witnessScript, 'hex')
    })
    psbt
        .addOutput({
            address: receiverAddress!,
            value: value - feeSat,
    })

    psbt.signInput(0, receiver)

    const PREIMAGE = preImage
    const getFinalScripts = (inputIndex: number, input: any, script: Buffer | (number | Buffer)[]) => {
        const decompiled = bitcoin.script.decompile(script)
        if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_HASH256) {
            throw new Error(`Can not finalize input #${inputIndex}`)
        }

        const witnessStackClaimBranch = bitcoin.payments.p2wsh({
            redeem: {
            input: bitcoin.script.compile([
                input.partialSig[0].signature,
                Buffer.from(PREIMAGE, 'hex'),
            ]),
            output: Buffer.from(witnessScript, 'hex')
            }
        })

        return {
            finalScriptSig: undefined,
            finalScriptWitness: witnessStackToScriptWitness(witnessStackClaimBranch.witness)
        }
    }
    psbt.finalizeInput(0, getFinalScripts)

    console.log('Transaction hexadecimal:')
    const txHex = psbt.extractTransaction().toHex();
    console.log(txHex)
    postTransaction(baseUrl, txHex, testnet)
    .then(result=>console.log('Transaction hash:', result.tx.hash))
    .catch(err=>console.error(err))
}
