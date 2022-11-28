import { observer } from "mobx-react-lite";
import { useAuthVM } from "../../context/Contexts";
import styles from "./Navbar.module.css";
import ThemeToggler from "./themeToggler";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar = () => {
  const authCtx = useAuthVM();
  const router = useRouter();

  const NotLoggedIn = (
    <>
      <Link
        href='/login'
        className={
          router.pathname === "/login"
            ? styles["nav-link"] + " " + styles["active"]
            : styles["nav-link"]
        }
      >
        Login
      </Link>
      <Link
        href='/register'
        className={
          router.pathname === "/register"
            ? styles["nav-link"] + " " + styles["active"]
            : styles["nav-link"]
        }
      >
        Register
      </Link>{" "}
    </>
  );

  const LoggedIn = (
    <>
      <span onClick={authCtx.onLogout} className={styles["nav-link"]}>
        Logout
      </span>
      <span>{authCtx.loggedInUser && authCtx.loggedInUser.name}</span>
    </>
  );

  return (
    <nav className={styles["navbar-container"]}>
      <h1 className={styles["logo"]}>Home Payments</h1>
      <div className={styles["nav-links"]}>
        <Link
          href='/'
          className={
            router.pathname === "/"
              ? styles["nav-link"] + " " + styles["active"]
              : styles["nav-link"]
          }
        >
          Home
        </Link>
        {!authCtx.isLoggedIn ? NotLoggedIn : LoggedIn}
        <ThemeToggler />
      </div>
    </nav>
  );
};

export default observer(Navbar);
