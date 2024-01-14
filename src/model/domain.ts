export enum ValueType {
    TEMPERATURE = 0,
    HUMIDITY = 1,
    PM10 = 2,
    PM25 = 3,
    CAR = 4
}

export interface Notification {
    uuid: string,
    userUUID: string,
    timeCreated: string,
    type: ValueType,
    threshold: number,
    value: number,
}
