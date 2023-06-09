import { useState } from "react";
import "../styles/form.css";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
	const navigate = useNavigate();

	const apiUrl = import.meta.env.VITE_BACKEND_PATH;

	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [formError, setFormError] = useState<any>({});

	const { username, password } = formData;

	//Handle change event for all Inputs
	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		let errors = {};

		/* Client Validation Start */

		//Username not found
		if (username.length < 1) {
			errors = { ...errors, username: "Username invalid" };
		}

		//Password not correct
		if (password.length < 4) {
			errors = { ...errors, password: "Password not correct" };
		}

		if (Object.keys(errors).length != 0) {
			setIsLoading(false);
			setFormError({
				...errors,
			});
			return;
		}
		/* Client Validation End */

		/*Server Validation Start */

		try {
			const response = await fetch(apiUrl + "/users/login", {
				method: "POST",
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("jwsToken", data.token);
				if (data.user.username.toLowerCase() === "admin") {
					navigate("/dashboard");
					return;
				}
				navigate("/user");
			} else {
				setIsLoading(false);
				const data = await response.json();
				setFormError({ serverError: data.error });
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Error during login:", error);
		}

		/*Server Validation End */
	};

	return (
		<main className="flex justify-center min-h-screen bg-blue">
			<form
				onSubmit={handleSubmit}
				className="h-fit md:rounded-lg self-center form-section p-5 md:px-11 md:pt-16 md:pb-20 w-full md:w-fit flex flex-col justify-center"
			>
				<section className="flex flex-col justify-center w-fit mx-auto">
					<h1 className="font-bold text-2xl mb-12 text-center">Sing In</h1>

					{/* USERNAME */}
					<section className="mb-4">
						<section className="relative input-section">
							<input
								type="text"
								placeholder="Username"
								id="username"
								name="username"
								value={username}
								onChange={handleChange}
								className="p-5 border-2 rounded-md border-solid flex w-full"
							/>
							<label
								htmlFor="username"
								className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
							>
								Username
							</label>
						</section>
						{formError?.username && (
							<p className="text-red-500 text-sm">{formError.username}</p>
						)}
					</section>

					{/* PASSWORD */}
					<section className="mb-10">
						<section className="relative input-section">
							<input
								type="password"
								placeholder="Password"
								id="password"
								name="password"
								value={password}
								onChange={handleChange}
								className="p-5 border-2 rounded-md border-solid flex w-full"
							/>
							<label
								htmlFor="password"
								className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
							>
								Password
							</label>
						</section>
						{formError?.password && (
							<p className="text-red-500 text-sm">{formError.password}</p>
						)}
					</section>

					<button className="text-white font-bold rounded-full justify-center py-5 w-100 bg-blue-prime btn hover:bg-blue-600 focus-within:bg-blue-600">
						{isLoading ? <>Loading</> : <>Submit</>}
					</button>
					{formError?.serverError && (
						<p className="text-red-500 text-center text-sm mt-3">
							{formError.serverError}
						</p>
					)}
				</section>
				<section className="text-center mt-5 text-xs text-gray-500">
					<span>Need an account? </span>
					<a href="/create" className="underline">
						Create a profile
					</a>
				</section>
			</form>
		</main>
	);
}
