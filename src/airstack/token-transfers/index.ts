import {GetTokenTransfersResponse, TokenTransfer} from "./interface";
import {GetTokenTransfers} from "./queries";

import {paginatedQuery} from "../index";

export const GetWalletTokenTransfers = async (walletAddress: string): Promise<TokenTransfer[]> => {
    const getTokenTransfersResponses = await paginatedQuery<GetTokenTransfersResponse>(GetTokenTransfers, {address: walletAddress})
    const ethereumTokenTransfers = getTokenTransfersResponses.map(getTokenTransfersResponse => getTokenTransfersResponse.ethereum?.TokenTransfer).filter(Boolean)
    const polygonTokenTransfers = getTokenTransfersResponses.map(getTokenTransfersResponse => getTokenTransfersResponse.polygon?.TokenTransfer).filter(Boolean)
    const tokenTransfers = ethereumTokenTransfers.concat(polygonTokenTransfers);
    return tokenTransfers.flat()
}