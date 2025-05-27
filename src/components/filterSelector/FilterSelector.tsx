import React, { useState } from "react";

interface FilterSelectorProps {
  onApply: (filterName: string) => void;
}

const filterOptions = [
  {
    name: "identity",
    label: "Sem Filtros",
    description: "Não altera a imagem.",
  },
  {
    name: "blur",
    label: "Desfoque 3x3",
    description: "Desfoca levemente a imagem.",
  },
  {
    name: "box5x5",
    label: "Desfoque 5x5",
    description: "Desfoca de forma mais ampla.",
  },
  {
    name: "gaussian5x5",
    label: "Desfoque Gaussiano",
    description: "Desfoque suave e natural.",
  },
  {
    name: "sharpen",
    label: "Realce 3x3",
    description: "Aumenta o contraste da imagem.",
  },
  {
    name: "sharpen5x5",
    label: "Realce Forte 5x5",
    description: "Realce agressivo com maior nitidez.",
  },
  {
    name: "edge",
    label: "Bordas 3x3",
    description: "Realça as bordas da imagem.",
  },
  {
    name: "edge7x7",
    label: "Bordas Extensas 7x7",
    description: "Cria bordas dramáticas e intensas.",
  },
  {
    name: "emboss5x5",
    label: "Relevo Horizontal",
    description: "Gera efeito de relevo lateral.",
  },
  {
    name: "embossDiagonal",
    label: "Relevo Diagonal",
    description: "Efeito de relevo inclinado.",
  },
  {
    name: "thickEdge",
    label: "Bordas Grossas",
    description: "Transforma bordas em contornos mais fortes.",
  },
];

const FilterSelector: React.FC<FilterSelectorProps> = ({ onApply }) => {
  const [selectedFilter, setSelectedFilter] = useState("identity");

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-4 bg-slate-50 dark:bg-slate-900 rounded-md">
      <fieldset className="space-y-2">
        <legend className="text-lg font-semibold text-slate-800 dark:text-sky-50 mb-4">
          Escolha um filtro:
        </legend>

        {filterOptions.map((filter) => (
          <label
            key={filter.name}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 border rounded-lg cursor-pointer transition ${
              selectedFilter === filter.name
                ? "border-sky-500 bg-sky-50 dark:bg-sky-900"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="filter"
                value={filter.name}
                checked={selectedFilter === filter.name}
                onChange={() => setSelectedFilter(filter.name)}
                className="sr-only"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-white">{filter.label}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-300">{filter.description}</span>
          </label>
        ))}
      </fieldset>

      <div className="mt-6 text-center">
        <button
          onClick={() => onApply(selectedFilter)}
          className="px-6 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
        >
          Aplicar Filtro
        </button>
      </div>
    </div>
  );
};

export default FilterSelector;
