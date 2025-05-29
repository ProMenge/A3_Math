import { motion } from "framer-motion";
import Button from "../button/Button";

const Hero = () => {
  return (
    <motion.section
      className="bg-slate-50 lg:grid h-screen block lg:place-content-center dark:bg-slate-900"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold leading-normal text-slate-900 dark:text-slate-50 sm:text-5xl">
            Edite suas imagens na
            <strong className="text-sky-600"> velocidade da luz</strong>
          </h1>

          <p className="mt-4 text-base text-pretty text-slate-700 dark:text-slate-50 sm:text-lg/relaxed">
            Filtros rápidos e simples, sem custos adicionais, apenas aproveite.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <Button variant="solid-border">
              <a href="#upload">Editar Agora</a>
            </Button>

            <Button variant="light-border">
              <a href="#footer">Sobre nós</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
