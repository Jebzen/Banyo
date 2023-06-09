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
	it("Login with profile + fail", () => {
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
		cy.get("button").click();

		/* Create profile start end*/

		//On login page
		cy.visit("http://127.0.0.1:5173/login");

		//Bad Sumbit
		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 2);

		//Real username for less errors
		cy.get("input[id=username]").type(user.username);

		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 1);

		//Bad Password
		cy.get("input[id=password]").type("mi!");

		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 1);

		//Better password, wrong login
		cy.get("input[id=password]").clear().type("S0meTING!Better");

		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 1);

		//Real login
		cy.get("input[id=password]").clear().type(user.password);

		cy.intercept(
			{
				method: "Post",
				hostname: "localhost",
				url: "/Banyo/Backend/user/login",
			},
			{ log: true }
		).as("apiCheck");

		cy.get("button").click();

		cy.getLocalStorage("jwsToken").then((localStorageValue) => {
			expect(localStorageValue).to.not.be.null;
		});

		//On user page
		cy.url().should("include", "/user");

		cy.get("h1.font-bold").should("have.text", user.username);

		cy.get(".email-text").should("have.text", user.email);

		cy.get("button").click();

		cy.getLocalStorage("jwsToken").then((localStorageValue) => {
			expect(localStorageValue).to.be.null;
		});
	});
});
