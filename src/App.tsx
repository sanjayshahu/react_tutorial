import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import RouteTracker from "./routes/RouteTracker.tsx";

import "./App.scss";

const App = () => {
  return (
    <BrowserRouter>
      <RouteTracker />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;