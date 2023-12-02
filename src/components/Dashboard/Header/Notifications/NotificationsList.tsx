import { useEffect, useState } from "react";
import List from "../../../../shared/components/List/List.tsx";
import ListItem from "../../../../shared/components/List/ListItem.tsx";
import { INotification } from "./Notification.tsx";
import RenderIf from "../../../../shared/components/RenderIf.tsx";
import NotificationImg from "../../../../assets/notification.svg";
import NoNotification from "../../../../assets/notification-empty.svg";

interface Props {
	isAllowed: boolean;
	notifications: INotification[];
	onReadNotification: (id: string) => void;
}

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

const NotificationsList = ({
	isAllowed,
	notifications,
	onReadNotification,
}: Props) => {
	const [unreadNotifications, setUnreadNotifications] = useState<string[]>([]);

	useEffect(() => {
		if (notifications.length) {
			const unread = notifications
				.filter((notification) => !notification.is_read)
				.map((notification) => notification?.id);

			setUnreadNotifications(unread);
		}
	}, [notifications]);

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
				description="No new notifications are available"
			/>

			<RenderIf condition={isAllowed}>
				<List className="max-h-[300px] h-fit overflow-hidden overflow-y-auto scroll-smooth">
					{notifications.map((notification) => (
						<ListItem
							key={notification?.id}
							className={`${
								notification?.is_read
									? "bg-gray-100 text-gray-500 font-light"
									: "bg-white"
							}`}
						>
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
						</ListItem>
					))}
				</List>
			</RenderIf>
		</>
	);
};

export default NotificationsList;
