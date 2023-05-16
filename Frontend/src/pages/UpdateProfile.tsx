import { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/form.css";

export default function UpdateProfile() {
	const { username } = useParams();

	const [formData, setFormData] = useState({
		user: username ? username : "",
		email: "",
		oldpassword: "",
		newpassword: "",
		repeatPassword: "",
	});

	const [formError, setFormError] = useState<any>({});

	const { user, email, oldpassword, newpassword, repeatPassword } = formData;

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
		if (user.toLowerCase() === "admin" || user.length < 1) {
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

		//Not old password
		if (!oldpassword) {
			errors = { ...errors, oldpassword: "Not current password" };
		}

		//Password not strong enough
		//Password pattern: upper and lower case, number, symbol and at least 7 characters
		//Regex with help from https://regex101.com/
		const passwordPattern =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
		if (!newpassword.match(passwordPattern)) {
			errors = { ...errors, newpassword: "Password not strong enough" };
		}

		//Repeat Password not repeated
		if (newpassword !== repeatPassword) {
			errors = { ...errors, repeatPassword: "Passwords not the same" };
		}

		if (errors) {
			setFormError({
				...errors,
			});
			return;
		}
		/*Validation End */
	};

	return (
		<>
			<main className="flex justify-center min-h-screen">
				<form
					onSubmit={handleSubmit}
					className="h-fit rounded-lg self-center form-section"
				>
					<section className="flex flex-col w-80">
						<h1 className="font-bold text-2xl mb-12 text-center">
							Update Profile
						</h1>

						{/* USERNAME */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="text"
									placeholder="Username"
									id="username"
									name="username"
									value={user}
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

						{/* OLD PASSWORD */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="text"
									placeholder="Password"
									id="password"
									name="password"
									value={formData.oldpassword}
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
							{formError?.oldpassword && (
								<p className="text-red-500">{formError.oldpassword}</p>
							)}
						</section>

						{/* OLD PASSWORD */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="text"
									placeholder="Password"
									id="password"
									name="password"
									value={formData.newpassword}
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
							{formError?.newpassword && (
								<p className="text-red-500">{formError.newpassword}</p>
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

						<button className="text-white font-bold rounded-full justify-center py-5 w-100 bg-blue-prime btn hover:bg-blue-600 focus-within:bg-blue-600">
							Submit
						</button>
					</section>
				</form>
			</main>
		</>
	);
}
