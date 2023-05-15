import { useState } from "react";
import "../styles/form.css";

export default function CreateProfile() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		repeatPassword: "",
	});

	const [formError, setFormError] = useState<any>({});

	const { username, email, password, repeatPassword } = formData;

	//Handle change event for all Inputs
	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		let errors = {};

		/*Validation Start */

		//Username invalid
		if (username.toLowerCase() === "admin" || username.length < 1) {
			errors = { ...errors, username: "Username invalid" };
		}

		//Username already taken
		if (!true) {
			errors = { ...errors, username: "Username already taken" };
		}

		//Email invalid
		//Regex with help from https://regex101.com/
		const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-Z]{2,}$/i;
		if (!email.match(emailPattern)) {
			console.log("email");
			errors = { ...errors, email: "Email not valid" };
		}

		//Email already taken
		if (!true) {
			errors = { ...errors, email: "Email already taken" };
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

		if (errors) {
			setFormError({
				...errors,
			});
		}
		/*Validation End */
	};

	return (
		<>
			<main className="flex justify-center min-h-screen">
				<form onSubmit={handleSubmit} className="h-fit rounded-lg self-center">
					<section className="flex flex-col w-80">
						<h1 className="font-bold text-xl mb-3 text-center">
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

						{/* REPEAT PASSWORD */}
						<section className="mb-10">
							<section className="relative input-section">
								<input
									type="text"
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

						<button className="text-white font-bold rounded-full justify-center py-5 w-100 hover:bg-blue-700 focus-within:bg-blue-700">
							Submit
						</button>
					</section>
				</form>
			</main>
		</>
	);
}
