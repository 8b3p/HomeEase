import { observer } from "mobx-react-lite";
import React from "react";
import { useAuthVM } from "context/Contexts";
import styles from "./form.module.css";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [loading, setLoading] = React.useState(false);
  const authCtx = useAuthVM();

  const registerHandler = async (e: React.FormEvent) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    try {
      const data = {
        user: { name, email, password },
        email,
        password,
      };
      const { error, ok } = await authCtx.onRegister(data);
      if (!ok) {
        setError(error);
        setLoading(false);
        return;
      }
      setSuccess("Registration successful");
      setError("");
    } catch (error) {
      console.trace(error);
      setLoading(false);
      setError("Failed to register");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles["error"]}>
          {error}
          <button
            onClick={() => {
              setError("");
            }}
            className={styles["error-button"]}
          >
            X
          </button>
        </div>
      )}
      {loading && <span>loading</span>}
      {success && <span className='success-message'>{success}</span>}
      <form method='post' className={styles["login-form"]}>
        <h1>Register</h1>
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type='submit'
          className={loading ? styles.loading : ""}
          disabled={loading}
          onClick={registerHandler}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default observer(Register);
