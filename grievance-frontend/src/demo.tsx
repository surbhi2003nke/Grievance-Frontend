"use client";

import { useState } from "react";

const GrievanceForm = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    grievanceType: "",
    description: "",
    attachment: null as File | null,
    mobileNumber: "",
    otp: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files?.[0] || null,
    }));
  };

  const handleSendOtp = () => {
    // Simulate OTP logic
    if (formData.mobileNumber) {
      setOtpSent(true);
      alert("OTP sent!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="flex justify-center gap-y-0.5">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1100px] flex flex-col gap-0.5"
      >
        <div className="relative bg-white flex items-center p-2.5 h-20">
          <label
            htmlFor="category"
            className="absolute left-6 top-1/2 -translate-y-1/2 font-medium"
          >
            Category
          </label>
          <div className="ml-40 flex gap-8">
            {["Academic", "Non-Academic", "Other"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={option}
                  checked={formData.category === option}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>


        <div className="relative bg-white flex items-center p-2.5 h-16">
          <label className="absolute left-6 top-1/2 -translate-y-1/2 font-medium">
            Description (Please Enter Your Grievance Description upto 4000
            characters)
          </label>
          <textarea
            name="description"
            placeholder="Please Enter Your Grievance Description (up to 4000 characters)"
            maxLength={4000}
            value={formData.description}
            onChange={handleChange}
            className="ml-40 w-3/4 p-2 rounded bg-[#F5F5F5]"
          />
        </div>

        <div className="relative bg-white flex items-center p-2.5 h-16">
          <label className="block mb-1">Attachment (if any, max 5.0 MB)</label>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="ml-40 w-3/4 p-2 rounded bg-[#F5F5F5]"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Send OTP
          </button>
        </div>

        <div className="relative bg-white flex items-center p-2.5 h-16">
          <div>
            <label className="absolute left-6 top-1/2 -translate-y-1/2 font-medium">Enter OTP</label>

          </div>
          <div>
            {otpSent && (
              <span className="text-green-600 ml-40">
                OTP has been sent to your email.
              </span>
            )}
          </div>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default GrievanceForm;
