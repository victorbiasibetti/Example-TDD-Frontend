import React from "react";

import mockSurveyResult from "../fixtures/survey-result.json";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  testUrl,
} from "../utils/helpers";
import * as Http from "../utils/http-mocks";

const path = /surveys/;
const mockUnexpectedError = (): void => Http.mockServerError(path, "GET");
const mockSuccess = (): void => Http.mockOk(path, "GET", mockSurveyResult);

describe("SurveyResult", () => {
  beforeEach(() => {
    cy.fixture("account").then((account) =>
      setLocalStorageItem("account", account)
    );
  });

  it("Should present error on UnexpectedError", () => {
    cy.visit("/surveys/any-id");
    cy.get('[data-testid="error"]').should(
      "contain.text",
      "Algo de errado aconteceu. Tente novamente mais tarde."
    );
  });

  it("Should reload on button click", () => {
    cy.visit("/surveys/any_id");
    cy.get('[data-testid="error"]').should(
      "contain.text",
      "Algo de errado aconteceu. Tente novamente mais tarde."
    );
    mockSuccess();
    cy.get('[data-testid="reload"]').click();
    cy.get('[data-testid="question"]').should("exist");
  });
});
