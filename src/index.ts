import "dotenv/config"
import {init} from "@airstack/node";

import {fetchOnChainGraphData} from "./airstack/onchain-graph";

export const main = async () => {
    init(process.env.AIRSTACK_API_KEY, 'dev');
    console.time("start")
    const recommendedUsers = await fetchOnChainGraphData("limone.eth")
    console.timeEnd("start")
    return recommendedUsers;
}

main().then(() => {
    process.exit(0)
})