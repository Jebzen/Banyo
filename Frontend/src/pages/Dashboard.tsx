import "../styles/dashboard.css";
import deleteIcon from "../assets/deleteIcon.svg";
import { useEffect, useState } from "react";

const dummyData = [
	{
		name: "Daniel Hansen",
		email: "danielhansen@mail.com",
		id: 1,
	},

	{
		name: "Pia Jensen",
		email: "piajensen@mail.com",
		id: 2,
	},
	{
		name: "George Johnson",
		email: "george@mail.com",
		id: 3,
	},
];

export default function Dashboard() {
	const [userList, setUserList] = useState<any>([]);

	useEffect(() => {
		setUserList(dummyData);
	}, [userList]);

	function DeleteProfile(id: number) {
		console.log(id);
	}

	return (
		<main className="flex justify-center min-h-screen">
			<section className="h-fit rounded-lg self-center dashboard ">
				<h1 className="font-bold text-2xl mb-10">Users</h1>

				<header className="grid gap-x-5 text-xs px-5 mb-3">
					<p>Name</p>
					<p>Email</p>
					<p>Delete</p>
				</header>

				<section className="user-list flex flex-col">
					{dummyData.map((data, index) => {
						return (
							<section
								key={index}
								className="p-5 bg-white grid gap-x-5 mb-1 rounded text-sm leading-6"
							>
								<span className="font-bold">{data.name}</span>
								<span>{data.email}</span>
								<span
									className="deleteIcon px-2 hover:text-red-600 cursor-pointer w-fit"
									onClick={() => {
										DeleteProfile(data.id);
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
