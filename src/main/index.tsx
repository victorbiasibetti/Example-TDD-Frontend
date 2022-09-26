import React from "react";

import ReactDOM from "react-dom";

import "@/presentation/styles/global.scss";
import { makeLogin } from "./factories/pages/login/login-factory";
import { Router } from "@/presentation/components";

ReactDOM.render(
  <Router MakeLogin={makeLogin} />,
  document.getElementById("main")
);
