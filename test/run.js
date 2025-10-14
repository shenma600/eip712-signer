import { execSync } from 'child_process';

const key = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'; // test key only
const sig = execSync('node src/cli.js sign --key '+key+' --data sample/permit.json').toString().trim();
const out = execSync('node src/cli.js recover --sig "'+sig+'" --data sample/permit.json').toString().trim();
if (!out.startsWith('0x')) throw new Error('Recover failed');
console.log('✅ Sign & recover OK ->', out);
