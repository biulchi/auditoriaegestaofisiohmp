import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRoutes, Routes, Route, useParams } from "react-router-dom";
import { useAuth } from "./lib/auth";
import { Login } from "./components/login";
import { ChangePassword } from "./components/change-password";
import { AuditSystem } from "./components/audit";
import { PhysioSystem } from "./components/physio";
import { TimesheetSystem } from "./components/timesheet";
import { PrintableTimesheet } from "./components/timesheet/timesheet-print";
import { ProtectedRoute } from "./components/protected-route";
import routes from "tempo-routes";

function PrintRoute() {
  const { year, month } = useParams();
  const { userId } = useAuth();

  if (!userId) return null;

  return (
    <PrintableTimesheet
      employeeId={userId}
      year={parseInt(year || "0")}
      month={parseInt(month || "0")}
    />
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <AuditSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/physio"
            element={
              <ProtectedRoute>
                <PhysioSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timesheet"
            element={
              <ProtectedRoute>
                <TimesheetSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/print/:year/:month"
            element={
              <ProtectedRoute>
                <PrintRoute />
              </ProtectedRoute>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
