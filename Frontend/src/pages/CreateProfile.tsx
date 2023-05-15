import { useState } from "react";

export default function CreateProfile() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		repeatPassword: "",
	});

	const { username, email, password, repeatPassword } = formData;

	//Handle change event for all Inputs
	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		//Username already taken

		//Email invalid
		//Regex with help from https://regex101.com/
		const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-Z]{2,}$/;
		if (!email.match(emailPattern)) {
			console.error("Email not valid");
		}

		//Email already taken

		//Password not strong enough
		//Password pattern: upper and lower case, number, symbol and at least 7 characters
		//Regex with help from https://regex101.com/
		const passwordPattern =
			/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
		if (!password.match(passwordPattern)) {
			console.error("Passwords not strong enough");
		}

		//Repeat Password not repeated
		if (password !== repeatPassword) {
			console.error("Passwords doesn't match");
		}
	};

	return (
		<>
			<main className="flex justify-center min-h-screen">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col h-fit rounded-lg self-center"
				>
					<h1 className="font-bold text-xl mb-3 text-center">Create Profile</h1>

					{/* USERNAME */}
					<section className="relative mb-4 input-section">
						<input
							type="text"
							placeholder="Username"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="p-5 border-2 rounded-md border-solid"
						/>
						<label
							htmlFor="username"
							className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
						>
							Username
						</label>
					</section>

					{/* EMAIL */}
					<section className="relative mb-4 input-section">
						<input
							type="email"
							placeholder="Email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="p-5 border-2 rounded-md border-solid"
						/>
						<label
							htmlFor="email"
							className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
						>
							Email
						</label>
					</section>

					{/* PASSWORD */}
					<section className="relative mb-4 input-section">
						<input
							type="text"
							placeholder="Password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="p-5 border-2 rounded-md border-solid"
						/>
						<label
							htmlFor="password"
							className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
						>
							Password
						</label>
					</section>

					{/* REPEAT PASSWORD */}
					<section className="relative mb-10 input-section">
						<input
							type="text"
							placeholder="Repeat Password"
							id="repeatPassword"
							name="repeatPassword"
							value={formData.repeatPassword}
							onChange={handleChange}
							className="p-5 border-2 rounded-md border-solid"
						/>
						<label
							htmlFor="repeatPassword"
							className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
						>
							Repeat Password
						</label>
					</section>

					<button className="text-white font-bold rounded-full justify-center py-5 w-100 hover:bg-blue-700 focus-within:bg-blue-700">
						Submit
					</button>
				</form>
			</main>
		</>
	);
}
