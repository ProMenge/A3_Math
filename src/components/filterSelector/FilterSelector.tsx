import React, { useState } from "react";

interface FilterSelectorProps {
  onApply: (filterName: string) => void;
}

const filterOptions = [
  {
    name: "identity",
    label: "Sem Filtro",
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

  const selected = filterOptions.find((f) => f.name === selectedFilter);

  return (
    <div className="text-center mt-10">
      <label
        htmlFor="filter"
        className="block mb-2 text-slate-700 dark:text-white font-medium"
      >
        Selecione um filtro:
      </label>
      <select
        id="filter"
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 dark:bg-slate-700 dark:text-white"
      >
        {filterOptions.map((filter) => (
          <option key={filter.name} value={filter.name}>
            {filter.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onApply(selectedFilter)}
        className="ml-4 px-5 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
      >
        Aplicar Filtro
      </button>

      {selected && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 italic">
          {selected.description}
        </p>
      )}
    </div>
  );
};

export default FilterSelector;
