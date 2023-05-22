const checkToken = async () => {
	const apiUrl = import.meta.env.VITE_BACKEND_PATH;
	const token = localStorage.getItem("jwsToken");

	try {
		const response = await fetch(apiUrl + "/user", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (response.ok) {
			return data;
		} else {
			throw new Error("Token verification failed");
		}
	} catch (error) {
		//console.error("Error occurred during token verification:", error);
		return false;
	}
};

export default checkToken;
