import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/form.css";
import PrivateRoute from "../utils/PrivateRoute";
import { useEffect, useState } from "react";
import checkToken from "../utils/CheckToken";
import { Iuser } from "../utils/Iuser";

function UserProfile() {
	let navigate = useNavigate();

	const [userData, setUserData] = useState<Iuser>({
		username: "",
		email: "",
		user_id: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	function logOut() {
		localStorage.removeItem("jwsToken");
		navigate("/login");
	}

	useEffect(() => {
		checkToken().then((isAuthenticated) => {
			if (isAuthenticated && isAuthenticated.user) {
				setUserData(isAuthenticated.user);
				setIsLoading(false);
			}
		});
	}, []);

	return (
		<main className="flex justify-center min-h-screen bg-light-grey flex-col">
			<section className="h-fit rounded-lg self-center flex flex-col w-96 bg-white p-5">
				<Link to={"/edit/"} className="hover:text-blue-900 mb-14">
					<h1 className="text-end">
						<i className="bi bi-pencil-fill text-xl"></i>
					</h1>
				</Link>

				<section className="flex flex-col justify-center px-10 pb-20">
					<h1 className="font-bold text-2xl mb-5">
						{isLoading ? "Loading..." : userData.username}
					</h1>
					<section className="grid grid-profile gap-y-6">
						<span className="font-bold text-sm">Email</span>
						<span className="text-sm">
							{isLoading ? "Loading..." : userData.email}
						</span>
						<span className="font-bold text-sm">Password</span>
						<span className="text-sm">*************</span>
					</section>
				</section>
			</section>

			<section className="flex justify-center mt-14">
				<button
					onClick={logOut}
					className="rounded-full justify-center py-5 w-72 text-gray-400 border-2 border-solid border-gray-400 font-bold hover:bg-gray-400 hover:text-white focus-within:bg-gray-400 focus-within:text-white"
				>
					Log Out
				</button>
			</section>
		</main>
	);
}

export default PrivateRoute(UserProfile);
