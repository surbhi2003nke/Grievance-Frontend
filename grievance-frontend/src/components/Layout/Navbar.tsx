const Navbar = () => {
  const userId = "61520032"; // hardcoded for now

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white h-16 px-6 shadow-sm flex items-center justify-between">
      <h1 className="text-blue-700 text-lg font-semibold">
        DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY
      </h1>
      <div className="flex items-center gap-2 text-blue-700 font-medium">
        <span className="text-xl">👤</span>
        <span>{userId}</span>
      </div>
    </div>
  );
};

export default Navbar;
