import {gql} from "@apollo/client/core";

export const GetTokenTransfers = gql`
query GetTokenTransfers($address: [Identity!]) {
  # first query on Ethereum
  ethereum: TokenTransfers(
    input: {filter: {_or: {from: {_in: $address}, to: {_in: $address}}}, blockchain: ethereum, limit: 50}
  ) {
    TokenTransfer {
      amount
      formattedAmount
      blockTimestamp
      token {
        symbol
        name
        decimals
      }
      from {
        addresses
        socials {
          dappName
          profileName
        }
        domains {
          dappName
        }
      }
      to {
        addresses
        socials {
          dappName
          profileName
        }
        domains {
          name
          dappName
        }
      }
      type
      blockchain
    }
  }
  # second query on Polygon
  polygon: TokenTransfers(
    input: {filter: {_or: {from: {_in: $address}, to: {_in: $address}}}, blockchain: polygon, limit: 50}
  ) {
    TokenTransfer {
      amount
      formattedAmount
      blockTimestamp
      token {
        symbol
        name
        decimals
      }
      from {
        addresses
        socials {
          dappName
          profileName
        }
        domains {
          dappName
        }
      }
      to {
        addresses
        socials {
          dappName
          profileName
        }
        domains {
          name
          dappName
        }
      }
      type
      blockchain
    }
  }
}
`