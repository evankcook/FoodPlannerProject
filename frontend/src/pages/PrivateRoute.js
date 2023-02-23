import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkLogin } from "../Utils";

function PrivateRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    checkLogin().then((result) => {
      setIsLoggedIn(result);
    });
  }, []);

  if (isLoggedIn === undefined) {
    return null;
  }

  return isLoggedIn ? children : <Navigate to="/signup" />;
}

export default PrivateRoute;
