const Sidebar = () => {
  return (
    <div className="bg-white w-60 min-h-screen shadow-sm absolute left-0 top-14 z-10">
      <div className="flex flex-col items-center py-6 border-r-8 rounded-r-xs border-[#007AFF]">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
          👤
        </div>
        <p className="text-blue-700 mt-2 font-semibold">NEHA SHARMA</p>
      </div>

      <ul className="mt-4">
        {[
          "Dashboard",
          "Lodge Grievance",
          "Track Grievance",
          "Grievance History",
          "Logout",
        ].map((item) => (
          <li
            key={item}
            className="px-4 py-3 hover:bg-[#] border-xs cursor-pointer text-sm rounded-r-lg "
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
