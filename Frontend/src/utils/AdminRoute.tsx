import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import checkToken from "./CheckToken";

const AdminRoute = (WrappedComponent: any) => {
	return () => {
		const [isAuthenticated, setIsAuthenticated] = useState<any>(false);
		const [isLoading, setIsLoading] = useState(true);

		useEffect(() => {
			checkToken().then((isAuthenticated) => {
				setIsAuthenticated(isAuthenticated);
				setIsLoading(false);
			});
		}, []);

		if (isLoading) {
			return <div>Loading...</div>;
		}

		if (
			!isAuthenticated ||
			isAuthenticated?.user?.username.toLowerCase() !== "admin"
		) {
			return <Navigate to="/login" />;
		}

		return <WrappedComponent />;
	};
};

export default AdminRoute;
