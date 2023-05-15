import { useParams } from "react-router-dom";

export default function UserProfile() {
	//const token = localStorage.getItem("jwsToken");
	const { username } = useParams();

	return (
		<main className="flex justify-center min-h-screen">
			<section className="h-fit rounded-lg self-center flex flex-col w-96 bg-white p-5">
				<a href="#" className="hover:text-blue-900 mb-14">
					<h1 className="text-end">
						<i className="bi bi-pencil-fill text-xl"></i>
					</h1>
				</a>

				<section className="flex flex-col justify-center px-10 pb-20">
					<h1 className="font-bold text-2xl mb-5 text-center">{username}</h1>
					<section className="grid grid-profile gap-y-6">
						<span className="font-bold text-sm">Email</span>
						<span className="text-sm">jeb.bentzen@gmail.com</span>
						<span className="font-bold text-sm">Password</span>
						<span className="text-sm">*************</span>
					</section>
				</section>
			</section>
		</main>
	);
}
