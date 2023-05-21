import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Wrapper() {
	const navigate = useNavigate();

	const [hasRendered, setHasRendered] = useState(true);

	useEffect(() => {
		const hasRenderedBefore = sessionStorage.getItem("hasRendered");
		if (!hasRenderedBefore) {
			// Component is rendered for the first time in the session
			sessionStorage.setItem("hasRendered", "true");
			console.log("session");
		}
		setHasRendered(true);
	}, []);

	if (!hasRendered) {
		//Check URL
		const apiUrl = import.meta.env.VITE_BACKEND_PATH;
		fetch(apiUrl + "/init")
			.then((response) => {
				if (!response.ok) {
					navigate("/404");
				}
				//console.log(response);
				return response.json();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((e) => {
				console.error(e);
				//navigate("/404");
			});
	}

	//Login check
	const token = localStorage.getItem("jwsToken");

	return <Outlet />;
}
