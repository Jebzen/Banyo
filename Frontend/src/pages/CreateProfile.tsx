import { FormEventHandler, useState, useReducer } from "react";
import InputField from "../components/InputField";

export default function CreateProfile() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		repeatPassword: "",
	});

	const { username, email, password, repeatPassword } = formData;

	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();

		setFormData({
			username: "",
			email: "",
			password: "",
			repeatPassword: "",
		});
	};

	return (
		<>
			<main className="flex justify-center">
				<form onSubmit={handleSubmit}>
					<h1 className="font-bold text-xl mb-3 text-center">Create Profile</h1>

					<InputField
						label="Username"
						id="username"
						value={username}
						handleChange={handleChange}
					/>

					<InputField
						label="Email"
						id="email"
						value={email}
						handleChange={handleChange}
					/>

					<InputField
						label="Password"
						id="password"
						value={password}
						handleChange={handleChange}
					/>

					<InputField
						label="Repeat Password"
						id="repeatPassword"
						value={repeatPassword}
						handleChange={handleChange}
					/>

					<button className="text-white font-bold rounded-full justify-center">
						Submit
					</button>
				</form>
			</main>
		</>
	);
}
