import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { kernels } from "../../utils/kernels";
import CustomKernelEditor from "../customKernelEditor/CustomKernelEditor";
import FilterSelector from "../filterSelector/FilterSelector";
import Tabs from "../tabs/Tabs";
import RgbAdjuster from "../RgbAdjuster/RgbAdjuster";

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("identity");
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [customKernel, setCustomKernel] = useState<number[][] | null>(null);
  const [intensity, setIntensity] = useState<number>(100);
  const [rgbFactors, setRgbFactors] = useState<[number, number, number]>([
    1, 1, 1,
  ]);
  const [applyRgb, setApplyRgb] = useState(false);

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

  const handleRemoveFilter = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // Opcional: resetar seleção
    setSelectedFilter("identity");
    setCustomKernel(null);
  };

  useEffect(() => {
    if (!canvasRef.current || !originalCanvasRef.current || !imageSrc) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = canvasRef.current!;
      const originalCanvas = originalCanvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const oCtx = originalCanvas.getContext("2d")!;

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

      // Desenha imagem original
      originalCanvas.width = newWidth;
      originalCanvas.height = newHeight;
      oCtx.drawImage(image, 0, 0, newWidth, newHeight);

      // Aplica filtro
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      const imageData = ctx.getImageData(0, 0, newWidth, newHeight);

      const baseKernel = customKernel ?? kernels[selectedFilter];
      const identity = kernels["identity"];

      const resizedIdentity = baseKernel.map((row, i) =>
        row.map((_, j) => identity[i]?.[j] ?? 0),
      );

      const kernel = interpolateKernels(
        resizedIdentity,
        baseKernel,
        intensity / 100,
      );
      let resultData = applyConvolution(imageData, kernel);

      if (applyRgb) {
        resultData = applyRgbAdjustment(resultData, ...rgbFactors);
        setApplyRgb(true);
      }

      ctx.putImageData(resultData, 0, 0);
    };
  }, [selectedFilter, imageSrc, customKernel, intensity, applyRgb, rgbFactors]);

  const interpolateKernels = (
    k1: number[][],
    k2: number[][],
    factor: number,
  ): number[][] => {
    const result: number[][] = [];

    for (let i = 0; i < k1.length; i++) {
      result[i] = [];
      for (let j = 0; j < k1[i].length; j++) {
        const v1 = k1[i][j];
        const v2 = k2[i][j] ?? 0;
        result[i][j] = v1 * (1 - factor) + v2 * factor;
      }
    }

    return result;
  };

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

  const applyRgbAdjustment = (
    imageData: ImageData,
    rFactor: number,
    gFactor: number,
    bFactor: number,
  ) => {
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * rFactor); // Red
      data[i + 1] = Math.min(255, data[i + 1] * gFactor); // Green
      data[i + 2] = Math.min(255, data[i + 2] * bFactor); // Blue
    }

    return imageData;
  };

  const handleApplyRgb = (r: number, g: number, b: number) => {
    setRgbFactors([r, g, b]);
    setApplyRgb(true);
  };

  const handleResetRgb = () => {
    setRgbFactors([1, 1, 1]);
    setApplyRgb(true); // força reprocessamento
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = "imagem-filtrada.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
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

          <input
            multiple
            type="file"
            id="File"
            onChange={handleImageChange}
            className="sr-only"
          />
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
                  content: (
                    <RgbAdjuster
                      onApply={handleApplyRgb}
                      onReset={handleResetRgb}
                    />
                  ),
                },
                {
                  label: "Kernel Customizado",
                  content: (
                    <CustomKernelEditor
                      onApply={(matrix) => setCustomKernel(matrix)}
                    />
                  ),
                },
              ]}
            />

            <div className="mt-6 w-full max-w-md mx-auto text-center">
              <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                Intensidade do filtro: {intensity}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleRemoveFilter}
                className="px-5 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Remover Filtro
              </button>
            </div>

            <div className="my-10 flex justify-center items-center gap-6">
              {/* Canvas original */}
              <div className="flex flex-col items-center">
                <p className="mb-2 text-slate-600 dark:text-slate-300 text-sm">
                  Original
                </p>
                <canvas
                  ref={originalCanvasRef}
                  className="rounded-md shadow-md w-full max-w-[600px] h-auto"
                />
              </div>

              {/* Canvas filtrado */}
              <div className="flex flex-col items-center">
                <p className="mb-2 text-slate-600 dark:text-slate-300 text-sm">
                  Com Filtro
                </p>
                <canvas
                  ref={canvasRef}
                  className="rounded-md shadow-md w-full max-w-[600px] h-auto"
                />
              </div>
            </div>
            <div className="mt-6 pb-4">
              <button
                onClick={handleDownload}
                className="px-5 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Baixar imagem com filtro
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ImageUpload;
