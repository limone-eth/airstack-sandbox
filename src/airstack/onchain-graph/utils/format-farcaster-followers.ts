import {FarcasterFollowerAddress, FollowFarcaster} from "../functions/fetch-farcaster-followers";

function formatFarcasterFollowersData(followers: FarcasterFollowerAddress[]): FarcasterFollowerAddress[] {
    const recommendedUsers: FarcasterFollowerAddress[] = [];

    for (let i = 0; i < followers.length; i++){
        const follower = followers[i];
        const existingUserIndex = recommendedUsers.findIndex(
            ({ addresses: recommendedUsersAddresses }) =>
                recommendedUsersAddresses?.some?.(address =>
                    follower.addresses?.includes?.(address)
                )
        );

        const following = Boolean(follower?.mutualFollowing?.Following?.length);

        if (existingUserIndex !== -1) {
            const follows: FollowFarcaster = recommendedUsers?.[existingUserIndex]?.follows;

            follows.followedOnFarcaster = true;
            follows.followingOnFarcaster = follows.followingOnFarcaster || following;

            recommendedUsers[existingUserIndex] = {
                ...follower,
                ...recommendedUsers[existingUserIndex],
                follows
            };
        } else {
            recommendedUsers.push({
                ...follower,
                follows: {
                    followingOnFarcaster: following,
                    followedOnFarcaster: true
                }
            });
        }
    }
    return recommendedUsers;
}

export default formatFarcasterFollowersData;