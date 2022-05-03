import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError.1";
import { withSSRAuth } from "../utils/WithSSRAuth";

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  try {
    const response = await apiClient.get("/me");
  } catch (err) {
    destroyCookie(ctx, "next-typescript-login-nextauth.token");
    destroyCookie(ctx, "next-typescript-login-nextauth.refresToken");
    console.log(
      "API ROTA /me na página dashboard",
      err instanceof AuthTokenError
    );
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // console.log(response.data);

  return {
    props: {},
  };
});
