import {gql} from "@apollo/client/core";

import {FollowLens} from "./fetch-lens-followings";

import {paginatedQuery} from "../../index";
import {RecommendedUser} from "../interfaces/recommended-user";
import formatLensFollowersData from "../utils/format-lens-followers";

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
}

export interface LensFollowerAddress extends FollowerAddress {
    follows?: FollowLens;
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
    input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}, blockchain: ALL, limit: 200}
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
          input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}}
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

const fetchLensFollowers = async (address: string): Promise<LensFollowerAddress[]> => {

    const lensFollowersResponse = await paginatedQuery<SocialFollowersData>(socialFollowersQuery, {
        user: address,
    })

    return lensFollowersResponse.flatMap(r => r.SocialFollowers.Follower ? formatLensFollowersData(r.SocialFollowers.Follower.map(follower => follower.followerAddress)) : [])
};

export default fetchLensFollowers;
