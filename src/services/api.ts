import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
console.log('cookies', cookies);
export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies["next-typescript-login-nextauth.token"]}`

  }
})