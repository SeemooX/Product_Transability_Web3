/* format is the following:
        stepTypeID: stepCode
*/

export const transporterStatus: Record<string, number> = {
    PICKED_UP: 2,
    DELIVERED_TO_WAREHOUSE: 3,
    PICKED_UP_FROM_WAREHOUSE: 6,
    DELIVERED_TO_STORE: 7,
};

export const warehouseStatus: Record<string, number> = {
    RECEIVED_AT_WAREHOUSE: 4,
    READY_FOR_DISPATCH: 5,
};

export const storeStatus: Record<string, number> = {
    AVAILABLE_FOR_SALE: 8,
};