import * as bitcoin from 'bitcoinjs-lib';
import { getCurrentBlockHeight, createHashPair, getUtxos, buildAndSignTx, postTransaction} from './utils'
import { ECPairInterface } from 'ecpair';
const bip65 = require('bip65');

export async function lock(network: bitcoin.networks.Network, testnet: boolean, baseUrl: string, lockHeight: number, sender: ECPairInterface, receiver: ECPairInterface, sendingSat: number, feeSat: number){
    const blockHeight = await getCurrentBlockHeight(baseUrl);
    const TIMELOCK = blockHeight + lockHeight;
    const timelock = bip65.encode({blocks: TIMELOCK})
    console.log('Timelock expressed in block height: ', timelock)
    const hashPair = createHashPair();
    console.log("proof:", hashPair.proof)
    console.log("secret:", hashPair.secret)
    const swapContract = swapContractGenerator(receiver.publicKey, sender.publicKey, hashPair.secret, timelock)
    console.log('Swap contract (witness script):')
    console.log(swapContract.toString('hex'))

    const p2wsh = bitcoin.payments.p2wsh({redeem: {output: swapContract, network}, network})
    console.log('P2WSH swap smart contract address:', p2wsh.address)

    const senderAddress = bitcoin.payments.p2wpkh({ pubkey: sender.publicKey, network }).address;
    const contractAddress = p2wsh.address;

    // UTXOを取得
    const utxos = await getUtxos({ address: senderAddress, testnet });
    if (!utxos || utxos.length <= 0) {
        console.log(`ERROR: 指定されたアドレス ${senderAddress} には現在利用可能なUTXOがありませんでした。`);
        return process.exit(0);
    }
    // トランザクションHEXを作成
    const txHex = buildAndSignTx({
        sender,
        address: senderAddress,
        network,
        recipient: contractAddress,
        sendingSat,
        feeSat,
        utxos,
    });
    console.log('Transaction hexadecimal:')
    console.log(txHex)

    postTransaction(baseUrl, txHex, testnet)
    .then(result=>console.log('Transaction hash:', result.tx.hash))
    .catch(err=>console.error(err))
};

function swapContractGenerator(receiverPublicKey: Buffer, userRefundPublicKey: Buffer, PAYMENT_HASH: string, timelock: number) {
    return bitcoin.script.fromASM(
        `
        OP_HASH256
        ${PAYMENT_HASH}
        OP_EQUAL
        OP_IF
        ${receiverPublicKey.toString('hex')}
        OP_ELSE
        ${bitcoin.script.number.encode(timelock).toString('hex')}
        OP_CHECKLOCKTIMEVERIFY
        OP_DROP
        ${userRefundPublicKey.toString('hex')}
        OP_ENDIF
        OP_CHECKSIG
        `
        .trim()
        .replace(/\s+/g, ' '),
    );
}
