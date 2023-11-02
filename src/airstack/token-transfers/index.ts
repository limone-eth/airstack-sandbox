import {GetTokenTransfersResponse, TokenTransfer, TokenTransferIdentity} from "./interface";
import {GetTokenTransfers} from "./queries";

import {paginatedQuery} from "../index";

export const GetWalletTokenTransfers = async (walletAddressOrEns: string): Promise<TokenTransferIdentity[]> => {
    const getTokenTransfersResponses = await paginatedQuery<GetTokenTransfersResponse>(GetTokenTransfers, {address: walletAddressOrEns})
    const ethereumTokenTransfers = getTokenTransfersResponses.map(getTokenTransfersResponse => getTokenTransfersResponse.ethereum?.TokenTransfer).filter(Boolean)
    const polygonTokenTransfers = getTokenTransfersResponses.map(getTokenTransfersResponse => getTokenTransfersResponse.polygon?.TokenTransfer).filter(Boolean)
    const tokenTransfers = ethereumTokenTransfers.concat(polygonTokenTransfers).flat();
    const tokenTransfersWithWallet = tokenTransfers.map(tokenTransfer => getTokenTransferIdentity(walletAddressOrEns, tokenTransfer))
    return tokenTransfersWithWallet;
}

export const isTokenTransferMatchingIdentity = (addressOrEns: string, tokenTransferIdentity: TokenTransferIdentity): boolean => {
    if (addressOrEns.includes(".eth")) {
        return tokenTransferIdentity.domains?.map(domain => domain.name?.toLowerCase()).includes(addressOrEns.toLowerCase())
    }
    return tokenTransferIdentity.addresses?.map(addr => addr.toLowerCase()).includes(addressOrEns.toLowerCase());
}

export const getTokenTransferIdentity = (addressOrEns: string, tokenTransfer: TokenTransfer): TokenTransferIdentity => {
    const fromIdentity = tokenTransfer.from;
    const toIdentity = tokenTransfer.to;
    const isToIdentity = isTokenTransferMatchingIdentity(addressOrEns, toIdentity) || null
    const isFromIdentity = isTokenTransferMatchingIdentity(addressOrEns, fromIdentity) || null
    // eslint-disable-next-line no-nested-ternary
    return isToIdentity ? fromIdentity : (isFromIdentity ? toIdentity : null)
}