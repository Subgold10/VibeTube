// List of categories
const categoryList = [
  "All",
  "Internshala",
  "CSS",
  "NodeJs",
  "JavaScript",
  "Songs",
  "MongoDB",
  "React",
  "Gaming",
  "Travel",
];

// functional component that shows category filter buttons
const FilterButtons = ({ selectedCategory, setCategory }) => {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-4 mt-6 mb-6 bg-white sticky top-14 z-10 scrollbar-hide">
      {/* Loop through each category and make a button */}
      {categoryList.map((item) => {
        const isActive = selectedCategory === item;

        return (
          <button
            key={item} // key to keep track of buttonss
            onClick={() => setCategory(item)}
            className={
              `px-5 py-2.5 text-sm font-medium rounded-full shadow-sm transition duration-200 whitespace-nowrap ` +
              (isActive
                ? "bg-gray-900 text-white shadow-md scale-105" // if button is clicked nake button dark
                : "bg-gray-100 text-gray-800 hover:bg-gray-200") // if button is not clicked make button light
            }
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;
