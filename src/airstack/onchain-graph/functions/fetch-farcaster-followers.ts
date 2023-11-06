import {gql} from "@apollo/client/core";

import {paginatedQuery} from "../../index";
import {RecommendedUser} from "../interfaces/recommended-user";
import formatFarcasterFollowersData from "../utils/format-farcaster-followers";

export interface FollowFarcaster {
    followingOnFarcaster: boolean,
    followedOnFarcaster: boolean
}
interface FollowerAddress extends RecommendedUser {
    mutualFollowing: {
        Following: {
            followingAddress: {
                socials: {
                    profileName: string;
                };
            };
        }[];
    };
    follows?: FollowFarcaster;
}

export interface FarcasterFollowerAddress extends FollowerAddress {
    follows?: FollowFarcaster;
}

interface Follower {
    followerAddress: FollowerAddress;
}

interface SocialFollowersData {
    SocialFollowers: {
        Follower: Follower[];
    };
}

const socialFollowersQuery = gql`
query MyQuery($user: Identity!) {
  SocialFollowers(
    input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 200}
  ) {
    Follower {
      followerAddress {
        addresses
        domains {
          name
          isPrimary
        }
        socials {
          dappName
          blockchain
          profileName
          profileImage
          profileTokenId
          profileTokenAddress
        }
        xmtp {
          isXMTPEnabled
        }
        mutualFollowing: socialFollowings(
          input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}}
        ) {
          Following {
            followingAddress {
              socials {
                profileName
              }
            }
          }
        }
      }
    }
  }
}
`;

const fetchFarcasterFollowers = async (address: string): Promise<FarcasterFollowerAddress[]> => {
    const farcasterFollowersResponse = await paginatedQuery<SocialFollowersData>(socialFollowersQuery, {
        user: address,
    })

    return farcasterFollowersResponse.flatMap(r => r.SocialFollowers.Follower ? formatFarcasterFollowersData(r.SocialFollowers.Follower.map(follower => follower.followerAddress)) : []);
};

export default fetchFarcasterFollowers;
