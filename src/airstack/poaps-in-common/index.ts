import {Poaps, SocialPoapOwner, SocialPoaps} from "./interface";
import {GetAllAddressesSocialsAndENSOfPOAP, GetAllPOAPs} from "./queries";

import {breakIntoChunks, removeDuplicatesByProperty} from "../../utils";
import {paginatedQuery} from "../index";

export const GetAddressesWithPOAPsInCommon = async(walletAddress: string): Promise<SocialPoapOwner[]> => {
    const walletPOAPs = await paginatedQuery<{Poaps: Poaps}>(GetAllPOAPs, {address: walletAddress})
    const poapEventIds = walletPOAPs.map(obj => obj.Poaps.Poap?.map(p => p.eventId).flat()).flat().filter(Boolean)
    const chunkEventIds = breakIntoChunks(poapEventIds, 50);
    // this might endup having duplicates
    const identities: SocialPoapOwner[][] = []
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of chunkEventIds) {
        const rawPoapOwners = await paginatedQuery<{Poaps: SocialPoaps}>(GetAllAddressesSocialsAndENSOfPOAP, {eventId: chunk})
        const poapOwners: SocialPoapOwner[] = rawPoapOwners.map(obj => obj.Poaps.Poap.map(poap => poap.owner).flat()).flat().filter(Boolean)
        identities.push(poapOwners);
    }
    return removeDuplicatesByProperty<SocialPoapOwner>(identities.flat(), "identity");
};
