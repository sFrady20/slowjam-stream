import { HashRouter } from "react-router";
import { AppProvider } from "./context";
import { Pages } from "./pages";

export default function () {
  return (
    <HashRouter>
      <AppProvider>
        <Pages />
      </AppProvider>
    </HashRouter>
  );
}
