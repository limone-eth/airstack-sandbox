import {PoapHolder, PoapUser} from "../functions/fetch-poaps";

function formatPoapsData(poaps: PoapHolder[]): PoapUser[] {
    const recommendedUsers: PoapUser[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const poap of poaps ?? []) {
        const { attendee, poapEvent, eventId } = poap ?? {};
        const { eventName: name, contentValue } = poapEvent ?? {};
        const { addresses } = attendee?.owner ?? {};
        const existingUserIndex = recommendedUsers.findIndex(
            ({ addresses: recommendedUsersAddresses }) =>
                recommendedUsersAddresses?.some?.((address) =>
                    addresses?.includes?.(address)
                )
        );
        if (existingUserIndex !== -1) {
            recommendedUsers[existingUserIndex].addresses = [
                ...(recommendedUsers?.[existingUserIndex]?.addresses ?? []),
                ...addresses,
            ]?.filter((address, index, array) => array.indexOf(address) === index);
            const _poaps = recommendedUsers?.[existingUserIndex]?.poaps || [];
            const poapExists = _poaps.some((_poap) => _poap.eventId === eventId);
            if (!poapExists) {
                _poaps?.push({ name, image: contentValue?.image?.extraSmall, eventId });
                recommendedUsers[existingUserIndex].poaps = [..._poaps];
            }
        } else {
            recommendedUsers.push({
                ...(attendee?.owner ?? {}),
                poaps: [{ name, image: contentValue?.image?.extraSmall, eventId }],
            });
        }
    }
    return recommendedUsers;
}

export default formatPoapsData;