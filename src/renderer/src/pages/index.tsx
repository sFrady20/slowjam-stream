import { Route, Routes } from "react-router";
import { HomePage } from "./home";
import ControllerPage from "./controller";

export function Pages() {
  return (
    <Routes>
      <Route path="/main" Component={HomePage} />
      <Route path="*" Component={ControllerPage} />
    </Routes>
  );
}
