/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { throttle } from "lodash";

import { INotification } from "./Notification.tsx";

import List from "../../../../shared/components/List/List.tsx";
import ListItem from "../../../../shared/components/List/ListItem.tsx";
import RenderIf from "../../../../shared/components/RenderIf.tsx";

import NotificationImg from "../../../../assets/notification.svg";
import NoNotification from "../../../../assets/notification-empty.svg";

const RenderMessage = ({
	condition,
	img,
	description,
}: {
	condition: boolean;
	img: string;
	description: string;
}) => {
	return (
		<RenderIf condition={condition}>
			<div className="flex flex-col items-center p-6">
				<img src={img} className="h-36" />
				<p className="py-6">{description}</p>
			</div>
		</RenderIf>
	);
};

const RenderNotification = ({
	notification,
	onReadNotification,
}: {
	notification: INotification;
	onReadNotification: (id: string) => void;
}) => {
	return (
		<div
			className={`h-full flex flex-col justify-between items-start before:absolute before:left-0 ${
				notification?.is_read
					? "before:bg-gray-300"
					: notification.notification_category === "tpc"
					? "before:bg-accent-1"
					: "before:bg-accent-2"
			} before:w-2 before:h-full`}
			onClick={() => onReadNotification(notification?.id)}
		>
			<div className="py-2 space-y-2">
				<p>{notification?.description}</p>
				<p className="text-sm text-gray-400 text-right">
					{notification?.timestamp}
				</p>
			</div>
		</div>
	);
};
interface Props {
	isAllowed: boolean;
	notifications: INotification[];
	onReadNotification: (id: string) => void;
}

const NotificationsList = ({
	isAllowed,
	notifications,
	onReadNotification,
}: Props) => {
	const MAX_ITEMS = 10;
	const [unreadNotifications, setUnreadNotifications] = useState<string[]>([]);
	const [notifItems, setNotifItems] = useState<INotification[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	// Initially render first 10 notifications
	useEffect(() => {
		setNotifItems(notifications.slice(0, MAX_ITEMS));
	}, []);

	useEffect(() => {
		if (notifications.length) {
			const unread = notifications
				.filter((notification) => !notification.is_read)
				.map((notification) => notification?.id);

			setUnreadNotifications(unread);
		}
	}, [notifications]);

	const fetchNotifications = throttle(() => {
		setIsFetching(true);

		// Simulating the fetch operation for notifications
		// Fetched 10 notifications at a time
		setTimeout(() => {
			const newItems = notifications.slice(
				notifItems.length,
				notifItems.length + MAX_ITEMS
			);
			setNotifItems((prevItems) => [...prevItems, ...newItems]);
			setIsFetching(false);
		}, 1000);
	}, 1000);

	const handleScroll = (e) => {
		const { scrollHeight, scrollTop, clientHeight } = e.target;
		const bottom = scrollHeight - scrollTop === clientHeight;

		if (bottom && !isFetching) fetchNotifications();
	};

	return (
		<>
			<RenderIf condition={isAllowed && unreadNotifications.length !== 0}>
				<p className="text-right px-4 text-primary-500 text-sm font-medium">
					Unread ({unreadNotifications.length})
				</p>
			</RenderIf>

			<RenderMessage
				condition={!isAllowed}
				img={NotificationImg}
				description="Notifications are turned off"
			/>

			<RenderMessage
				condition={!notifications.length && isAllowed}
				img={NoNotification}
				description="No new notifications"
			/>

			<RenderIf condition={isAllowed}>
				<List
					className="max-h-[300px] h-fit overflow-hidden overflow-y-auto scroll-smooth"
					onScroll={handleScroll}
				>
					{notifItems.map((notification) => (
						<ListItem
							key={notification?.id}
							className={`${
								notification?.is_read
									? "bg-gray-100 text-gray-500 font-light"
									: "bg-white"
							}`}
						>
							<RenderNotification
								notification={notification}
								onReadNotification={onReadNotification}
							/>
						</ListItem>
					))}
					{isFetching && (
						<p className="text-center text-sm text-gray-400 py-4">
							Loading ....
						</p>
					)}
				</List>
			</RenderIf>
		</>
	);
};

export default NotificationsList;
