import Button from "../button/button";
import "./styles.css";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow dark:bg-slate-900/90">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-sky-600 dark:text-sky-600" href="#">
              <span className="sr-only">Home</span>
              <img
                src="./src/assets/Ocular.png"
                alt="logoOcular"
                className="h-8"
              />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Button variant="primary">Editar</Button>

              <div className="hidden sm:flex">
                <Button variant="light">Sobre Nós</Button>
              </div>
            </div>

            <div className="block md:hidden">
              <button className="rounded-sm bg-slate-100 p-2 text-slate-600 transition hover:text-slate-600/75 dark:bg-slate-800 dark:text-white dark:hover:text-white/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
