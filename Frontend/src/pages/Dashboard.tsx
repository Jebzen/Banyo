import "../styles/dashboard.css";
import deleteIcon from "../assets/deleteIcon.svg";
import { useEffect, useState } from "react";
import AdminRoute from "../utils/AdminRoute";

function Dashboard() {
	const [userList, setUserList] = useState<any>([]);

	useEffect(() => {
		fetch("http://localhost/Banyo/Backend/users")
			.then((response) => {
				if (response.ok) return response.json();
				return null;
			})
			.then((data) => {
				// Process the received JSON data
				setUserList(data);
			})
			.catch((error) => {
				// Handle any errors that occur during the fetch request
				console.error("Error:", error);
			});
	}, []);

	function DeleteProfile(id: number) {
		console.log(id);
	}

	return (
		<main className="flex justify-center min-h-screen bg-light-grey">
			<section className="h-fit rounded-lg self-center dashboard ">
				<h1 className="font-bold text-2xl mb-10">Users</h1>

				<header className="grid gap-x-5 text-xs px-5 mb-3">
					<p>Name</p>
					<p>Email</p>
					<p>Delete</p>
				</header>

				<section className="user-list flex flex-col">
					{userList.map((data: any, index: any) => {
						return (
							<section
								key={index}
								className="p-5 bg-white grid gap-x-5 mb-1 rounded text-sm leading-6"
							>
								<span className="font-bold">{data.username}</span>
								<span>{data.email}</span>
								<span
									className="deleteIcon px-2 hover:text-red-600 cursor-pointer w-fit"
									onClick={() => {
										DeleteProfile(data.user_id);
									}}
								>
									<img src={deleteIcon} alt="Delete Icon" />
								</span>
							</section>
						);
					})}
				</section>
			</section>
		</main>
	);
}

export default AdminRoute(Dashboard);
