import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./lib/auth";
import { ThemeProvider } from "./components/theme-provider";
import ErrorBoundary from "./components/error-boundary";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <ErrorBoundary>
          <BrowserRouter basename={basename}>
            <App />
            <SpeedInsights />
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
