import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SurveyResult } from "@/presentation/pages";
import { ApiContext } from "@/presentation/contexts";
import {
  LoadSurveyResultSpy,
  SaveSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel,
} from "@/domain/test";
import { AccessDeniedError, UnexpectedError } from "@/domain/erros";
import { AccountModel } from "@/domain/models";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy;
  saveSurveyResultSpy?: SaveSurveyResultSpy;
};

const makeSut = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy(),
}: SutParams = {}): SutTypes => {
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <SurveyResult
        loadSurveyResult={loadSurveyResultSpy}
        saveSurveyResult={saveSurveyResultSpy}
      />
    </ApiContext.Provider>
  );
  return {
    loadSurveyResultSpy,
    saveSurveyResultSpy,
    setCurrentAccountMock,
  };
};
describe("SurveyResult Component", () => {
  // beforeEach(() => {
  //   jest.spyOn(console, "error").mockImplementation(() => {});
  // });

  test("Should present correct inital state", async () => {
    makeSut();
    const surveyResult = screen.getByTestId("survey-result");
    expect(surveyResult.childElementCount).toBe(0);
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
  test("Should call LoadSurveyResult", async () => {
    const { loadSurveyResultSpy } = makeSut();
    await waitFor(() => {
      screen.getByTestId("survey-result");
      expect(loadSurveyResultSpy.callsCount).toBe(1);
    });
  });
  test("Should present SurveyResult data on success ", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date("2022-01-10T00:00:00"),
    });
    loadSurveyResultSpy.surveyResult = surveyResult;
    makeSut({ loadSurveyResultSpy });
    await waitFor(() => {
      screen.getByTestId("survey-result");
      expect(screen.getByTestId("day")).toHaveTextContent("10");
      expect(screen.getByTestId("month")).toHaveTextContent("jan");
      expect(screen.getByTestId("year")).toHaveTextContent("2022");
      expect(screen.getByTestId("question")).toHaveTextContent(
        surveyResult.question
      );
      expect(screen.getByTestId("answers").childElementCount).toBe(
        surveyResult.answers.length
      );

      const answerWrap = screen.queryAllByTestId("answer-wrap");
      expect(answerWrap[0]).toHaveClass("active");
      expect(answerWrap[1]).not.toHaveClass("active");

      const images = screen.queryAllByTestId("image");
      expect(images[0]).toHaveAttribute("src", surveyResult.answers[0].image);
      expect(images[0]).toHaveAttribute("alt", surveyResult.answers[0].answer);
      expect(images[1]).toBeFalsy();
      const answers = screen.queryAllByTestId("answer");
      expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer);
      expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer);
      const percents = screen.queryAllByTestId("percent");
      expect(percents[0]).toHaveTextContent(
        `${surveyResult.answers[0].percent}%`
      );
      expect(percents[1]).toHaveTextContent(
        `${surveyResult.answers[1].percent}%`
      );
    });
  });

  test("Should render error on UnexpectedError", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyResultSpy, "load").mockRejectedValueOnce(error);
    makeSut({ loadSurveyResultSpy });
    await waitFor(() => {
      expect(screen.queryByTestId("question")).not.toBeInTheDocument();
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("error")).toHaveTextContent(error.message);
    });
  });

  test("Should logout on AccessDeniedError", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    jest
      .spyOn(loadSurveyResultSpy, "load")
      .mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock } = makeSut({ loadSurveyResultSpy });
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(mockUseNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  test("Should call load SurveyResult on reload", async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    jest
      .spyOn(loadSurveyResultSpy, "load")
      .mockRejectedValueOnce(new UnexpectedError());
    makeSut({ loadSurveyResultSpy });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("reload"));
      expect(loadSurveyResultSpy.callsCount).toBe(1);
    });
  });

  test("Should goto SurveyList on back button click", async () => {
    makeSut();
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("back-button"));
      expect(mockUseNavigate).toHaveBeenCalledWith(-1);
    });
  });

  test("Should not present Loading on active answer click", async () => {
    makeSut();
    await waitFor(() => {
      const answerWrap = screen.queryAllByTestId("answer-wrap");
      fireEvent.click(answerWrap[0]);
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });
  });

  test("Should call SaveSurveyResult on non active answer click", async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut();
    await waitFor(() => {
      const answerWrap = screen.queryAllByTestId("answer-wrap");
      fireEvent.click(answerWrap[1]);
      expect(screen.queryByTestId("loading")).toBeInTheDocument();
      expect(saveSurveyResultSpy.params).toEqual({
        answer: loadSurveyResultSpy.surveyResult.answers[1].answer,
      });
    });
  });

  test("Should render error on UnexpectedError", async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy();
    const error = new UnexpectedError();

    makeSut({ saveSurveyResultSpy });
    jest.spyOn(saveSurveyResultSpy, "save").mockRejectedValueOnce(error);

    await waitFor(() => {
      screen.getByTestId("survey-result");
      const answerWrap = screen.queryAllByTestId("answer-wrap");
      fireEvent.click(answerWrap[1]);
    });
    await waitFor(() => {
      expect(screen.queryByTestId("question")).not.toBeInTheDocument();
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("error")).toHaveTextContent(error.message);
    });
  });

  test("Should logout on AccessDeniedError", async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy();
    jest
      .spyOn(saveSurveyResultSpy, "save")
      .mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock } = makeSut({ saveSurveyResultSpy });
    await waitFor(() => {
      const answerWrap = screen.queryAllByTestId("answer-wrap");
      fireEvent.click(answerWrap[1]);
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(mockUseNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  test("Should present SurveyResult data on SaveSurveyResult success ", async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy();
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date("2022-01-10T00:00:00"),
    });
    saveSurveyResultSpy.surveyResult = surveyResult;
    makeSut({ saveSurveyResultSpy });
    await waitFor(() => {
      screen.getByTestId("survey-result");
      expect(screen.getByTestId("day")).toHaveTextContent("10");
      expect(screen.getByTestId("month")).toHaveTextContent("jan");
      expect(screen.getByTestId("year")).toHaveTextContent("2022");
      expect(screen.getByTestId("question")).toHaveTextContent(
        surveyResult.question
      );
      expect(screen.getByTestId("answers").childElementCount).toBe(
        surveyResult.answers.length
      );

      const answerWrap = screen.queryAllByTestId("answer-wrap");
      expect(answerWrap[0]).toHaveClass("active");
      expect(answerWrap[1]).not.toHaveClass("active");

      const images = screen.queryAllByTestId("image");
      expect(images[0]).toHaveAttribute("src", surveyResult.answers[0].image);
      expect(images[0]).toHaveAttribute("alt", surveyResult.answers[0].answer);
      expect(images[1]).toBeFalsy();
      const answers = screen.queryAllByTestId("answer");
      expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer);
      expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer);
      const percents = screen.queryAllByTestId("percent");
      expect(percents[0]).toHaveTextContent(
        `${surveyResult.answers[0].percent}%`
      );
      expect(percents[1]).toHaveTextContent(
        `${surveyResult.answers[1].percent}%`
      );
    });
  });
});
