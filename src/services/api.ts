import axios, { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

console.log('cookies', cookies);
export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies["next-typescript-login-nextauth.token"]}`

  }
});

api.interceptors.response.use(response => response, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === 'token.expired') {
      cookies = parseCookies();
      const { 'next-typescript-login-nextauth.refreshToken': refreshToken } = cookies;
      const originalCofig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        api.post('/refresh', { refreshToken }).then(response => {
          console.log('response', response);
          const { token } = response.data;

          setCookie(undefined, "next-typescript-login-nextauth.token", token, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });

          setCookie(
            undefined,
            "next-typescript-login-nextauth.refreshToken",
            response.data.refreshToken,
            { maxAge: 60 * 60 * 24 * 30, path: "/" }
          );

          api.defaults.headers["Authorization"] = `Bearer ${token}`;

          failedRequestsQueue.forEach(request => request.onSuccess(token))
          failedRequestsQueue = [];
        }).catch((error) => {
          failedRequestsQueue.forEach(request => request.onFailure(error))
          failedRequestsQueue = [];
        }).finally(() => {
          isRefreshing = false;
        })
      }
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalCofig.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalCofig));
          },
          onFailure: (error: AxiosError) => {
            reject(error);
          },

        });
      })

    } else {
      signOut();
    }
  }

  /*
   * Deixa o fluxo de erro seguir em frente para continuar sendo tratado pelo
   * axios depois da interceptação de cada requisição.
  */
  return Promise.reject(error);

});