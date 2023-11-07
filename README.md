# Airstack Sandbox

Node.js sandbox environment to play around with Airstack data.

In particular, this experiment is focused on recreating the OnChain-Graph use case that is performed client-side [on the Airstack Explorer](https://explorer.airstack.xyz/onchain-graph?identity=limone.eth).

## How to run
1. Copy the dotenv template `cp .env.template .env`
2. Populate `.env` with your AIRSTACK_API_KEY [you can get one here](https://docs.airstack.xyz/airstack-docs-and-faqs/get-started/get-api-key).
3. Install packages with your fav package manager `npm install` or `yarn install` or `bun install`
4. Build the project `npm run build``
5. Run `npm run start USER_ADDRESS_OR_ENS`. For example `npm run start limone.eth` or `npm run start vitalik.eth`
