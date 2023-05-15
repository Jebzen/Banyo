import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateProfile from "./pages/CreateProfile";
import SignIn from "./pages/SignIn";
import PrivateRoutes from "./utils/PrivateRoutes";
import UserProfile from "./pages/UserProfile";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<CreateProfile />} />
				<Route path="/login" element={<SignIn />} />
				<Route element={<PrivateRoutes />}>
					<Route element={<UserProfile />} path="/user/:username" />
				</Route>
				<Route path="*" element={<SignIn />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
