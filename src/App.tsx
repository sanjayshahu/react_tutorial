import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import RouteTracker from "./routes/RouteTracker";
import { NPro } from "./context/NotificationContext";

// import "./App.scss";

const App = () => {
  return (
    <NPro>
    <BrowserRouter>
      <RouteTracker />
      <AppRoutes />
    </BrowserRouter>
    </NPro>
  );
};

export default App;