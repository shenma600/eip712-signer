import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ethers } from 'ethers';

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

async function cmdSign({ key, data }) {
  const wallet = new ethers.Wallet(key);
  const typed = loadJSON(data);
  const sig = await wallet.signTypedData(typed.domain, typed.types, typed.message);
  console.log(sig);
}

async function cmdRecover({ sig, data }) {
  const typed = loadJSON(data);
  const digest = ethers.TypedDataEncoder.hash(typed.domain, typed.types, typed.message);
  const addr = ethers.recoverAddress(digest, sig);
  console.log(addr);
}

yargs(hideBin(process.argv))
  .command('sign', 'Sign EIP-712 data', y => y
    .option('key', { type:'string', demandOption:true, describe:'Private key (0x...)' })
    .option('data', { type:'string', demandOption:true, describe:'Path to typed data JSON' }),
    argv => cmdSign(argv)
  )
  .command('recover', 'Recover signer from signature', y => y
    .option('sig', { type:'string', demandOption:true })
    .option('data', { type:'string', demandOption:true }),
    argv => cmdRecover(argv)
  )
  .demandCommand(1)
  .help()
  .parse();
