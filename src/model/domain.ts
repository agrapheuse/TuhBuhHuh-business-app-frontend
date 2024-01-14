export enum ValueType {
    TEMPERATURE, HUMIDITY, PM10, PM25, OZONE, CAR, HEAVY, BIKE, PEDESTRIAN, V85
}

export interface Notification {
    uuid: string,
    userUUID: string,
    timeCreated: string,
    type: ValueType,
    threshold: number,
    value: number,
}
