import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";

function App() {
	return (
		<div>
			<Routes>
				<Route path="/" Component={Home} />
				<Route path="/visualize" Component={Dashboard} />
			</Routes>
		</div>
	);
}

export default App;
