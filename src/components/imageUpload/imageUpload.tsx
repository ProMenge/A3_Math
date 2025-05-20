import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { kernels } from "../../utils/kernels";
import CustomKernelEditor from "../customKernelEditor/CustomKernelEdiitor";
import FilterSelector from "../filterSelector/FilterSelector";

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
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
      className="h-screen w-full flex items-center bg-slate-50 dark:bg-slate-800 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
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

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block mx-auto mb-6 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-sky-600 file:text-white file:font-semibold hover:file:bg-sky-700 cursor-pointer"
        />

        {imageSrc && (
          <>
            <FilterSelector onApply={handleApplyFilter} />

            <CustomKernelEditor onApply={(matrix) => setCustomKernel(matrix)} />

            <div className="mt-10 flex justify-center flex-col items-center gap-6">
              <p className="text-slate-700 dark:text-slate-200">
                Resultado com filtro:
              </p>
              <canvas
                ref={canvasRef}
                className="rounded-md shadow-md max-w-full max-h-[800px]"
              />

              <img
                ref={imageRef}
                src={imageSrc}
                alt="original"
                className="hidden"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ImageUpload;
