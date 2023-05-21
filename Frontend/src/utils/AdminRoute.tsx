//taken from https://github.com/divanov11/React-router-v6-protected-routes/blob/master/src/utils/PrivateRoutes.js
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
	const apiUrl = import.meta.env.VITE_BACKEND_PATH;
	//console.log("Private Route");

	const jwsToken = localStorage.getItem("jwstoken");

	//TO DO, token security
	if (jwsToken === null) {
		return <Navigate to="/login" />;
	}

	fetch(apiUrl + "/user")
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				return <Navigate to="/login" />;
			}
		})
		.then((data) => {
			if (data.user.username !== "ADMIN") {
				return <Outlet />;
			}
			return <Navigate to="/login" />;
		});
};

export default AdminRoute;
