import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import FromShortLink from "./components/FormShortLink";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login.page";
import Home from "./pages/Home.page";
import PrivateRoute from "./auth/privateRoute";
import PublicRoute from "./auth/publicRoute";
import Shortener from "./pages/Shortener.page";
import Profile from "./pages/UserLinks.page";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/create-link"
            element={
              <PrivateRoute>
                <FromShortLink />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-link"
            element={
              <PrivateRoute>
                <Shortener />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
