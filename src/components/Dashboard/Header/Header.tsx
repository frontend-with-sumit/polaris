import Notification from "./Notifications/Notification";
import Profile from "./Profile";

const Header = () => {
	return (
		<header className="bg-white py-4 px-8 shadow-sm flex justify-end items-center gap-6">
			<Notification />
			<Profile />
		</header>
	);
};

export default Header;
