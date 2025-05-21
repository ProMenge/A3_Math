import React, { useState } from "react";

interface Props {
  size?: 3 | 5;
  onApply: (kernel: number[][]) => void;
}

const CustomKernelEditor: React.FC<Props> = ({ size = 3, onApply }) => {
  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: size }, () => Array(size).fill(0)),
  );

  const handleChange = (value: string, row: number, col: number) => {
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = parseFloat(value);
    setMatrix(newMatrix);
  };

  const handleApply = () => {
    onApply(matrix);
  };

  return (
    <div className="text-center flex mt-10 bg-white dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        Matriz personalizada ({size}x{size})
      </h3>

      <div
        className="inline-grid"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {matrix.map((row, rowIndex) =>
          row.map((val, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              step="any"
              value={val}
              onChange={(e) => handleChange(e.target.value, rowIndex, colIndex)}
              className="w-16 text-center m-1 rounded border border-slate-300 p-1 dark:bg-slate-700 dark:text-white"
            />
          )),
        )}
      </div>

      <button
        onClick={handleApply}
        className="mt-4 px-5 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
      >
        Aplicar Filtro Personalizado
      </button>
    </div>
  );
};

export default CustomKernelEditor;
