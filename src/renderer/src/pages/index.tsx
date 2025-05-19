import { Route, Routes } from "react-router";
import { HomePage } from "./home";
import ControllerPage from "./controller";
import { HoldPage } from "./hold";
import { ChatPage } from "./chat";
import { TiktokPage } from "./tiktok";

export function Pages() {
  return (
    <Routes>
      <Route path="/main" Component={HomePage} />
      <Route path="/hold" Component={HoldPage} />
      <Route path="/chat" Component={ChatPage} />
      <Route path="/tiktok" Component={TiktokPage} />
      <Route path="*" Component={ControllerPage} />
    </Routes>
  );
}
