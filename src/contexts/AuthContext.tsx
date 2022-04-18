import { createContext, ReactNode, useState } from "react";
import Router from "next/router";
import { setCookie } from "nookies";
import { api } from "../services/api";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credential: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });
      const { token, refreshToken, permissions, roles } = response.data;
      setUser({ email, permissions, roles });
      setCookie(undefined, "next-typescript-login-nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setCookie(
        undefined,
        "next-typescript-login-nextauth.refreshToken",
        refreshToken,
        { maxAge: 60 * 60 * 24 * 30, path: "/" }
      );
      Router.push("/dashboard");
    } catch (error) {
      console.log("Erro ao fazer login", error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
