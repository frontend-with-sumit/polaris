import React from "react";
import notificationCtx, {
	NotificationContextData,
} from "../notificationContext";
import { INotification } from "../../../components/Dashboard/Header/Notifications/Notification";

interface Props {
	children: React.ReactNode;
	notifications: INotification[];
	activeTimestamp: number;
	onUpdateNotifications: (items: INotification[]) => void;
	onUpdateActiveTimestamp: (item: number) => void;
}

const NotificationProvider = ({
	children,
	notifications,
	activeTimestamp,
	onUpdateNotifications,
	onUpdateActiveTimestamp,
}: Props) => {
	const initialContextData: NotificationContextData = {
		notifications,
		activeTimestamp,
		updateNotifications: (items) => onUpdateNotifications(items),
		updateActiveTimestamp: (item: number) => onUpdateActiveTimestamp(item),
	};

	return (
		<notificationCtx.Provider value={initialContextData}>
			{children}
		</notificationCtx.Provider>
	);
};

export default NotificationProvider;
