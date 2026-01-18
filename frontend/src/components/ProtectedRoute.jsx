import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  let auth = null;

  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      auth = JSON.parse(stored);
    }
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
 
  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
