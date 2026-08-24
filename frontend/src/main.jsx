import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { initGA } from "./analytics.js";
import { AnalyticsTracker } from "./utils/AnalyticsTracker.jsx";
initGA();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AnalyticsTracker />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
