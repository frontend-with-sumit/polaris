import { FaRegBell } from "react-icons/fa6";
import { BiSolidBellRing } from "react-icons/bi";
import { useContext, useEffect, useRef, useState } from "react";
import Switch from "../../../../shared/components/Switch/Switch";
import RenderIf from "../../../../shared/components/RenderIf";
import useClickOutside from "../../../../shared/hooks/useClickOutside";
import NotificationsList from "./NotificationsList";
import notificationCtx from "../../../../shared/contexts/notificationContext";

const RenderNotificationBells = ({
	isAllowed,
	isSeen,
	hasUnread,
	onToggleNotification,
}: {
	isAllowed: boolean;
	isSeen: boolean;
	hasUnread: boolean;
	onToggleNotification: () => void;
}) => {
	return (
		<>
			<RenderIf condition={isAllowed && hasUnread}>
				<BiSolidBellRing
					size={25}
					className={`text-accent-3 cursor-pointer ${
						!isSeen ? "animate-vibrate" : ""
					}`}
					onClick={onToggleNotification}
				/>
			</RenderIf>

			<RenderIf condition={!isAllowed || !hasUnread}>
				<FaRegBell
					size={25}
					className="cursor-pointer"
					onClick={onToggleNotification}
				/>
			</RenderIf>
		</>
	);
};

const RenderNotificationSettings = ({
	allowNotifications,
	onChangeSetting,
}: {
	allowNotifications: boolean;
	onChangeSetting: () => void;
}) => {
	return (
		<>
			<div className="flex justify-between px-4">
				<p className="font-medium">{`Turn ${
					allowNotifications ? "off" : "on"
				} notifications`}</p>
				<Switch isChecked={allowNotifications} onChange={onChangeSetting} />
			</div>
			<hr />
		</>
	);
};

export interface INotification {
	id: string;
	description: string;
	notification_category: "tpc" | "lcurr";
	is_read: boolean;
	timestampIdx: number;
	timestamp: string | number;
}

interface INotificationControl {
	notificationsAllowed: boolean;
	hasUnread: boolean;
	isSeen: boolean;
	showNotifications: boolean;
}

const Notification = () => {
	const notifCtx = useContext(notificationCtx);
	const [notificationItems, setNotificationItems] = useState<INotification[]>(
		[]
	);
	const [notificationControl, setNotificationControl] =
		useState<INotificationControl>({
			notificationsAllowed: true,
			hasUnread: false,
			isSeen: false,
			showNotifications: false,
		});

	const notificationRef = useRef<HTMLDivElement>(null);

	const handleNotificationControl = (settings: { [k: string]: boolean }) => {
		const controlCenterClone: INotificationControl = { ...notificationControl };
		for (const [key, value] of Object.entries(settings)) {
			controlCenterClone[key] = value;
		}

		setNotificationControl(controlCenterClone);
	};

	useClickOutside(notificationRef, () =>
		handleNotificationControl({ showNotifications: false })
	);

	useEffect(() => {
		if (notifCtx?.notifications.length) {
			const notificationsFromCtx = notifCtx?.notifications;

			const unreadNotifications = notificationsFromCtx.some(
				(notification) => !notification?.is_read
			);
			handleNotificationControl({
				hasUnread: unreadNotifications,
				isSeen: false,
			});
			setNotificationItems(notificationsFromCtx);
		} else setNotificationItems([]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifCtx?.notifications]);

	const markAsRead = (notificationId: string) => {
		const notificationsClone = [...notificationItems];
		const notification = notificationsClone.find(
			(notification) => notification?.id === notificationId
		);

		if (notification) {
			notification.is_read = true;
			setNotificationItems(notificationsClone);

			// dispatch an action to highlight the timestamp on graph
			notifCtx?.updateActiveTimestamp(notification?.timestampIdx);
		}
	};

	const handleAllowNotification = () =>
		handleNotificationControl({
			notificationsAllowed: !notificationControl?.notificationsAllowed,
		});

	const handleShowNotification = () =>
		handleNotificationControl({
			showNotifications: !notificationControl?.showNotifications,
			isSeen: true,
		});

	return (
		<section className="relative" ref={notificationRef}>
			<RenderNotificationBells
				isAllowed={notificationControl?.notificationsAllowed}
				isSeen={notificationControl?.isSeen}
				hasUnread={notificationControl?.hasUnread}
				onToggleNotification={handleShowNotification}
			/>

			<RenderIf condition={notificationControl?.showNotifications}>
				<div className="absolute top-8 right-0 min-w-[380px] bg-white drop-shadow-sm pt-4 rounded-md z-10 space-y-3">
					<RenderNotificationSettings
						allowNotifications={notificationControl?.notificationsAllowed}
						onChangeSetting={handleAllowNotification}
					/>

					{/* Notifications list */}
					{/* TODO: On notification click highlight the timestamp on chart */}
					<NotificationsList
						isAllowed={notificationControl?.notificationsAllowed}
						notifications={notificationItems}
						onReadNotification={markAsRead}
					/>
				</div>
			</RenderIf>
		</section>
	);
};

export default Notification;
