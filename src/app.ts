import { ApiPromise, WsProvider } from "@polkadot/api";
const heapdump = require('heapdump');
console.log("process.version", process.version);

const appchainEndpoint =
  "wss://rpc.polkadot.io";

let appchain: any;
async function init() {
  const wsProvider = new WsProvider(appchainEndpoint);
  appchain = await ApiPromise.create({
    provider: wsProvider,
  });
  return appchain;
}

let timer: any = null;
async function start() {
  const api = await init();
  test(api);
}

let count = 0;
async function test(api: ApiPromise) {
  await causeMemoryLeak(api, count);

  count++;
  setTimeout(() => test(api), 500);
}

setInterval(() => {
  console.log("Create heapsnapshot!");
  heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
}, 5 * 60 * 1000);


async function causeMemoryLeak(api: ApiPromise, count: number) {
  const hash = await api.rpc.chain.getBlockHash(count);
  console.log(`${count} : ${hash.toString()}`);
  await api.rpc.chain.getBlock(hash);
}


async function noMemoryLeak(api: ApiPromise, count: number) {
  const hash = await api.rpc.chain.getBlockHash(count);
  console.log(`${count} : ${hash.toString()}`);
}


start();
