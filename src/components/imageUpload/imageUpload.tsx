import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { kernels } from "../../utils/kernels";
import CustomKernelEditor from "../customKernelEditor/CustomKernelEditor";
import FilterSelector from "../filterSelector/FilterSelector";
import Tabs from "../tabs/tabs";

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("identity");
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [customKernel, setCustomKernel] = useState<number[][] | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
    const files = e.target.files;
    if (files) {
      const names = Array.from(files).map((file) => file.name);
      setImageNames(names);
    }
  };

  const handleApplyFilter = (filterName: string) => {
    setSelectedFilter(filterName);
  };

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current || !imageSrc) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    image.onload = () => {
      const maxWidth = 600;
      const maxHeight = 600;

      let scale = 1;
      if (image.width > maxWidth || image.height > maxHeight) {
        const scaleX = maxWidth / image.width;
        const scaleY = maxHeight / image.height;
        scale = Math.min(scaleX, scaleY);
      }

      const newWidth = image.width * scale;
      const newHeight = image.height * scale;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      const imageData = ctx.getImageData(0, 0, newWidth, newHeight);

      const kernel = customKernel ?? kernels[selectedFilter];
      const filtered = applyConvolution(imageData, kernel);
      ctx.putImageData(filtered, 0, 0);
    };

    image.src = imageSrc;
  }, [selectedFilter, imageSrc, customKernel]);

  const applyConvolution = (imageData: ImageData, kernel: number[][]) => {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const side = kernel.length;
    const half = Math.floor(side / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0;

        for (let ky = 0; ky < side; ky++) {
          for (let kx = 0; kx < side; kx++) {
            const posX = x + kx - half;
            const posY = y + ky - half;
            if (posX >= 0 && posX < width && posY >= 0 && posY < height) {
              const offset = (posY * width + posX) * 4;
              const weight = kernel[ky][kx];
              r += data[offset] * weight;
              g += data[offset + 1] * weight;
              b += data[offset + 2] * weight;
            }
          }
        }

        const i = (y * width + x) * 4;
        output.data[i] = Math.min(Math.max(r, 0), 255);
        output.data[i + 1] = Math.min(Math.max(g, 0), 255);
        output.data[i + 2] = Math.min(Math.max(b, 0), 255);
        output.data[i + 3] = data[i + 3]; // alpha
      }
    }

    return output;
  };

  return (
    <section
      id="upload"
      className="w-full flex items-center bg-slate-50 dark:bg-slate-900 px-4 py-20 my-10"
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center max-h-screen">
        <motion.h2
          className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Faça upload da sua imagem
        </motion.h2>

        <motion.p
          className="text-slate-600 dark:text-slate-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Selecione uma imagem para aplicar os filtros personalizados com
          matrizes.
        </motion.p>

        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          htmlFor="File"
          className="block rounded border border-slate-300 bg-white p-4 my-10 text-slate-900 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium dark:text-white">
              {imageNames.length > 0
                ? `${imageNames.length} arquivo(s) selecionado(s)`
                : "Carregue sua imagem"}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
              />
            </svg>
          </div>

          <input multiple type="file" id="File" onChange={handleImageChange} className="sr-only" />
        </motion.label>


        {imageSrc && (
          <>
          <div className="flex gap-2 my-10"></div>
            <Tabs
              tabs={[
                {
                  label: "Filtros",
                  content: <FilterSelector onApply={handleApplyFilter} />,
                },
                {
                  label: "RGB",
                  content: <p className="dark:text-slate-50">A ser criado.</p>,
                },
                {
                  label: "Kernel Customizado",
                  content: <CustomKernelEditor onApply={(matrix) => setCustomKernel(matrix)} />,
                },
              ]}
            />

            <div className="my-10 flex justify-center items-center gap-6">
              <canvas
                ref={canvasRef}
                className="rounded-md shadow-md w-full max-w-[600px] h-auto"
              />
              <img
                ref={imageRef}
                src={imageSrc}
                alt="original"
                className="hidden my-10"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ImageUpload;
