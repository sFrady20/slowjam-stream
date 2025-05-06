import { HashRouter } from "react-router";
import { Pages } from "./pages";
import { AppProvider } from "./context";

export default function () {
  return (
    <HashRouter>
      <AppProvider>
        <Pages />
      </AppProvider>
    </HashRouter>
  );
}
