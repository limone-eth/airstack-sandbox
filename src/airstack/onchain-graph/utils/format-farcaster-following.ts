import {FollowFarcaster} from "../functions/fetch-farcaster-followers";
import {FarcasterFollowingAddress} from "../functions/fetch-farcaster-followings";

function formatFarcasterFollowingsData(followings: FarcasterFollowingAddress[]): FarcasterFollowingAddress[] {
    const recommendedUsers: FarcasterFollowingAddress[] = [];
    for (let i = 0; i < followings.length; i++){
        const following = followings[i];
        const existingUserIndex = recommendedUsers.findIndex(
            ({ addresses: recommendedUsersAddresses }) =>
                recommendedUsersAddresses?.some?.(address =>
                    following.addresses?.includes?.(address)
                )
        );

        const followsBack = Boolean(following?.mutualFollower?.Follower?.[0]);
        if (existingUserIndex !== -1) {
            const follows: FollowFarcaster = recommendedUsers?.[existingUserIndex]?.follows;
            recommendedUsers[existingUserIndex] = {
                ...following,
                ...recommendedUsers[existingUserIndex],
                follows: {
                    ...follows,
                    followingOnFarcaster: true,
                    followedOnFarcaster: followsBack
                }
            };
        } else {
            recommendedUsers.push({
                ...following,
                follows: {
                    followingOnFarcaster: true,
                    followedOnFarcaster: followsBack
                }
            });
        }
    }
    return recommendedUsers;
}

export default formatFarcasterFollowingsData;