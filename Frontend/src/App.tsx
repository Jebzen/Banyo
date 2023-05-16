import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateProfile from "./pages/CreateProfile";
import SignIn from "./pages/SignIn";
import PrivateRoutes from "./utils/PrivateRoutes";
import UserProfile from "./pages/UserProfile";
import UpdateProfile from "./pages/UpdateProfile";
import AdminRoute from "./utils/AdminRoute";
import Dashboard from "./pages/Dashboard";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Navigate to="/create" />} />
				<Route path="/create" element={<CreateProfile />} />
				<Route path="/login" element={<SignIn />} />
				<Route element={<PrivateRoutes />}>
					<Route element={<UserProfile />} path="/user/:username" />
					<Route element={<UpdateProfile />} path="/edit/:username" />
				</Route>
				<Route element={<AdminRoute />}>
					<Route element={<Dashboard />} path="/dashboard" />
				</Route>
				<Route path="*" element={<SignIn />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
