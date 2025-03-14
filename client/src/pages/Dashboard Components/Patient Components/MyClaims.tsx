import React, { useState } from "react";
import type { Claim, ClaimStatus } from "../types/claim";
import { FileText, X, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface PatientDashboardProps {
  claims: Claim[];
  fetchClaims: () => Promise<void>;
}

function MyClaims({ claims, fetchClaims }: PatientDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "All">("All");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);

  const openModal = (claim: Claim) => setSelectedClaim(claim);
  const closeModal = () => setSelectedClaim(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchClaims();
    } catch (error) {
      toast.error("Failed to fetch claims. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const filteredClaims =
    statusFilter === "All" ? claims : claims.filter((claim) => claim.status === statusFilter);

  const sortedClaims = filteredClaims.sort((a, b) => {
    const dateA = new Date(a.submissionDate).getTime();
    const dateB = new Date(b.submissionDate).getTime();
    return dateSort === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleDateSort = () => {
    setDateSort(dateSort === "asc" ? "desc" : "asc");
  };

  const getStatusBadgeClass = (status: ClaimStatus) => {
    switch (status) {
      case "Pending":
        return "badge badge-warning";
      case "Approved":
        return "badge badge-success";
      case "Rejected":
        return "badge badge-error";
      default:
        return "badge badge-ghost";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card bg-white shadow-lg border border-gray-300 p-4">
      <div className="card-body">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="card-title text-2xl font-bold text-gray-800">Your Claims</h2>
          <div className="form-control mt-4 md:mt-0 flex items-center gap-2">
            <select
              className="select select-bordered bg-white border-gray-300 text-gray-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | "All")}
            >
              <option value="All">All Claims</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              className="flex items-center justify-center h-10 w-10 p-2 text-gray-600 rounded-sm border border-gray-300 cursor-pointer hover:bg-gray-100"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* No Claims Found */}
        {filteredClaims.length === 0 ? (
          <div className="alert alert-info bg-blue-100 text-blue-800 border-blue-300">
            <span>No claims found. Submit a new claim to get started.</span>
          </div>
        ) : (
          <div className="overflow-x-auto h-[65vh] overflow-y-auto custom-scrollbar">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th onClick={toggleDateSort} className="cursor-pointer">
                    Date{" "}
                    {dateSort === "asc" ? (
                      <ChevronUp size={16} className="inline" />
                    ) : (
                      <ChevronDown size={16} className="inline" />
                    )}
                  </th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Approved Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedClaims.map((claim) => (
                  <tr key={claim._id} className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="text-gray-700">{formatDate(claim.submissionDate)}</td>
                    <td className="text-gray-700">₹{claim.claimAmount.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadgeClass(claim.status)}>{claim.status}</span>
                    </td>
                    <td className="text-gray-700">
                      {claim.approvedAmount !== undefined ? `₹${claim.approvedAmount.toFixed(2)}` : "-"}
                    </td>
                    <td>
                      <button
                        className="btn bg-transparent text-[#2F7FF2] hover:bg-[#2F7FF2] hover:text-white border border-[#2F7FF2] shadow-none btn-sm"
                        onClick={() => openModal(claim)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedClaim && (
        <dialog open className="modal modal-open">
          <div className="modal-box bg-white text-gray-900">
            <button
              className="btn btn-md rounded absolute right-4 top-4 bg-transparent p-1 px-2 hover:bg-gray-100 text-gray-600 border-none shadow-none hover:opacity-80"
              onClick={closeModal}
            >
              <X />
            </button>
            <h3 className="text-lg font-bold">{selectedClaim.description}</h3>
            <p className="py-2">Submitted: {formatDate(selectedClaim.submissionDate)}</p>
            <div className="mt-2 p-2 bg-gray-100 rounded-md">
              <p className="text-md font-semibold">Comments:</p>
              <p className="text-md text-gray-700">
                {selectedClaim.comments ? selectedClaim.comments : "No comments"}
              </p>
            </div>
            {selectedClaim.documentUrl && (
              <a
                href={selectedClaim.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 btn hover:bg-transparent hover:text-[#2F7FF2] bg-[#2F7FF2] text-white border border-[#2F7FF2] shadow-none mt-3"
              >
                <FileText className="w-5 h-5" />
                View Document
              </a>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}

export default React.memo(MyClaims);