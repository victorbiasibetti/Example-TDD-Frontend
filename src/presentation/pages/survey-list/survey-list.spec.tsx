import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SurveyList } from "@/presentation/pages";
import { LoadSurveyList } from "@/domain/usecases";
import { mockAccountModel, mockSurveyListModel } from "@/domain/test";
import { AccessDeniedError, UnexpectedError } from "@/domain/erros";
import { ApiContext } from "@/presentation/contexts";
import { AccountModel } from "@/domain/models";

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurveyListModel();
  async loadAll(): Promise<LoadSurveyList.Model[]> {
    this.callsCount++;
    return this.surveys;
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <SurveyList loadSurveyList={loadSurveyListSpy} />
    </ApiContext.Provider>
  );
  return { loadSurveyListSpy, setCurrentAccountMock };
};

describe("SurveyList Component", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("Should present 4 empty items on start", () => {
    makeSut();
    const surveyList = screen.getByTestId("survey-list");
    expect(surveyList.querySelectorAll("li:empty")).toHaveLength(4);
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  test("Should call LoadSurveyList", () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
  });

  test("Should render SurveyItems on success", async () => {
    makeSut();
    await waitFor(() => {
      const surveyList = screen.getByTestId("survey-list");
      expect(surveyList.querySelectorAll("li.surveyItemWrap")).toHaveLength(3);
    });
  });

  test("Should render error on UnexpectedError", async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyListSpy, "loadAll").mockRejectedValueOnce(error);
    makeSut(loadSurveyListSpy);
    await waitFor(() => {
      expect(screen.queryByTestId("survey-list")).not.toBeInTheDocument();
      expect(screen.getByTestId("error")).toHaveTextContent(error.message);
    });
  });

  test("Should logout on AccessDeniedError", async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest
      .spyOn(loadSurveyListSpy, "loadAll")
      .mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock } = makeSut(loadSurveyListSpy);
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(mockUseNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  test("Should call load SurveyList on reload", async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest
      .spyOn(loadSurveyListSpy, "loadAll")
      .mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadSurveyListSpy);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("reload"));
      expect(loadSurveyListSpy.callsCount).toBe(1);
    });
  });
});
