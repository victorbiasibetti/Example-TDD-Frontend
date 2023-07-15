import { Method } from "cypress/types/net-stubbing";
import faker from "faker";

export const mockUnathorizedError = (url: RegExp): void => {
  cy.intercept("POST", url, {
    statusCode: 401,
    body: {
      error: faker.random.words(),
    },
  }).as("request");
};

export const mockForbiddenError = (url: RegExp, method: Method): void => {
  cy.intercept(method, url, {
    statusCode: 403,
    body: {
      error: faker.random.words(),
    },
  }).as("request");
};

export const mockServerError = (url: RegExp, method: Method): void => {
  cy.intercept(method, url, {
    statusCode: faker.helpers.randomize([400, 404, 500]),
    body: {
      error: faker.random.words(),
    },
  }).as("request");
};

export const mockOk = (url: RegExp, method: Method, response: any): void => {
  cy.intercept(method, url, {
    statusCode: 200,
    body: response,
  }).as("request");
};
