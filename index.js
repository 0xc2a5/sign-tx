import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import "dotenv/config.js";

const {
  RECIPIENT_ADDRESS,
  TEST_API_KEY,
  TEST_PRIVATE_KEY
} = process.env;

const settings = {
  apiKey: TEST_API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

const wallet = new Wallet(TEST_PRIVATE_KEY);

async function main() {
  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    'latest'
  );

  const transaction = {
    to: RECIPIENT_ADDRESS,
    value: Utils.parseEther('0.001'), // 0.001 worth of ETH being sent
    gasLimit: '21000',
    maxPriorityFeePerGas: Utils.parseUnits('5', 'gwei'),
    maxFeePerGas: Utils.parseUnits('20', 'gwei'),
    nonce: nonce,
    type: 2,
    chainId: 5, // sepolia transaction
  };

  const rawTransaction = await wallet.signTransaction(transaction);
  console.log('Raw tx: ', rawTransaction);
  const tx = await alchemy.core.sendTransaction(rawTransaction);
  console.log(`https://spolia.etherscan.io/tx/${tx.hash}`);
}

main();