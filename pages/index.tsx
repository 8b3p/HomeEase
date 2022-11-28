import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

interface props {
  children: React.ReactNode;
}

const Home = ({ children }: props) => {
  const router = useRouter();
  const iconSize = 50;
  return (
    <div className={styles.container}>
      <div className={styles["left-pane"]}>
        <nav className={styles["nav-list"]}>
          <ul>
            <li>
              <Link
                href={"/payments"}
                // className={({ isActive }) => {
                //   return isActive ? styles["active"] : "";
                // }}
                className={
                  router.pathname === "/payments" ? styles["active"] : ""
                }
              >
                {/* <Coin size={iconSize} /> */}
              </Link>
            </li>
            <li>
              <Link
                href={"/chores"}
                // className={({ isActive }) => {
                //   return isActive ? styles["active"] : "";
                // }}
                className={
                  router.pathname === "/chores" ? styles["active"] : ""
                }
              >
                {/* <PinpaperFilled size={iconSize} /> */}
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link
                href='/login'
                // className={({ isActive }) => {
                //   return isActive ? styles["active"] : "";
                // }}
                className={router.pathname === "/login" ? styles["active"] : ""}
              >
                {/* <Login size={iconSize} /> */}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles["right-pane"]}>{children}</div>
    </div>
  );
};

export default Home;
