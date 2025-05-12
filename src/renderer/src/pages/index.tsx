import { Route, Routes } from "react-router";
import { HomePage } from "./home";
import ControllerPage from "./controller";
import { HoldPage } from "./hold";
import { ChatPage } from "./chat";

export function Pages() {
  return (
    <Routes>
      <Route path="/main" Component={HomePage} />
      <Route path="/hold" Component={HoldPage} />
      <Route path="/chat" Component={ChatPage} />
      <Route path="*" Component={ControllerPage} />
    </Routes>
  );
}
