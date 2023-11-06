import {FarcasterFollowerAddress} from "./functions/fetch-farcaster-followers";
import {FarcasterFollowingAddress} from "./functions/fetch-farcaster-followings";
import {LensFollowerAddress} from "./functions/fetch-lens-followers";
import {LensFollowingAddress} from "./functions/fetch-lens-followings";
import {PoapUser} from "./functions/fetch-poaps";

const defaultScoreMap = {
    followedByOnLens: 5,
    followingOnLens: 7,
    followedByOnFarcaster: 5,
    followingOnFarcaster: 5,
    commonPoaps: 7,
};

const identityMap = (identities) =>
    identities.reduce((acc, identity) => {
        acc[identity] = true;
        return acc;
    }, {});

const isBurnedAddress = (address) => {
    if (!address) {
        return false;
    }
    address = address.toLowerCase();
    return (
        address === "0x0000000000000000000000000000000000000000" ||
        address === "0x000000000000000000000000000000000000dead"
    );
};

const calculatingScore = (user: PoapUser | FarcasterFollowerAddress | FarcasterFollowingAddress | LensFollowingAddress | LensFollowerAddress, scoreMap = defaultScoreMap): (PoapUser | FarcasterFollowerAddress | FarcasterFollowingAddress | LensFollowingAddress | LensFollowerAddress) & {_score: number} => {
    const identities = [user];
    if (
        user.addresses?.some((address) => identityMap(identities)[address]) ||
        user.domains?.some(({name}) => identityMap(identities)[name]) ||
        user.addresses?.some((address) => isBurnedAddress(address))
    ) {
        return null;
    }

    let score = 0;
    if ((user as LensFollowingAddress).follows?.followingOnLens) {
        score += scoreMap.followingOnLens;
    }
    if ((user as LensFollowerAddress).follows?.followedOnLens) {
        score += scoreMap.followedByOnLens;
    }
    if ((user as FarcasterFollowingAddress).follows?.followingOnFarcaster) {
        score += scoreMap.followingOnFarcaster;
    }
    if ((user as FarcasterFollowerAddress).follows?.followedOnFarcaster) {
        score += scoreMap.followedByOnFarcaster;
    }
    let uniquePoaps = [];
    if ((user as PoapUser).poaps) {
        const existingPoaps = {};
        uniquePoaps = (user as PoapUser).poaps.filter((poaps) => {
            if (poaps?.eventId && existingPoaps[poaps?.eventId]) {
                return false;
            }
            if (poaps?.eventId) {
                existingPoaps[poaps?.eventId] = true;
            }
            return true;
        });
        console.log(uniquePoaps)
        score += scoreMap.commonPoaps * (user as PoapUser).poaps.length;
    }

    return {
        ...user,
        _score: score,
    };
};

export default calculatingScore;