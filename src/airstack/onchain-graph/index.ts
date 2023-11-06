import fetchFarcasterFollowers from "./functions/fetch-farcaster-followers";
import fetchFarcasterFollowings from "./functions/fetch-farcaster-followings";
import fetchLensFollowers from "./functions/fetch-lens-followers";
import fetchLensFollowings from "./functions/fetch-lens-followings";
import fetchPoapsData from "./functions/fetch-poaps";
import calculatingScore from "./score";
import sortByScore from "./sort";

export const fetchOnChainGraphData = async (address: string) => {
    const poapHolders =  await fetchPoapsData(address);
    const farcasterFollowings = await fetchFarcasterFollowings(address);
    const lensFollowings = await fetchLensFollowings(address)
    const farcasterFollowers = await fetchFarcasterFollowers(address);
    const lensFollowers = await fetchLensFollowers(address)
    const recommendedUsers = [...poapHolders, ...farcasterFollowers, ...lensFollowers, ...farcasterFollowings, ...lensFollowings];

    const onChainGraphUsersWithScore = recommendedUsers.map(user => calculatingScore(user));
    // finalOnChainGraphUsers can be stored in database
    return sortByScore(onChainGraphUsersWithScore);
};