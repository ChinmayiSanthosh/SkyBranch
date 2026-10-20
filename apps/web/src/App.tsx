import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}/>
      <Route 
        path="/"
        element= {
          <ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );

}