import { Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import Sidebar from "./components/Dashboard/Sidebar";

import "./App.css";

function App() {
	return (
		<main className="bg-gray-50 flex min-h-screen min-w-screen">
			<Sidebar />
			<div>
				<header>Header</header>
				<Routes>
					<Route path="/" />
					<Route path="/visualize" Component={Dashboard} />
				</Routes>
			</div>
		</main>
	);
}

export default App;
