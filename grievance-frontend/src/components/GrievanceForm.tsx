"use client"
import { useEffect, useState, type FormEvent } from "react"
import Captcha from "./Captcha"
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react"

interface GrievanceCategory {
  category: string
  types: string[]
}

const GrievanceForm = () => {
  const [categories, setCategories] = useState<GrievanceCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [grievanceTypes, setGrievanceTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)

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

  useEffect(() => {
    const categoryObj = categories.find(
      (cat) => cat.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    setGrievanceTypes(categoryObj ? categoryObj.types : []);
    setSelectedType(""); // Reset type when category changes
  }, [selectedCategory, categories]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!captchaVerified) {
      alert("Please verify the CAPTCHA first.")
      return
    }

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Form submitted:", {
        category: selectedCategory,
        type: selectedType,
        description,
        attachment: attachment?.name,
        captchaVerified,
      })

      setSuccess(true)
      setSelectedCategory("")
      setSelectedType("")
      setDescription("")
      setAttachment(null)
      setCaptchaVerified(false)
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Grievance Submission Portal</h1>
              <p className="text-slate-600 mt-1">Submit your concerns and feedback through this secure form</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="divide-y divide-slate-200">
            {/* Category Selection */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label htmlFor="grievanceCategory" className="block text-sm font-semibold text-slate-900 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">Select the type of grievance</p>
                </div>
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Academic", "Non-Academic", "Optional"].map((category) => (
                      <label
                        key={category}
                        className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="grievanceCategory"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          required
                        />
                        <span className="ml-3 text-sm font-medium text-slate-900">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Type */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label htmlFor="grievanceType" className="block text-sm font-semibold text-slate-900 mb-1">
                    Subject Type <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">Specify the nature of your grievance</p>
                </div>
                <div className="md:col-span-3">
                  {(() => {
                    let content = null;
                    if (loading) {
                      content = (
                        <div className="flex items-center gap-2 text-slate-500">
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                          Loading grievance types...
                        </div>
                      );
                    } else if (selectedCategory === "") {
                      content = (
                        <div className="flex items-center gap-2 text-slate-500 p-3 bg-slate-50 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          Please select a category first
                        </div>
                      );
                    } else if (grievanceTypes.length === 0) {
                      content = (
                        <input
                          type="text"
                          id="grievanceType"
                          name="grievanceType"
                          placeholder="Enter your grievance type"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          required
                        />
                      );
                    } else {
                      content = (
                        <select
                          id="grievanceType"
                          name="grievanceType"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select a grievance type
                          </option>
                          {grievanceTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      );
                    }
                    return content;
                  })()}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">
                    Provide detailed information about your grievance (max 4000 characters)
                  </p>
                </div>
                <div className="md:col-span-3">
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    maxLength={4000}
                    placeholder="Please describe your grievance in detail..."
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-slate-500">{description.length}/4000 characters</div>
                    <div className={`text-xs ${description.length > 3800 ? "text-orange-600" : "text-slate-500"}`}>
                      {4000 - description.length} remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Attachment */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label htmlFor="attachment" className="block text-sm font-semibold text-slate-900 mb-1">
                    Attachment
                  </label>
                  <p className="text-xs text-slate-500">Upload supporting documents (PDF only, max 2MB)</p>
                </div>
                <div className="md:col-span-3">
                  <div className="relative">
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      accept=".pdf"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    />
                  </div>
                  {attachment && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <Upload className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">File selected: {attachment.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CAPTCHA */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <label htmlFor="captcha" className="block text-sm font-semibold text-slate-900 mb-1">
                    Verification <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">Complete the security verification</p>
                </div>
                <div className="md:col-span-3">
                  <Captcha onVerify={setCaptchaVerified} isEnabled={true} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 bg-slate-50">
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    submitting || !captchaVerified
                      ? "bg-slate-400 text-slate-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                  }`}
                  disabled={submitting || !captchaVerified}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Grievance...
                    </div>
                  ) : (
                    "Submit Grievance"
                  )}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-6 bg-green-50 border-t border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-green-900">Grievance Submitted Successfully</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your grievance has been recorded. You will receive a confirmation email with your reference number
                      shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All grievances are reviewed by the appropriate authorities. You will receive updates
            on the status of your submission via email. For urgent matters, please contact the administration directly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GrievanceForm
