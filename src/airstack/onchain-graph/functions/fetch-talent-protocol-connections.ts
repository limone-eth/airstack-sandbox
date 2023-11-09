import { gql } from '@apollo/client/core';

import { fetchTalentProtocolConnections } from '../../../talent-protocol';
import { fetchAllPagesQuery } from '../../index';
import { RecommendedUser, TalentProtocolRecommendedUser } from '../interfaces/recommended-user';
import formatTalentProtocolConnectionsData from '../utils/format-talent-protocol-connections';

interface SocialQueryResult {
  Socials: {
    Social: {
      userAddressDetails: RecommendedUser;
    }[];
  };
}

const allSocialsQuery = gql`
  query GetAllSocials($addresses: [Identity!]) {
    Socials(input: { filter: { identity: { _in: $addresses } }, blockchain: ethereum }) {
      Social {
        userAddressDetails {
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
`;

export const fetchTalentProtocolConnectionsData = async (
  address: string,
  existingUsers: RecommendedUser[]
): Promise<TalentProtocolRecommendedUser[]> => {
  const talentProtocolConnections = await fetchTalentProtocolConnections(address);
  const talentProtocolConnectionsAddresses = talentProtocolConnections.map(
    (talentProtocol) => talentProtocol.wallet_address
  );
  const talentProtocolConnectionSocial: TalentProtocolRecommendedUser[] = (
    await fetchAllPagesQuery<SocialQueryResult>(allSocialsQuery, {
      addresses: talentProtocolConnectionsAddresses,
    })
  )
    .flatMap((tp) => tp.Socials.Social)
    .map((tp) => {
      const matchingConnection = talentProtocolConnections.find((tpc) =>
        tp.userAddressDetails.addresses.some((addr) => addr === tpc.wallet_address)
      );
      if (!matchingConnection) {
        return null;
      }
      return {
        ...tp.userAddressDetails,
        ...(matchingConnection ? { connectionType: matchingConnection.connection_type } : {}),
      };
    })
    .filter(Boolean);
  return formatTalentProtocolConnectionsData(talentProtocolConnectionSocial, existingUsers);
};
