import { useState, useEffect } from "react";
import { FilePlus, FolderClosed, LogOut, User } from "lucide-react";
import NewClaim from "./Patient Components/NewClaim";
import MyClaims from "./Patient Components/MyClaims";
import type { Claim } from "./types/claim";
import { useAuth } from "../../context/AuthContext";
import LogoutModal from "../../components/LogoutModal";
import { toast } from "sonner";

const PatientDashboard = () => {
  const { email, role, logout, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("my-claims");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/claims", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch claims");
      }
      const data = await response.json();
      setClaims(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [accessToken]);

  // Handle logout
  const handleLogout = () => {
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
                <p>{role === "insurer" ? "Welcome, Insurer!" : "Hello, Patient!"}</p>
                <p className="text-sm text-gray-300">{email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-grow overflow-auto">
              <li className="mb-2">
                <a
                  className={`p-3 rounded-lg flex items-center gap-2 ${activeTab === "my-claims" ? "bg-[#2F7FF2] text-white" : ""
                    }`}
                  onClick={() => setActiveTab("my-claims")}
                >
                  <FolderClosed size={20} /> My Claims
                </a>
              </li>
              <li>
                <a
                  className={`p-3 rounded-lg flex items-center gap-2 ${activeTab === "new-claim" ? "bg-[#2F7FF2] text-white" : ""
                    }`}
                  onClick={() => setActiveTab("new-claim")}
                >
                  <FilePlus size={20} /> New Claim
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
      <main className="flex-1 min-w-0 p-1 md:p-5 h-full overflow-auto">
        {activeTab === "my-claims" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-3">
                  <span className="loading loading-spinner loading-lg text-blue-500"></span>
                  <p className="text-lg font-semibold text-gray-700">Loading claims...</p>
                </div>
              </div>) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
              ) : (
              <MyClaims claims={claims} fetchClaims={fetchClaims} />
            )}
          </div>
        )}
        {activeTab === "new-claim" && <NewClaim setActiveTab={setActiveTab} fetchClaims={fetchClaims} />}
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default PatientDashboard;