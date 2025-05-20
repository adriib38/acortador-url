import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import FromShortLink from './components/FormShortLink'; 
import { AuthProvider } from './auth/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './auth/privateRoute';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/create-link" element={
            <PrivateRoute>
              <FromShortLink />
            </PrivateRoute>
            } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

