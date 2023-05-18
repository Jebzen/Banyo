//taken from https://github.com/divanov11/React-router-v6-protected-routes/blob/master/src/utils/PrivateRoutes.js
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
	console.log("Private Route");

	const jwsToken = localStorage.getItem("jwstoken");

	//TO DO, token security
	if (jwsToken === null) {
		//return <Navigate to="/login" />;
	}

	return true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
