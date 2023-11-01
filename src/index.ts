import "dotenv/config"
import {init} from "@airstack/node";

import {GetAddressesWithPOAPsInCommon} from "./airstack/poaps-in-common";

export const main = async () => {
    await init(process.env.AIRSTACK_API_KEY, 'dev');
    console.time("start")
    const poaps = await GetAddressesWithPOAPsInCommon("limone.eth");
    console.timeEnd("start")
    return poaps;
}

main().then(() => {
    process.exit(0)
})