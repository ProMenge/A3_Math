import "./styles.css";

const Hero = () => {
  return (
    <section className="bg-white lg:grid h-screen lg:h-screen lg:place-content-center dark:bg-slate-900">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold leading-normal text-slate-900 dark:text-slate-50 sm:text-5xl">
            Edite suas imagens na<strong className="text-sky-600"> velocidade da luz </strong>
          </h1>

          <p className="mt-4 text-base text-pretty text-slate-700 dark:text-slate-50 sm:text-lg/relaxed">
            Filtros rápidos e simples, sem custos adicionais, apenas aproveite.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <a
              className="inline-block rounded border border-sky-600 bg-sky-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-sky-700"
              href="#"
            >
              Editar Agora
            </a>

            <a
              className="inline-block rounded border border-slate-200 px-5 py-3 font-medium text-slate-700 dark:text-slate-50 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
              href="#"
            >
              Sobre nós
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
