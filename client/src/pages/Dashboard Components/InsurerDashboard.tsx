import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Claim, ClaimStatus } from "./types/claim";
import { User, LogOut, FilePen, ChevronDown, ChevronUp, ArrowLeft, RefreshCw } from "lucide-react";
import LogoutModal from "../../components/LogoutModal";
import ClaimReviewPanel from "./Insurer Components/ClaimReviewPanel";
import { toast } from "sonner";

const InsurerDashboard: React.FC = () => {
  const { email, logout, accessToken } = useAuth(); 
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "All">("All");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [amountSort, setAmountSort] = useState<"asc" | "desc" | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const fetchClaims = async (): Promise<void> => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://aarogya-claims-server.vercel.app/claims", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch claims");
      }
      const data: Claim[] = await response.json();
      setClaims(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(`Failed to fetch claims: ${error.message}`);
      } else {
        setError("An unknown error occurred");
        toast.error("Failed to fetch claims: An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch claims on component mount
  useEffect(() => {
    fetchClaims();
  }, [accessToken]); // Add accessToken as a dependency

  if (error) {
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  }

  // Filter and sort claims
  const filteredClaims: Claim[] =
    statusFilter === "All" ? [...claims] : claims.filter((claim) => claim.status === statusFilter);

  filteredClaims.sort((a: Claim, b: Claim): number => {
    const dateA = new Date(a.submissionDate).getTime();
    const dateB = new Date(b.submissionDate).getTime();
    return dateSort === "asc" ? dateA - dateB : dateB - dateA;
  });

  if (amountSort !== null) {
    filteredClaims.sort((a: Claim, b: Claim): number =>
      amountSort === "asc" ? a.claimAmount - b.claimAmount : b.claimAmount - a.claimAmount,
    );
  }

  const getStatusBadgeClass = (status: ClaimStatus): string => {
    switch (status) {
      case "Pending":
        return "badge-warning";
      case "Approved":
        return "badge-success";
      case "Rejected":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const toggleDateSort = (): void => {
    setDateSort(dateSort === "asc" ? "desc" : "asc");
    setAmountSort(null);
  };

  const toggleAmountSort = (): void => {
    setAmountSort(amountSort === null ? "desc" : amountSort === "asc" ? "desc" : "asc");
    setDateSort("desc");
  };

  // Handle claim update
  const handleUpdateClaim = async (
    id: string,
    status: ClaimStatus,
    approvedAmount?: number,
    comments?: string,
  ): Promise<void> => {
    try {
      const response = await fetch(`https://aarogya-claims-server.vercel.app/claims/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, approvedAmount, comments }),
      });

      if (!response.ok) {
        throw new Error("Failed to update claim");
      }

      // Update the claims list
      const updatedClaims: Claim[] = claims.map((claim) =>
        claim._id === id ? { ...claim, status, approvedAmount, comments } : claim,
      );
      setClaims(updatedClaims);

      toast.success("Claim updated successfully!");
      setSelectedClaim(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating claim:", error);
        toast.error(`Failed to update claim: ${error.message}`);
      } else {
        console.error("Error updating claim:", error);
        toast.error("Failed to update claim: An unknown error occurred");
      }
    }
  };

  // Handle logout
  const handleLogout = (): void => {
    logout();
    toast.success("Logged out successfully!");
    setShowLogoutModal(false);
  };

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <div className="drawer hidden md:block lg:drawer-open w-80 shrink-0 h-full">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side h-full">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-gray-800 text-base-content w-80 p-4 flex flex-col h-full overflow-auto">
            {/* User Info */}
            <div className="mb-4 text-white text-lg font-semibold flex items-center gap-3 p-3 rounded-lg bg-gray-700">
              <User size={24} />
              <div>
                <p>Welcome, Insurer!</p>
                <p className="text-sm text-gray-300">{email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-grow overflow-auto">
              <li>
                <a className="p-3 rounded-lg flex items-center gap-2 bg-[#2F7FF2]">
                  <FilePen size={20} /> Manage Claims
                </a>
              </li>
            </div>

            {/* Logout Button */}
            <div>
              <li>
                <button
                  className="p-3 rounded-lg flex items-center gap-2 text-white hover:bg-red-600 hover:text-white w-full"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOut size={20} /> Logout
                </button>
              </li>
            </div>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-1 md:p-4 bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
              <p className="text-lg font-semibold text-gray-700">Loading claims...</p>
            </div>
          </div>
        ) : (
          <div className="card bg-white shadow-md border border-gray-300 p-4">
            <div className="card-body">
              {selectedClaim ? (
                <>
                  <div className="flex items-center mb-4">
                    <button
                      onClick={() => setSelectedClaim(null)}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500 cursor-pointer"
                    >
                      <ArrowLeft size={20} /> Back to Claims
                    </button>
                  </div>
                  <ClaimReviewPanel
                    claim={selectedClaim}
                    onUpdateClaim={handleUpdateClaim}
                    onClose={() => setSelectedClaim(null)}
                  />
                </>
              ) : (
                <>
                  <h2 className="card-title text-2xl font-bold text-gray-800 mb-6">Claims Dashboard</h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <select
                      className="select select-bordered select- cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | "All")}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    
                    <button
                      className="flex items-center justify-center h-10 w-10 p-2 text-gray-600 rounded-sm border border-gray-300 cursor-pointer hover:bg-gray-100"
                      onClick={fetchClaims}
                    >
                      <RefreshCw className="h-5 w-5" /> 
                    </button>
                  </div>
                  {filteredClaims.length === 0 ? (
                    <div className="alert bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
                      <span>No claims found matching the selected filters.</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto h-[60vh] overflow-y-auto custom-scrollbar">
                      <table className="table w-full">
                        <thead>
                          <tr className="bg-gray-200 text-gray-700">
                            <th onClick={toggleDateSort} className="cursor-pointer">
                              Date{" "}
                              {dateSort === "asc" ? (
                                <ChevronUp size={16} className="inline" />
                              ) : (
                                <ChevronDown size={16} className="inline" />
                              )}
                            </th>
                            <th>Patient</th>
                            <th onClick={toggleAmountSort} className="cursor-pointer">
                              Amount{" "}
                              {amountSort === "asc" ? (
                                <ChevronUp size={16} className="inline" />
                              ) : amountSort === "desc" ? (
                                <ChevronDown size={16} className="inline" />
                              ) : null}
                            </th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClaims.map((claim) => (
                            <tr key={claim._id} className="border-b border-gray-300 hover:bg-gray-100">
                              <td className="text-gray-800">{formatDate(claim.submissionDate)}</td>
                              <td className="text-gray-800">{claim.name}</td>
                              <td className="text-gray-800">₹{claim.claimAmount.toFixed(2)}</td>
                              <td>
                                <span className={`badge ${getStatusBadgeClass(claim.status)}`}>{claim.status}</span>
                              </td>
                              <td>
                                <button
                                  className="btn bg-transparent text-[#2F7FF2] hover:bg-[#2F7FF2] hover:text-white border border-[#2F7FF2] shadow-none btn-sm"
                                  onClick={() => setSelectedClaim(claim)}
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      )}
    </div>
  );
};

export default InsurerDashboard;