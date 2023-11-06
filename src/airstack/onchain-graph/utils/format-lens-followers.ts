import {LensFollowerAddress} from "../functions/fetch-lens-followers";
import {FollowLens} from "../functions/fetch-lens-followings";

function formatLensFollowersData(followers: LensFollowerAddress[]): LensFollowerAddress[] {
    const recommendedUsers: LensFollowerAddress[] = [];

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
            const follows: FollowLens = recommendedUsers?.[existingUserIndex]?.follows;

            follows.followedOnLens = true;
            follows.followingOnLens = follows.followingOnLens || following;

            recommendedUsers[existingUserIndex] = {
                ...follower,
                ...recommendedUsers[existingUserIndex],
                follows
            };
        } else {
            recommendedUsers.push({
                ...follower,
                follows: {
                    followingOnLens: following,
                    followedOnLens: true
                }
            });
        }
    }
    return recommendedUsers;
}

export default formatLensFollowersData;