import {gql} from "@apollo/client/core";

import {paginatedQuery} from "../../index";
import {RecommendedUser} from "../interfaces/recommended-user";
import formatLensFollowings from "../utils/format-lens-followings";

export interface FollowLens {
    followingOnLens: boolean,
    followedOnLens: boolean
}
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

export interface LensFollowingAddress extends FollowingAddress {
    follows?: FollowLens;
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
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}, blockchain: ALL, limit: 200}
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
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}}
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

const fetchLensFollowings = async (address: string): Promise<LensFollowingAddress[]> => {

    const lensFollowingsResponse = await paginatedQuery<SocialFollowingsData>(socialFollowingsQuery, {
        user: address,
    })

    return lensFollowingsResponse.flatMap(r => r.SocialFollowings.Following? formatLensFollowings(r.SocialFollowings.Following?.map(follower => follower.followingAddress)) : [])
};

export default fetchLensFollowings;
