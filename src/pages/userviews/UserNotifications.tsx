import { Notification } from "../../model/domain";


export interface NotificationsMap {
    TEMPERATURE: Notification,
    HUMIDITY: Notification,
    PM10: Notification,
    PM25: Notification,
    CAR: Notification
}

export interface UserNotificationsProps {
    notifications: NotificationsMap
}

export function UserNotifications({ notifications }: UserNotificationsProps) {
    console.log(notifications)
    return (<>
        {notifications}
    </>);
}
