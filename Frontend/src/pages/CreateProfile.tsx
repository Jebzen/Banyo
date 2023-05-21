import { useEffect, useState } from "react";
import "../styles/form.css";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
	const navigate = useNavigate();

	const apiUrl = import.meta.env.VITE_BACKEND_PATH;

	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		repeatPassword: "",
		serverError: "",
	});

	const [formError, setFormError] = useState<any>({});

	const { username, email, password, repeatPassword } = formData;

	//Handle change event for all Inputs
	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});

		//Only delete relevant errors
		let erros = formError;
		delete erros[e.target.name];
		setFormError(erros);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		setFormError({});
		let errors = {};

		/*Client Validation Start */
		//Username invalid
		if (username.toLowerCase() === "admin" || username.length < 1) {
			errors = { ...errors, username: "Username invalid" };
		}

		//Email invalid
		//Regex with help from https://regex101.com/
		const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-Z]{2,}$/i;
		if (!email.match(emailPattern)) {
			errors = { ...errors, email: "Email invalid" };
		}

		//Password not strong enough
		//Password pattern: upper and lower case, number, symbol and at least 7 characters
		//Regex with help from https://regex101.com/
		const passwordPattern =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
		if (!password.match(passwordPattern)) {
			errors = { ...errors, password: "Password not strong enough" };
		}

		//Repeat Password not repeated
		if (password !== repeatPassword) {
			errors = { ...errors, repeatPassword: "Passwords not the same" };
		}

		if (Object.keys(errors).length != 0) {
			setIsLoading(false);
			setFormError({
				...errors,
			});
			return;
		}
		/*Client Validation End */

		/*Server Validation Start */

		try {
			const response = await fetch(apiUrl + "/users/create", {
				method: "POST",
				body: JSON.stringify(formData),
			});

			console.log(response);

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("jwstoken", data.token);
				navigate("/user");
			} else if (response.status == 400) {
				const data = await response.json();
				setFormError({ serverError: data.error });
			}
		} catch (error) {
			console.error("Error during login:", error);
		}

		/*Server Validation End */

		setIsLoading(false);
	};

	return (
		<>
			<main className="flex justify-center min-h-screen bg-blue">
				<form
					onSubmit={handleSubmit}
					className="h-fit rounded-lg self-center form-section"
				>
					<section className="flex flex-col w-80">
						<h1 className="font-bold text-2xl mb-12 text-center">
							Create Profile
						</h1>

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

						{/* EMAIL */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="email"
									placeholder="Email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="p-5 border-2 rounded-md border-solid flex w-full"
								/>
								<label
									htmlFor="email"
									className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
								>
									Email
								</label>
							</section>
							{formError?.email && (
								<p className="text-red-500">{formError.email}</p>
							)}
						</section>

						{/* PASSWORD */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="password"
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

						{/* REPEAT PASSWORD */}
						<section className="mb-10">
							<section className="relative input-section">
								<input
									type="password"
									placeholder="Repeat Password"
									id="repeatPassword"
									name="repeatPassword"
									value={formData.repeatPassword}
									onChange={handleChange}
									className="p-5 border-2 rounded-md border-solid flex w-full"
								/>
								<label
									htmlFor="repeatPassword"
									className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
								>
									Repeat Password
								</label>
							</section>
							{formError?.repeatPassword && (
								<p className="text-red-500">{formError.repeatPassword}</p>
							)}
						</section>

						<button
							disabled={isLoading}
							className="text-white font-bold rounded-full justify-center py-5 w-100 bg-blue-prime btn hover:bg-blue-600 focus-within:bg-blue-600 disabled:bg-slate-700"
						>
							{isLoading ? <>Loading</> : <>Submit</>}
						</button>
						{formError?.serverError && (
							<p className="text-red-500 text-center">
								{formError.serverError}
							</p>
						)}
					</section>

					<section className="text-center mt-5 text-xs text-gray-500">
						<span>Already got an account? </span>
						<a href="/login" className="underline">
							Log in
						</a>
					</section>
				</form>
			</main>
		</>
	);
}
