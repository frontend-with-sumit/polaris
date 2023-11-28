import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard/Dashboard";
import Sidebar from "./components/Dashboard/Sidebar/Sidebar";
import Header from "./components/Dashboard/Header/Header";

import "./App.css";

function App() {
	return (
		<main className="bg-gray-50 flex min-h-screen min-w-screen">
			<Sidebar />
			<div className="flex flex-col w-full">
				<Header />
				<Routes>
					<Route path="/" />
					<Route path="/visualize" Component={Dashboard} />
				</Routes>
			</div>
			<Toaster />
		</main>
	);
}

export default App;
