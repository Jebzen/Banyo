import { useEffect, useState } from "react";
import checkToken from "../utils/CheckToken";
import "../styles/form.css";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
	const apiUrl = import.meta.env.VITE_BACKEND_PATH;
	const token = localStorage.getItem("jwsToken");

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		oldpassword: "",
		newpassword: "",
		repeatPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const [formError, setFormError] = useState<any>({});

	const { username, email, oldpassword, newpassword, repeatPassword } =
		formData;

	useEffect(() => {
		checkToken().then((isAuthenticated: any) => {
			if (isAuthenticated && isAuthenticated.user) {
				setFormData({
					...formData,
					username: isAuthenticated.user.username,
					email: isAuthenticated.user.email,
				});
			}
		});
	}, []);

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
		setFormError({});
		setIsLoading(true);
		let errors = {};

		/* Client Validation Start */

		//Username invalid
		if (username.toLowerCase() === "admin" || username.length < 1) {
			errors = { ...errors, username: "Username invalid" };
		}

		//Email invalid
		//Regex with help from https://regex101.com/
		const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-Z]{2,}$/i;
		if (!email.match(emailPattern)) {
			errors = { ...errors, email: "Email not valid" };
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

		if (Object.keys(errors).length != 0) {
			setFormError({
				...errors,
			});
			return;
		}
		/*Client Validation End */

		/*Server Validation Start */

		try {
			const response = await fetch(apiUrl + "/users", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.error) {
					setFormError({ serverError: data.error });
				} else {
					navigate("/user");
				}
			}
		} catch (error) {
			console.error("Error during login:", error);
		} finally {
			setIsLoading(false);
		}

		/*Server Validation End */
	};

	return (
		<>
			<main className="flex justify-center min-h-screen bg-light-grey">
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

						{/* EMAIL */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="email"
									placeholder="Email"
									id="email"
									name="email"
									value={email}
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
								<p className="text-red-500 text-sm">{formError.email}</p>
							)}
						</section>

						{/* OLD PASSWORD */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="text"
									placeholder="Old Password"
									id="oldpassword"
									name="oldpassword"
									value={oldpassword}
									onChange={handleChange}
									className="p-5 border-2 rounded-md border-solid flex w-full"
								/>
								<label
									htmlFor="oldpassword"
									className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
								>
									Old Password
								</label>
							</section>
							{formError?.oldpassword && (
								<p className="text-red-500 text-sm">{formError.oldpassword}</p>
							)}
						</section>

						{/* OLD PASSWORD */}
						<section className="mb-4">
							<section className="relative input-section">
								<input
									type="text"
									placeholder="New Password"
									id="newpassword"
									name="newpassword"
									value={newpassword}
									onChange={handleChange}
									className="p-5 border-2 rounded-md border-solid flex w-full"
								/>
								<label
									htmlFor="newpassword"
									className="absolute left-0 items-center flex cursor-text ms-5 p-px ease-out duration-75 top-2/4"
								>
									New Password
								</label>
							</section>
							{formError?.newpassword && (
								<p className="text-red-500 text-sm">{formError.newpassword}</p>
							)}
						</section>

						{/* REPEAT PASSWORD */}
						<section className="mb-10">
							<section className="relative input-section">
								<input
									type="text"
									placeholder="Repeat New Password"
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
									Repeat New Password
								</label>
							</section>
							{formError?.repeatPassword && (
								<p className="text-red-500 text-sm">
									{formError.repeatPassword}
								</p>
							)}
						</section>

						<button
							disabled={isLoading}
							className="text-white font-bold rounded-full justify-center py-5 w-100 bg-blue-prime btn hover:bg-blue-600 focus-within:bg-blue-600"
						>
							{isLoading ? "Loading..." : "Submit"}
						</button>
						{formError?.serverError && (
							<p className="text-red-500 text-center text-sm">
								{formError.serverError}
							</p>
						)}
					</section>

					<section className="text-center mt-5 text-xs text-gray-500">
						<a href={"/user/" + username} className="underline">
							Go back
						</a>
					</section>
				</form>
			</main>
		</>
	);
}
