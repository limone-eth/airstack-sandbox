export interface PoapOwner {
    identity: string;
    primaryDomain: {
        name: string;
    };
    addresses: string[];
}

export interface Poaps {
    Poap: Poap[];
    // eslint-disable-next-line camelcase
    pageInfo_cursor: {
        prevCursor: string;
        nextCursor: string;
    }
}

export interface Poap {
    id: number;
    eventId: number;
    poapEvent: {
        eventName: string;
        eventURL: string;
        startDate: string;
        endDate: string;
        country: string;
        city: string;
        contentValue: {
            image: {
                extraSmall: string;
                large: string;
                medium: string;
                original: string;
                small: string;
            };
        };
    };
    owner: PoapOwner;
}

export interface SocialPoapOwner {
    identity: string;
    primaryDomain: {
        name: string;
    };
    domains: {
        name: string;
    }[];
    socials: {
        profileName: string;
        dappName: string;
        dappSlug: string;
    }[];
}

export interface SocialPoaps {
    Poap: SocialPoap[];
    // eslint-disable-next-line camelcase
    pageInfo_cursor: {
        prevCursor: string;
        nextCursor: string;
    }
}

export interface SocialPoap {
    owner: {
        identity: string;
        primaryDomain: {
            name: string;
        };
        domains: {
            name: string;
        }[];
        socials: {
            profileName: string;
            dappName: string;
            dappSlug: string;
        }[];
    };
    poapEvent: {
        eventId: number;
    };
    tokenId: number;
}