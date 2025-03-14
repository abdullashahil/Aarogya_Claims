import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";

interface ClaimSubmissionFormProps {
  setActiveTab: (tab: string) => void;
  fetchClaims: () => Promise<void>;
}

export default function ClaimSubmissionForm({ setActiveTab, fetchClaims }: ClaimSubmissionFormProps) {
  const { accessToken } = useAuth(); 
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument(e.target.files[0]);
    }
  };

  const handleRemoveFile = (): void => {
    setDocument(null);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "aarogyaClaims");
    formData.append("cloud_name", "dhfkpiaie");

    const res = await fetch("https://api.cloudinary.com/v1_1/dhfkpiaie/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let documentUrl = "";

      if (document) {
        documentUrl = await uploadToCloudinary(document);
      }

      const payload = {
        name,
        email,
        claimAmount: parseFloat(amount),
        description,
        documentUrl,
      };

      
      const response = await fetch("https://aarogya-claims-server.vercel.app/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit claim");
      }

      toast.success("Claim submitted successfully!", {
        duration: 3000,
        position: "top-center",
      });

      // Reset form fields
      setName("");
      setEmail("");
      setAmount("");
      setDescription("");
      setDocument(null);

      // Refresh the claims data
      await fetchClaims();

      setActiveTab("my-claims");
    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl border border-gray-300 w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-black mb-6">Submit a New Claim</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="input bg-gray-100 border border-gray-300 focus:border-[#2F7FF2] focus:ring-[#2F7FF2] w-full text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input bg-gray-100 border border-gray-300 focus:border-[#2F7FF2] focus:ring-[#2F7FF2] w-full text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">Claim Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter claim amount"
              className="input bg-gray-100 border border-gray-300 focus:border-[#2F7FF2] focus:ring-[#2F7FF2] w-full text-black"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">Description</label>
            <textarea
              placeholder="Describe your claim"
              className="textarea bg-gray-100 border border-gray-300 focus:border-[#2F7FF2] focus:ring-[#2F7FF2] w-full text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            ></textarea>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">Upload Document</label>
            <input
              type="file"
              className="file-input bg-gray-100 border border-gray-300 w-full cursor-pointer text-black"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {document && (
              <div className="mt-2 flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
                <span className="text-black">{document.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="btn btn-sm btn-error text-white"
                >
                  Remove
                </button>
              </div>
            )}
            <span className="text-gray-400 text-sm mt-1">
              Upload receipt, prescription, or other supporting documents(.pdf, .png, .jpeg, .jpg, .webp)
            </span>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full bg-[#2F7FF2] text-white font-bold py-3 rounded-lg hover:bg-[#1E5CCF] transition flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting && <span className="loading loading-spinner"></span>}
              {isSubmitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}