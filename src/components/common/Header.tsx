import { Link } from "gatsby";
import { ThemeToggle } from "@/components/common";

export const Header = () => {
  return (
    <>
      <header className="shadow">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            to={`/`}
            className="flex title-font font-medium items-center mb-4 md:mb-0"
          >
            <img
              src="/static-images/logo.png"
              className="w-12"
              width="3rem"
              alt="website logo"
            />
            <span className="ml-3 text-xl">BlogNotFoundException</span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center justify-center">
            <Link
              to={`/`}
              className="mr-5 hover:text-gray-900 dark:hover:text-gray-500"
            >
              Home
            </Link>
            <Link
              to={`/about`}
              className="mr-5 hover:text-gray-900 dark:hover:text-gray-500"
            >
              About
            </Link>
            {/* <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-5 cursor-pointer"
            /> */}
            <ThemeToggle></ThemeToggle>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
