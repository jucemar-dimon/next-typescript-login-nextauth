import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log("Dashboard-use-effect", response))
      .catch((error) => console.log("Dashboard-use-effect", error));
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Usuaário conectador: {user?.email}</p>
    </div>
  );
}
