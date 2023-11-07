import fetchFarcasterFollowers from "./functions/fetch-farcaster-followers";
import fetchFarcasterFollowings from "./functions/fetch-farcaster-followings";
import fetchLensFollowers from "./functions/fetch-lens-followers";
import fetchLensFollowings from "./functions/fetch-lens-followings";
import fetchPoapsData from "./functions/fetch-poaps";
import {RecommendedUser} from "./interfaces/recommended-user";
import calculatingScore from "./score";
import sortByScore from "./sort";

export const fetchOnChainGraphData = async (address: string) => {
    let recommendedUsers: RecommendedUser[] = []
    recommendedUsers = await fetchPoapsData(address);
    recommendedUsers = await fetchFarcasterFollowings(address, recommendedUsers);
    recommendedUsers = await fetchLensFollowings(address, recommendedUsers);
    recommendedUsers = await fetchFarcasterFollowers(address, recommendedUsers);
    recommendedUsers = await fetchLensFollowers(address, recommendedUsers);

    const onChainGraphUsersWithScore = recommendedUsers.map(user => calculatingScore(user)).filter(Boolean);

    // finalOnChainGraphUsers can be stored in database
    return sortByScore(onChainGraphUsersWithScore);
};