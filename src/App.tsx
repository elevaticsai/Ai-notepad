import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainApp from "./MainApp";
import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { authService } from "./services";
import "./styles/theme.css";

function App() {

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return authService.isAuthenticated() ? (
      <>{children}</>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
