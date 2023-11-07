import {gql} from "@apollo/client/core";

import {paginatedQuery} from "../../index";
import {PoapRecommendedUser, RecommendedUser} from "../interfaces/recommended-user";
import formatPoapsData from "../utils/format-poaps";

interface PoapEvent {
    eventId: string;
    isVirtualEvent: boolean;
}

interface Poap {
    eventId: string;
    poapEvent: PoapEvent;
}

interface PoapDataResponse {
    Poaps: {
        Poap: Poap[];
    };
}

export interface PoapHolder {
    eventId: string;
    poapEvent: {
        eventName: string;
        contentValue: {
            image: {
                extraSmall: string;
            };
        };
    };
    attendee: {
        owner: PoapUser;
    };
}

export interface PoapUser extends RecommendedUser {
    poaps?: {
        name: string, image:string, eventId: string
    }[]
}

interface PoapHoldersDataResponse {
    Poaps: {
        Poap: PoapHolder[];
    };
}

const userPoapsEventIdsQuery = gql`
query MyQuery($address: Identity!) {
  Poaps(input: {filter: {owner: {_eq: $address}}, blockchain: ALL}) {
    Poap {
      eventId
      poapEvent {
        isVirtualEvent
      }
    }
  }
}
`;

const poapsByEventIdsQuery = gql`
query MyQuery($eventIds: [String!]) {
  Poaps(input: {filter: {eventId: {_in: $eventIds}}, blockchain: ALL}) {
    Poap {
      eventId
      poapEvent {
        eventName
        contentValue {
          image {
            extraSmall
          }
        }
      }
      attendee {
        owner {
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
        }
      }
    }
  }
}
`;

export const fetchPoapHolders = async (eventId: string) => paginatedQuery<PoapHoldersDataResponse>(poapsByEventIdsQuery,
        { eventIds: [eventId] })

const fetchPoapsData = async (address: string, existingUsers: RecommendedUser[] = []): Promise<PoapRecommendedUser[]> => {
    const poapEventsResponse = (await paginatedQuery<PoapDataResponse>(userPoapsEventIdsQuery,
        { address }));
    let poapEventIds = poapEventsResponse.flatMap(r => r.Poaps.Poap?.filter(poap => !poap.poapEvent.isVirtualEvent)
        .map(poap => poap.eventId) ?? []);

    poapEventIds = [
        "107809",
        "148642",
        "101181",
        "143724",
        "144275",
        "141589",
        "103093"
    ]
    const poapHoldersResponse = await paginatedQuery<PoapHoldersDataResponse>(poapsByEventIdsQuery,
        { eventIds: poapEventIds })

    return formatPoapsData(poapHoldersResponse.flatMap(r => r.Poaps.Poap), existingUsers);
};

export default fetchPoapsData;
