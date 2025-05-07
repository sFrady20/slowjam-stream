import { HashRouter } from "react-router";
import { Pages } from "./pages";
import { AppProvider } from "./context";
import PlinkoGame from "./components/PlinkoGame";

export default function () {
  return (
    <HashRouter>
      <AppProvider>
        {/* <Pages /> */}
        <PlinkoGame />
      </AppProvider>
    </HashRouter>
  );
}
