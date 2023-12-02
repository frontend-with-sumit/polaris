import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard/Dashboard";
import Sidebar from "./components/Dashboard/Sidebar/Sidebar";
import Header from "./components/Dashboard/Header/Header";

import "./App.css";
import NotificationProvider from "./shared/contexts/Providers/NotificationProvider";
import { INotification } from "./components/Dashboard/Header/Notifications/Notification";
import { useState } from "react";

function App() {
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [activeTimestamp, setActiveTimestamp] = useState<number>(-1); // -1 indicates no value selected

	return (
		<main className="bg-gray-50 flex min-h-screen min-w-screen">
			<>
				<Sidebar />
				<div className="flex flex-col w-full">
					<NotificationProvider
						notifications={notifications}
						activeTimestamp={activeTimestamp}
						onUpdateNotifications={(items: INotification[]) =>
							setNotifications(items)
						}
						onUpdateActiveTimestamp={(tsIdx: number) =>
							setActiveTimestamp(tsIdx)
						}
					>
						<Header />
						<Routes>
							<Route path="/" />
							<Route path="/visualize" Component={Dashboard} />
						</Routes>
					</NotificationProvider>
				</div>
			</>

			<Toaster />
		</main>
	);
}

export default App;
