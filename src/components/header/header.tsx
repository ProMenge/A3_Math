import Button from "../button/Button";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow dark:bg-slate-900">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-sky-600 dark:text-sky-600" href="#">
              <span className="sr-only">Home</span>
              <img src="./src/assets/Ocular.png" alt="logoOcular" className="h-8 block dark:hidden" />
              <img src="./src/assets/OcularWhite.png" alt="logoOcularWhite" className="h-8 hidden dark:block" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Button variant="primary">
                <a href="#upload">Editar</a>
              </Button>

              <div className="hidden sm:flex">
                <Button variant="light">
                  <a href="#footer">Sobre nós</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
