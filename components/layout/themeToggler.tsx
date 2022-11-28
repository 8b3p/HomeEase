import { useThemeVM } from "../../context/Contexts";
import { observer } from "mobx-react-lite";

interface props {
  className?: string;
}

const ThemeToggler = ({ className }: props) => {
  const { theme, toggleTheme } = useThemeVM();
  const isDark = theme === "dark";

  return (
    <button
      className={className}
      onClick={() => toggleTheme()}
      aria-label='Toggle Dark Mode'
    >
      {/* {isDark ? <Sun /> : <Moon />} */}
    </button>
  );
};

export default observer(ThemeToggler);
