import cypress from "cypress";
import { faker } from "@faker-js/faker";
import "cypress-localstorage-commands";
import "../support/commands";

const user = {
	username: faker.internet.userName(),
	email: faker.internet.email(),
	password: "S0meThing!",
};

describe("Profile", () => {
	it("Create profile + fail", () => {
		cy.visit("http://127.0.0.1:5173/");

		//Bad Sumbit
		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 3);

		//Real username for less errors
		cy.get("input[id=username]").type(user.username);

		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 2);

		//Bad email
		cy.get("input[id=email]").type(user.username);

		cy.get("button").click();

		cy.url().should("include", "/create");

		cy.get("input[id=email]").clear().type(user.email);

		//Bad Password
		cy.get("input[id=password]").type("small");

		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 2);

		//Same bad password
		cy.get("input[id=repeatPassword]").type("small", { force: true });

		cy.get("button").click();

		cy.get("p.text-red-500").should("have.length", 1);

		//Real password to real submit
		cy.get("input[id=password]").clear().type(user.password, { force: true });
		cy.get("input[id=repeatPassword]")
			.clear()
			.type(user.password, { force: true });

		//If click it creates user but cannot use Localstorage which the app uses so it goes back to /login

		cy.intercept(
			{
				method: "GET",
				hostname: "localhost",
				url: "/Banyo/Backend/user",
			},
			{ log: true }
		).as("apiCheck");

		cy.get("button").click();

		//cy.wait("@apiCheck").its("response.body").should("include", "error");

		cy.getLocalStorage("jwsToken").then((localStorageValue) => {
			expect(localStorageValue).to.not.be.null;
		});

		cy.url().should("include", "/login");
	});
});
