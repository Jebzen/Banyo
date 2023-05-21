import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import checkToken from "./CheckToken";

const PrivateRoute = (WrappedComponent: any) => {
	return () => {
		const [isAuthenticated, setIsAuthenticated] = useState(false);
		const [isLoading, setIsLoading] = useState(true);

		useEffect(() => {
			checkToken().then((isAuthenticated) => {
				console.log(isAuthenticated);
				setIsAuthenticated(isAuthenticated);
				setIsLoading(false);
			});
		}, []);

		if (isLoading) {
			return <div>Loading...</div>;
		}

		if (!isAuthenticated) {
			return <Navigate to="/login" />;
		}

		return <WrappedComponent />;
	};
};

export default PrivateRoute;
