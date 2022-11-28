import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import { useAuthVM } from "context/Contexts";
import styles from "./form.module.css";
import { Cross } from "react-swm-icon-pack";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const authCtx = useAuthVM();

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error, ok } = await authCtx.onLogin(email, password);
 );
        setLoading(false);
        return;
      }
      setSuccess("Login successful");
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to log in");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles["alert"] + " " + styles["error"]}>
          {error}
          <button
            onClick={() => {
              setError("");
            }}
            className={styles["alert-button"]}
          >
            <Cross color='red' />
          </button>
        </div>
      )}
      {success && (
        <div className={styles["alert"] + " " + styles["success"]}>
          {success}
          <button
            onClick={() => {
              setSuccess("");
            }}
            className={styles["alert-button"]}
          >
            <Cross color='green' />
          </button>
        </div>
      )}
      {loading && (
        <div className={styles["alert"] + " " + styles["info"]}>
          Loading...
          <button
            onClick={() => {
              setLoading(false);
            }}
            className={styles["alert-button"]}
          >
            <Cross color='blue' />
          </button>
        </div>
      )}
      <form method='post' className={styles["login-form"]}>
        <h1>Login</h1>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type='submit' onClick={loginHandler}>
          Login
        </button>
      </form>
    </div>
  );
};

export default observer(Login);
