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
		let errors = {};

		/* Client Validation Start */

		//Username not found
		if (!true && username) {
			errors = { ...errors, username: "Username not found" };
		}

		//Password not correct
		if (!true && password) {
			errors = { ...errors, repeatPassword: "Password not correct" };
		}

		if (errors) {
			setFormError({
				...errors,
			});
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
				navigate("/user");
			} else if (response.status == 400) {
				const data = await response.json();
				setFormError({ serverError: data.error });
			}
		} catch (error) {
			console.error("Error during login:", error);
		}

		/*Server Validation End */
	};

	return (
		<main className="flex justify-center min-h-screen bg-blue">
			<form
				onSubmit={handleSubmit}
				className="h-fit rounded-lg self-center form-section"
			>
				<section className="flex flex-col w-80">
					<h1 className="font-bold text-2xl mb-12 text-center">Sing In</h1>

					{/* USERNAME */}
					<section className="mb-4">
						<section className="relative input-section">
							<input
								type="text"
								placeholder="Username"
								id="username"
								name="username"
								value={formData.username}
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
							<p className="text-red-500">{formError.username}</p>
						)}
					</section>

					{/* PASSWORD */}
					<section className="mb-10">
						<section className="relative input-section">
							<input
								type="text"
								placeholder="Password"
								id="password"
								name="password"
								value={formData.password}
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
							<p className="text-red-500">{formError.password}</p>
						)}
					</section>

					<button className="text-white font-bold rounded-full justify-center py-5 w-100 bg-blue-prime btn hover:bg-blue-600 focus-within:bg-blue-600">
						{isLoading ? <>Loading</> : <>Submit</>}
					</button>
					{formError?.serverError && (
						<p className="text-red-500 text-center">{formError.serverError}</p>
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
