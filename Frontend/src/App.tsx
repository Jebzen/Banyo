import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateProfile from "./pages/CreateProfile";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<CreateProfile />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
