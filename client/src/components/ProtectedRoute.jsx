import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("token");

  // Agar login nahi hai
  if (!token) {

    return <Navigate to="/" />;

  }

  // Agar login hai
  return children;

}

export default ProtectedRoute;