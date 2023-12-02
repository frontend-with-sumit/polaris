import { createContext } from "react";
import { INotification } from "../../components/Dashboard/Header/Notifications/Notification";

export interface NotificationContextData {
	notifications: INotification[];
	activeTimestamp: number;
	updateNotifications: (items: INotification[]) => void;
	updateActiveTimestamp: (item: number) => void;
}

const notificationCtx = createContext<NotificationContextData | undefined>(
	undefined
);

export default notificationCtx;
