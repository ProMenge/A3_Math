import "./styles.css";

const Header = () => {
  return (
    <header className="bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-sky-600 dark:text-sky-600" href="#">
              <span className="sr-only">Home</span>
              <img src=".\src\assets\Ocular.png" alt="logoOcular" className="h-8"/>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <a
                className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-sky-500"
                href="#"
              >
                Editar
              </a>

              <div className="hidden sm:flex">
                <a
                  className="rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-sky-600 dark:bg-slate-800 dark:text-white dark:hover:text-white/75"
                  href="#"
                >
                  Sobre Nós
                </a>
              </div>
            </div>

            <div className="block md:hidden">
              <button
                className="rounded-sm bg-slate-100 p-2 text-slate-600 transition hover:text-slate-600/75 dark:bg-slate-800 dark:text-white dark:hover:text-white/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
