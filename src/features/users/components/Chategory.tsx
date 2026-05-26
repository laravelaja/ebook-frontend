interface ChategoryProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Chategory = ({ categories, selectedCategory, onSelectCategory }: ChategoryProps) => {
  return (
    <div className="w-full overflow-x-auto py-1 whitespace-nowrap flex gap-2 scrollbar-none">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              isActive
                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                : 'bg-sky-50/50 border-sky-100/50 text-slate-600 hover:bg-sky-100 hover:text-sky-800'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
