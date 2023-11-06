import {gql} from "@apollo/client/core";

import {FollowFarcaster} from "./fetch-farcaster-followers";

import {paginatedQuery} from "../../index";
import {RecommendedUser} from "../interfaces/recommended-user";
import formatFarcasterFollowingsData from "../utils/format-farcaster-following";

interface FollowingAddress extends RecommendedUser {
    mutualFollower: {
        Follower: {
            followerAddress: {
                socials: {
                    profileName: string;
                };
            };
        }[];
    };
}

export interface FarcasterFollowingAddress extends FollowingAddress {
    follows?: FollowFarcaster;
}

interface Following {
    followingAddress: FollowingAddress;
}

interface SocialFollowingsData {
    SocialFollowings: {
        Following: Following[];
    };
}

const socialFollowingsQuery = gql`
query MyQuery($user: Identity!) {
  SocialFollowings(
    input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 200}
  ) {
    Following {
      followingAddress {
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
        mutualFollower: socialFollowers(
          input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}}
        ) {
          Follower {
            followerAddress {
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

const fetchFarcasterFollowings = async (address: string): Promise<FarcasterFollowingAddress[]> => {
    const farcasterFollowersResponse = await paginatedQuery<SocialFollowingsData>(socialFollowingsQuery, {
        user: address,
    })

    return farcasterFollowersResponse.flatMap(r => r.SocialFollowings.Following? formatFarcasterFollowingsData(r.SocialFollowings.Following.map(following => following.followingAddress)) : []);
};

export default fetchFarcasterFollowings;
