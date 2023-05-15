//taken from https://github.com/divanov11/React-router-v6-protected-routes/blob/master/src/utils/PrivateRoutes.js
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
	const jwsToken = localStorage.getItem("jwstoken");

	return true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
