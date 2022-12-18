import styles from "styles/Index.module.css";
import { observer } from "mobx-react-lite";

interface props {
  children: React.ReactNode;
}

const Home = ({ children }: props) => {
  return <></>;
};

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default observer(Home);
