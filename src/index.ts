import "dotenv/config"
import {init} from "@airstack/node";

import {GetWalletTokenTransfers} from "./airstack/token-transfers";


export const main = async () => {
    await init(process.env.AIRSTACK_API_KEY, 'dev');
    console.time("start")
    // const poaps = await GetAddressesWithPOAPsInCommon("limone.eth");
    const tokenTransfers = await GetWalletTokenTransfers("limone.eth")
    console.timeEnd("start")
    return tokenTransfers;
}

main().then(() => {
    process.exit(0)
})