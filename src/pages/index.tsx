import { GetServerSideProps } from "next";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/home.module.scss";
import { parseCookies } from "nookies";
import { withSSRGuest } from "../utils/WithSSRGuest";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        autoComplete="false"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        autoComplete="false"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
