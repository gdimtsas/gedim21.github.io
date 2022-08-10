import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = () => {
  return (
    <ThemeToggler>
      {({
        theme,
        toggleTheme,
      }: {
        theme: string;
        toggleTheme: (themeName: string) => void;
      }) => (
        <label className="cursor-pointer">
          {theme === 'dark' && (
            <FontAwesomeIcon
              icon={faMoon}
              onClick={() => toggleTheme('light')}
            />
          )}
          {theme === 'light' && (
            <FontAwesomeIcon icon={faSun} onClick={() => toggleTheme('dark')} />
          )}
        </label>
      )}
    </ThemeToggler>
  );
};

export default ThemeToggle;
