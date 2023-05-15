import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateProfile from "./pages/CreateProfile";
import SignIn from "./pages/SignIn";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<CreateProfile />} />
					<Route path="login" element={<SignIn />} />
					<Route path="user/:username" element={<SignIn />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
