import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import RouteTracker from "./routes/RouteTracker";

// import "./App.scss";

const App = () => {
  return (
    <BrowserRouter>
      <RouteTracker />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;