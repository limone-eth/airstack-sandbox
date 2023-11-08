import axios, { AxiosRequestConfig, Method } from 'axios';

import { FollowTalentProtocol } from '../airstack/onchain-graph/interfaces/recommended-user';

export enum TalentProtocolConnectionType {
  MUTUAL = 'mutual_subscription',
  SUBSCRIBER = 'subscriber',
  SUBSCRIBING = 'subscribing',
}

export interface TalentProtocolConnection {
  username: string;
  name: string;
  // eslint-disable-next-line camelcase
  wallet_address: string;
  // eslint-disable-next-line camelcase
  user_invested_amount: string;
  // eslint-disable-next-line camelcase
  connected_user_invested_amount: string;
  // eslint-disable-next-line camelcase
  connection_type: TalentProtocolConnectionType;
  // eslint-disable-next-line camelcase
  connected_at: string;
  // eslint-disable-next-line camelcase
  profile_picture_url: string;
}

export const paginateTalentProtocolApiRequest = async <T>(
  method: Method,
  url: string,
  queryParams: { key: string; value: string }[] = []
): Promise<T[]> => {
  let result: T[] = [];
  const parsedUrl = new URL(url);

  // Append query parameters to the URL
  queryParams.forEach((param) => {
    parsedUrl.searchParams.append(param.key, param.value);
  });

  let response;
  do {
    const config: AxiosRequestConfig = {
      method,
      url: parsedUrl.href,
      headers: { 'X-API-KEY': process.env.TALENT_PROTOCOL_API_KEY },
    };

    // Make the request using the config
    // eslint-disable-next-line no-await-in-loop
    response = await axios.request<T>(config).catch((e) => {
      console.error(e);
    });

    // Assume response.data has a structure { connections: T[], pagination?: { cursor?: string } }
    result = result.concat(response.data.connections.flat());

    // Update the URL with the new cursor if it exists
    if (response.data.pagination?.next_cursor) {
      parsedUrl.searchParams.set('next_cursor', response.data.pagination.cursor);
    }
  } while (response.data.connections.length > 0 && response.data.pagination?.next_cursor);

  return result;
};

export const fetchTalentProtocolConnections = async (address: string): Promise<TalentProtocolConnection[]> =>
  paginateTalentProtocolApiRequest<TalentProtocolConnection>(
    'get',
    'https://api.talentprotocol.com/api/v1/connections',
    [
      {
        key: 'id',
        value: address,
      },
    ]
  );

export const talentProtocolConnectionTypeToFollowObject = (
  connectionType: TalentProtocolConnectionType
): FollowTalentProtocol => {
  switch (connectionType) {
    case TalentProtocolConnectionType.MUTUAL:
      return {
        followedOnTalentProtocol: true,
        followingOnTalentProtocol: true,
      };
    case TalentProtocolConnectionType.SUBSCRIBER:
      return {
        followedOnTalentProtocol: true,
        followingOnTalentProtocol: false,
      };
    case TalentProtocolConnectionType.SUBSCRIBING:
      return {
        followedOnTalentProtocol: false,
        followingOnTalentProtocol: true,
      };
    default:
      return {
        followedOnTalentProtocol: false,
        followingOnTalentProtocol: false,
      };
  }
};
