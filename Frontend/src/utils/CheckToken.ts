const checkToken = async () => {
	const apiUrl = import.meta.env.VITE_BACKEND_PATH;
	const token = localStorage.getItem("jwsToken");

	try {
		const response = await fetch(apiUrl + "/user", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data; // Assuming the response contains a 'valid' property indicating token validity
		} else {
			// Handle error response
			throw new Error("Token verification failed");
		}
	} catch (error) {
		//console.error("Error occurred during token verification:", error);
		return false;
	}
};

export default checkToken;
