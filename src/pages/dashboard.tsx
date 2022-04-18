import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Usuaário conectador: {user?.email}</p>
    </div>
  );
}
