export interface RecommendedUser {
    addresses?: string[];
    domains?: {
        name: string;
        isPrimary: boolean;
    }[];
    socials?: {
        dappName: string;
        blockchain: string;
        profileName: string;
        profileImage: string;
        profileTokenId: string;
        profileTokenAddress: string;
    }[];
    xmtp?: {
        isXMTPEnabled: boolean;
    };
}