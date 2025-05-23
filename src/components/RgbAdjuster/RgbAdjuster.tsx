import React, { useState } from "react";

interface Props {
  onApply: (rFactor: number, gFactor: number, bFactor: number) => void;
  onReset: () => void;
}

const RgbAdjuster: React.FC<Props> = ({ onApply, onReset }) => {
  const [r, setR] = useState(100);
  const [g, setG] = useState(100);
  const [b, setB] = useState(100);

  const handleApply = () => {
    onApply(r / 100, g / 100, b / 100);
  };

  return (
    <div className="text-center py-4 px-4">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
        Ajuste de Canais RGB
      </h3>

      <div className="mb-4">
        <label className="block mb-1 text-slate-700 dark:text-slate-200">
          Vermelho: {r}%
        </label>
        <input
          type="range"
          min={0}
          max={200}
          value={r}
          onChange={(e) => setR(Number(e.target.value))}
          className="w-full accent-red-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-slate-700 dark:text-slate-200">
          Verde: {g}%
        </label>
        <input
          type="range"
          min={0}
          max={200}
          value={g}
          onChange={(e) => setG(Number(e.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-slate-700 dark:text-slate-200">
          Azul: {b}%
        </label>
        <input
          type="range"
          min={0}
          max={200}
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleApply}
          className="px-5 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
        >
          Aplicar RGB
        </button>
        <button
          onClick={onReset}
          className="px-5 py-2 rounded-md bg-slate-300 text-slate-800 font-semibold hover:bg-slate-400 transition"
        >
          Reset RGB
        </button>
      </div>
    </div>
  );
};

export default RgbAdjuster;
