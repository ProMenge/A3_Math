import { useState } from "react";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-2xl mt-8 text-center flex flex-col">
      <div className="w-full">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === idx
                ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400"
                : "text-slate-600 hover:text-sky-500 dark:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center min-h-[300px] w-[480px] border border-slate-300 dark:border-slate-700">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
