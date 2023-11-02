export interface GetTokenTransfersResponse {
    ethereum: {
        TokenTransfer: TokenTransfer[]
    }
    polygon: {
        TokenTransfer: TokenTransfer[]
    }
}

export interface TokenTransferIdentity {
    addresses: string[];
    socials: {
        dappName: string;
        profileName: string;
    }[];
    domains: {
        dappName: string;
    }[];
}

export interface TokenTransfer {
    amount: string;
    formattedAmount: string;
    blockTimestamp: number;
    token: {
        symbol: string;
        name: string;
        decimals: number;
    };
    from: TokenTransferIdentity;
    to: TokenTransferIdentity;
    type: string;
    blockchain: string;
}