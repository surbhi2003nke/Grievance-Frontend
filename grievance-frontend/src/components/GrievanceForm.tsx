"use client";

import { useEffect, useState } from "react";

interface GrievanceCategory {
  category: string;
  types: string[];
}

const GrievanceTypeDropdown = () => {
  const [categories, setCategories] = useState<GrievanceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [grievanceTypes, setGrievanceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/grievance-types");
        const data = await res.json();
        setCategories(data.grievanceCategories);
      } catch (error) {
        console.error("Error fetching grievance types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update grievance types when category changes
  useEffect(() => {
    const categoryObj = categories.find(
      (cat) => cat.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    setGrievanceTypes(categoryObj ? categoryObj.types : []);
  }, [selectedCategory, categories]);

  // some tailwind classes for styling-
  const rowStyle = "flex flex-col md:flex-row gap-2 mx-1 bg-white p-5";
  const labelcontrainer = "basis-1/5 content-center";
  const labelstyle =
    "font-medium text-gray-700 flex items-center justify-start h-full";
  const inputStyle =
    "w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  // RETURN TSX
  return (
    <div className="p-4  flex flex-col gap-1 m-4 w-[100%]">
      {/* SELECT CATEGORY */}
      <div className={rowStyle}>
        <div className={labelcontrainer}>
          <label className={labelstyle}>Category</label>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center md:w-[50%] ">
          {["Academic", "Non-Academic", "Optional"].map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="radio"
                name="grievanceCategory"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-gray-800">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* GRIEVANCE TYPE SELECT */}
      <div className={rowStyle}>
        <div className={labelcontrainer}>
          <label htmlFor="grievanceType" className={labelstyle}>
            Subject Type
          </label>
        </div>
        {loading ? (
          <p>Loading grievance types...</p>
        ) : selectedCategory === "" ? (
          <p className="text-sm text-gray-500">
            Please select a category first.
          </p>
        ) : grievanceTypes.length === 0 ? (
          <input
            type="text"
            id="grievanceType"
            name="grievanceType"
            placeholder="Enter your grievance type"
            className="w-full p-2 rounded border border-gray-300"
          />
        ) : (
          <select
            id="grievanceType"
            name="grievanceType"
            className="w-full p-2 rounded border border-gray-300"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Select a grievance type
            </option>
            {grievanceTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* DESCRIPTION OF THE GRIEVANCE */}
      <div className={rowStyle}>
        <div className={labelcontrainer}>
          <label
            htmlFor="description"
            className={labelstyle + " flex flex-col items-start text-left"}
          >
            <span className=""> Description </span>
            <span className="text-sm text-gray-500">
              (Please enter your grievance description upto 4000 characters)
            </span>
          </label>
        </div>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={4000}
          placeholder="Describe your grievance here..."
          required
          className={`${inputStyle} h-32 resize-none rounded border border-gray-300`}
        />
      </div>

      {/* PDF FILE ATTACHMENT */}
      <div className={rowStyle}>
        <div className={labelcontrainer}>
          <label
            htmlFor="attachment"
            className={labelstyle + " flex flex-col items-start text-left"}
          >
            <span className=""> Attachment </span>
            <span className="text-sm text-gray-500">(if any, max 2.0 MB)</span>
          </label>
        </div>
        <input
          type="file"
          id="attachment"
          name="attachment"
          accept=".pdf"
          className={`${inputStyle} + "file:mt-2 file:mr-2 file:py-1 file:px-2 file:border file:border-gray-300 file:rounded file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 hover:file:cursor-pointer"`}
        />
      </div>

      {/*EMAIL OTP VERIFICATION  */}
      {/* <div className={rowStyle}>
        <div className={labelcontrainer}>
          <label htmlFor="email" className={labelstyle}>
            Email
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="email"
            readOnly
            // value={}
            className={inputStyle + " w-3/4 p-2 rounded bg-[#F5F5F5]"}
          />
          <button
            type="button"
            // onClick={}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
          >
            Send OTP
          </button>
        </div>
      </div> */}

    </div>
  );
};

export default GrievanceTypeDropdown;
