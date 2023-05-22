import { faker } from "@faker-js/faker";
import cypress from "cypress";
import "cypress-localstorage-commands";

const user = {
	username: faker.internet.userName(),
	email: faker.internet.email(),
	password: "S0meThing!",
};
const newUser = {
	username: faker.internet.userName(),
	email: faker.internet.email(),
	password: "S0meThing!Better",
};

describe("template spec", () => {
	it("Edit user profile + fail", () => {
		/* Create profile start */
		cy.visit("http://127.0.0.1:5173/create");

		//On create page
		cy.get("input[id=username]").type(user.username);
		cy.get("input[id=email]").type(user.email);
		cy.get("input[id=password]").type(user.password);
		cy.get("input[id=repeatPassword]").type(user.password, { force: true });
		cy.get("button").click();

		//On user page
		cy.url().should("include", "/user");
		/* Create profile start end*/

		cy.get("[id=edit-link]").click();

		//On edit page
		cy.url().should("include", "/edit");

		cy.wait(500);

		//Check if data is already here
		cy.get("input[id=username]").should("have.value", user.username);
		cy.get("input[id=email]").should("have.value", user.email);

		//Bad submit
		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 1);

		//Wrong old password
		cy.get("input[id=oldpassword]").type(newUser.password);
		cy.get("input[id=newpassword]").type(newUser.password);
		cy.get("input[id=repeatPassword]").type(newUser.password, { force: true });
		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 1);

		//Change user info
		cy.get("input[id=username]").clear().type(newUser.username);
		cy.get("input[id=email]").clear().type(newUser.email);
		cy.get("input[id=oldpassword]").clear().type(user.password);
		cy.get("input[id=newpassword]").clear().type(newUser.password);
		cy.get("input[id=repeatPassword]")
			.clear()
			.type(newUser.password, { force: true });
		cy.get("button").click();

		cy.url().should("include", "/user");

		//New user page
		cy.get("h1.font-bold").should("have.text", newUser.username);
		cy.get(".email-text").should("have.text", newUser.email);
		cy.get("button").click();

		//login with new user data
		cy.url().should("include", "/login");

		cy.get("input[id=username]").type(newUser.username);
		cy.get("input[id=password]").type(newUser.password);
		cy.get("button").click();

		cy.url().should("include", "/user");
	});
});
