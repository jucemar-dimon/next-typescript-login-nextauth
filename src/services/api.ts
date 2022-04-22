import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
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
      const { 'next-typescript-login-nextauth.token': refreshToken } = cookies;

      api.post('/refresh', { refreshToken }).then(response => {
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
      })

    } else {

    }
  }

});