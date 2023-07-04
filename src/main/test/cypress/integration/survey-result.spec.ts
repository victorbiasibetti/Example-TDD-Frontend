import React from "react";

import {
  getLocalStorageItem,
  setLocalStorageItem,
  testUrl,
} from "../utils/helpers";
import * as Http from "../utils/http-mocks";

const path = /surveys/;
const mockUnexpectedError = (): void => Http.mockServerError(path, "GET");

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
});
