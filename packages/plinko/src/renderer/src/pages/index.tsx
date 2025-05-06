import { Route, Routes } from "react-router";
import { HomePage } from "./home";

export function Pages() {
  return (
    <Routes>
      <Route path="*" Component={HomePage} />
    </Routes>
  );
}
