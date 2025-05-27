import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { kernels } from "../../utils/Kernels";
import CustomKernelEditor from "../customKernelEditor/CustomKernelEditor";
import FilterSelector from "../filterSelector/FilterSelector";
import RgbAdjuster from "../RgbAdjuster/RgbAdjuster";
import Tabs from "../tabs/Tabs";

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("identity");

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !imageSrc) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

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

      // Resetar filtro e RGB
      setSelectedFilter("identity");
      setCustomKernel(null);
      setRgbFactors([1, 1, 1]);
      setIntensity(100);
    };
  };

  useEffect(() => {
    if (!canvasRef.current || !imageSrc) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
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
        setApplyRgb(true); // importante: evita loop infinito
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

    // Interpola os fatores com base na intensidade
    const mix = intensity / 100;
    const r = 1 * (1 - mix) + rFactor * mix;
    const g = 1 * (1 - mix) + gFactor * mix;
    const b = 1 * (1 - mix) + bFactor * mix;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * r); // Red
      data[i + 1] = Math.min(255, data[i + 1] * g); // Green
      data[i + 2] = Math.min(255, data[i + 2] * b); // Blue
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
            <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-8">
              {/* LADO ESQUERDO: controles */}
              <div className="flex-1">
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

                {/* Range de intensidade */}
                <div className="mt-6">
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
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

                {/* Botão de remover filtro */}
                <div className="mt-4">
                  <button
                    onClick={handleRemoveFilter}
                    className="px-5 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  >
                    Remover Filtro
                  </button>
                </div>
              </div>

              {/* LADO DIREITO: canvas e botão de download */}
              <div className="flex-1 flex flex-col items-center mt-18">
                <canvas
                  ref={canvasRef}
                  className="rounded-md shadow-md w-full max-w-[600px] h-auto"
                />
                <button
                  onClick={handleDownload}
                  className="mt-6 px-5 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  Baixar imagem com filtro
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ImageUpload;
