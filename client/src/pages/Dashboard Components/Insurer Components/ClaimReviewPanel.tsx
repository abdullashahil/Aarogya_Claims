import { useState, type FormEvent } from "react"
import type { Claim, ClaimStatus } from "../types/claim"
import { ExternalLink } from "lucide-react";


interface ClaimReviewPanelProps {
    claim: Claim | null
    onUpdateClaim: (_id: string, status: ClaimStatus, approvedAmount?: number, insurerComments?: string) => void
    onClose: () => void
}

export default function ClaimReviewPanel({ claim, onUpdateClaim, onClose }: ClaimReviewPanelProps) {
    const [status, setStatus] = useState<ClaimStatus>(claim?.status || "Pending")
    const [approvedAmount, setApprovedAmount] = useState<string>(
        claim?.approvedAmount !== undefined ? claim.approvedAmount.toString() : "",
    )
    const [insurerComments, setInsurerComments] = useState<string>(claim?.insurerComments || "")
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!claim) return null

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        onUpdateClaim(claim._id, status, status === "Approved" ? Number.parseFloat(approvedAmount) : undefined, insurerComments)

        setIsSubmitting(false)
        onClose()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Determine document type to render appropriately
    const getDocumentType = (url: string) => {
        const extension = url.split(".").pop()?.toLowerCase()
        if (["pdf"].includes(extension || "")) return "pdf"
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) return "image"
        return "other"
    }

    return (
        <div className="w-full h-[70vh] flex flex-col">
            <div className="bg-white w-full h-[70vh] flex-1 overflow-hidden flex flex-col">
                {/* Scrollable content area */}
                <div className="p-4 overflow-y-scroll flex-1 pb-24 custom-scrollbar">
                    {" "}
                    {/* Add padding at bottom for fixed buttons */}
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Review Claim</h2>
                    </div>
                    <div className="border-t border-gray-200 mb-4"></div>
                    {/* Claim Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Patient Information */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Patient Information</h3>
                            <p className="text-gray-600">
                                <span className="font-medium">Name:</span> {claim.name}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Email:</span> {claim.email}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Submitted:</span> {formatDate(claim.submissionDate)}
                            </p>
                        </div>

                        {/* Claim Details */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Claim Details</h3>
                            <p className="text-gray-600">
                                <span className="font-medium">Amount:</span> ₹{claim.claimAmount.toFixed(2)}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={`font-semibold ${claim.status === "Approved"
                                            ? "text-green-600"
                                            : claim.status === "Rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {claim.status}
                                </span>
                            </p>
                            {claim.approvedAmount !== undefined && (
                                <p className="text-gray-600">
                                    <span className="font-medium">Approved Amount:</span> ₹{claim.approvedAmount.toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="bg-gray-100 p-3 rounded-lg text-gray-700">{claim.description}</p>
                    </div>
                    {/* Supporting Document */}
                    {claim.documentUrl && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Supporting Document</h3>

                            {/* Document Preview */}
                            <div className="mb-3 border rounded-lg overflow-hidden" style={{ height: "400px" }}>
                                {getDocumentType(claim.documentUrl) === "pdf" ? (
                                    <iframe src={`${claim.documentUrl}#view=FitH`} className="w-full h-full" title="Document Preview" />
                                ) : getDocumentType(claim.documentUrl) === "image" ? (
                                    <img
                                        src={claim.documentUrl || "/placeholder.svg"}
                                        alt="Document Preview"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <p className="text-gray-500">Preview not available</p>
                                    </div>
                                )}
                            </div>

                            {/* View Full Document Link */}
                            <div className="flex items-center gap-2">
                                <a
                                    href={claim.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                                >
                                    <ExternalLink className="w-5 h-5" /> View Full Document
                                </a>
                            </div>
                        </div>
                    )}
                    <div className="border-t border-gray-200 mb-4"></div>
                    {/* Update Form */}
                    <form id="updateClaimForm" onSubmit={handleSubmit}>
                        {/* Status Update */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Update Status</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ClaimStatus)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Approved Amount */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Approved Amount (₹)</label>
                            <input
                                type="number"
                                placeholder="Enter approved amount"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-200 disabled:cursor-not-allowed"
                                value={approvedAmount}
                                onInput={(e) => {
                                    let value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, "")
                                    if (value.length < 6) setApprovedAmount(value)
                                }}
                                min="0"
                                step="1"
                                required={status === "Approved"}
                                disabled={status !== "Approved"}
                            />
                        </div>

                        {/* Comments */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Comments</label>
                            <textarea
                                placeholder="Add comments for the patient"
                                className="w-full p-2 max-h-40 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                value={insurerComments}
                                onChange={(e) => setInsurerComments(e.target.value)}
                                rows={3}
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Fixed buttons at the bottom */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3 shadow-md">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="updateClaimForm"
                        className={`px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Claim"}
                    </button>
                </div>
            </div>
        </div>
    )
}

