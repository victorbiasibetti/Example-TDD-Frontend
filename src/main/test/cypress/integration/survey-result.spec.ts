import React from "react";

import mockSurveyResult from "../fixtures/survey-result.json";
import { setLocalStorageItem, testUrl } from "../utils/helpers";
import * as Http from "../utils/http-mocks";

const path = /surveys/;
const mockSuccess = (): void => Http.mockOk(path, "GET", mockSurveyResult);
const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, "GET");

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

  it("Should logout on AccessDeniedError", () => {
    cy.visit("/surveys/any_id");
    mockAccessDeniedError();
    testUrl("/login");
  });

  it("Should present survey result", () => {
    cy.visit("/surveys/any_id");
    mockSuccess();
    cy.get('[data-testid="question"]').should("have.text", "Question");
    cy.get('[data-testid="day"]').should("have.text", "21");
    cy.get('[data-testid="month"]').should("have.text", "dez");
    cy.get('[data-testid="year"]').should("have.text", "2022");
    cy.get("li:nth-child(1)").then((li) => {
      assert.equal(li.find('[data-testid="answer"]').text(), "any_answer");
      assert.equal(li.find('[data-testid="percent"]').text(), "80%");
      assert.equal(li.find('[data-testid="image"]').attr("src"), "any_image");
    });
    cy.get("li:nth-child(2)").then((li) => {
      assert.equal(li.find('[data-testid="answer"]').text(), "any_answer2");
      assert.equal(li.find('[data-testid="percent"]').text(), "20%");
      assert.notExists(li.find('[data-testid="image"]'));
    });
  });

  it("Should go to SurveyList on back button click", () => {
    cy.visit("/surveys");
    cy.visit("/surveys/any_id");
    mockSuccess();
    cy.get('[data-testid="back-button"]').click();
    testUrl("/surveys");
  });
});
