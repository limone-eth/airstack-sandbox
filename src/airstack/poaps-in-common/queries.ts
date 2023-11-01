import { gql } from '@apollo/client/core';

export const GetAllPOAPs = gql`
  query GetAllPOAPs($address: [Identity!]) {
    Poaps(input: { filter: { owner: { _in: $address } }, blockchain: ALL, limit: 10 }) {
      Poap {
        id
        eventId
        poapEvent {
          eventName
          eventURL
          startDate
          endDate
          country
          city
          contentValue {
            image {
              extraSmall
              large
              medium
              original
              small
            }
          }
        }
        owner {
          identity
          primaryDomain {
            name
          }
          addresses
        }
      }
    }
  }
`;

export const GetAllAddressesSocialsAndENSOfPOAP = gql`
  query GetAllAddressesSocialsAndENSOfPOAP($eventId: [String!]) {
    Poaps(input: { filter: { eventId: { _in: $eventId } }, blockchain: ALL, limit: 100 }) {
      Poap {
        owner {
          identity
          primaryDomain {
            name
          }
          domains {
            name
          }
          socials {
            profileName
            dappName
            dappSlug
          }
        }
        poapEvent {
          eventId
        }
        tokenId
      }
    }
  }
`;
