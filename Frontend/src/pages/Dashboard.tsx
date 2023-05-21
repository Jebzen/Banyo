import "../styles/dashboard.css";
import deleteIcon from "../assets/deleteIcon.svg";
import { useEffect, useState } from "react";
import AdminRoute from "../utils/AdminRoute";
import { Iuser } from "../utils/Iuser";

function Dashboard() {
	const token = localStorage.getItem("jwsToken");
	const [userList, setUserList] = useState<any>([]);

	useEffect(() => {
		fetch("http://localhost/Banyo/Backend/users")
			.then((response) => {
				if (response.ok) return response.json();
				throw new Error("Bad response");
			})
			.then((data) => {
				setUserList(data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, []);

	function DeleteProfile(id: number) {
		fetch("http://localhost/Banyo/Backend/users/" + id, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				if (response.ok) return response.json();
				throw new Error("Bad response");
			})
			.then((data) => {
				const newList = userList.filter((user: Iuser) => {
					return user.user_id != id;
				});
				if (data.message) {
					setUserList(newList);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	return (
		<main className="flex justify-center min-h-screen bg-light-grey">
			<section className="h-fit rounded-lg self-center dashboard flex flex-col">
				<h1 className="font-bold text-2xl mb-10">Users</h1>

				<header className="gap-x-5 text-xs px-5 mb-3 hidden md:grid">
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
								<span className="username-text font-bold">{data.username}</span>
								<span className="email-text">{data.email}</span>
								{data.user_id == "1" ||
								data.username.toLowerCase() == "admin" ? (
									<span className="deleteIcon px-2 hover:text-red-600 w-fit cursor-not-allowed">
										<img src={deleteIcon} alt="Delete Icon" />
									</span>
								) : (
									<span
										className="deleteIcon px-2 hover:text-red-600 cursor-pointer w-fit"
										onClick={() => {
											DeleteProfile(data.user_id);
										}}
									>
										<img src={deleteIcon} alt="Delete Icon" />
									</span>
								)}
							</section>
						);
					})}
				</section>
			</section>
		</main>
	);
}

export default AdminRoute(Dashboard);
