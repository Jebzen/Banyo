import { useState } from "react";
import "../styles/form.css";

export default function SignIn() {
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

	const handleSubmit = (e: any) => {
		e.preventDefault();
		let errors = {};

		/*Validation Start */

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

						<button className="text-white font-bold rounded-full justify-center py-5 w-100 bg-blue-prime hover:bg-blue-700 focus-within:bg-blue-700">
							Log in
						</button>
					</section>
				</form>
			</main>
		</>
	);
}
