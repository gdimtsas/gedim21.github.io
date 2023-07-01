import { ThemeToggler } from "gatsby-plugin-dark-mode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export const ThemeToggle = () => {
  return (
    <ThemeToggler>
      {({
        theme,
        toggleTheme,
      }: {
        theme: string;
        toggleTheme: (themeName: string) => void;
      }) => (
        <label
          className="cursor-pointer"
          onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" && <FontAwesomeIcon icon={faMoon} />}
          {theme === "light" && <FontAwesomeIcon icon={faSun} />}
        </label>
      )}
    </ThemeToggler>
  );
};
