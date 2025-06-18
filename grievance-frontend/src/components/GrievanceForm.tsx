"use client";

import { useState } from "react";

const GrievanceForm = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    grievanceType: "",
    description: "",
    attachment: null as File | null,
    email: "student@example.com", // or receive via props/context
    otp: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      attachment: file || null,
    }));
  };

  const handleSendOtp = () => {
    if (formData.email) {
      setOtpSent(true);
      alert("OTP sent to your email!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full flex flex-col gap-4 bg-white p-6 rounded shadow">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block font-medium mb-2">
            Category
          </label>
          <div className="flex gap-6 ml-2">
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

        <div>
          <label htmlFor="grievance type" className="block font-medium mb-2">
            Grievance Type
          </label>
          <select name="grievance" id=""></select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description (up to 4000 characters)
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={4000}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-[#F5F5F5]"
            rows={5}
            placeholder="Enter your grievance description..."
          />
        </div>

        {/* File Upload */}
        <div>
          
          <label htmlFor="attachment" className="block font-medium mb-1">
            Attachment (optional, max 5MB)
          </label>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="w-full"
          />
          {formData.attachment && (
            <p className="">
              Selected: {formData.attachment.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              readOnly
              value={formData.email}
              className="w-full p-2 border rounded bg-[#F5F5F5] cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            className="h-10 mt-5 bg-green-500 text-white px-4 rounded hover:bg-green-600"
          >
            Send OTP
          </button>
        </div>

        {/* OTP Input */}
        {otpSent && (
          <div>
            <label htmlFor="otp" className="block font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              id="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-green-600 mt-1">
              OTP has been sent to your email.
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrievanceForm;
