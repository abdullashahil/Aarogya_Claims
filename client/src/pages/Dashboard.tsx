import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InsurerDashboard from "./Dashboard Components/InsurerDashboard";
import PatientDashboard from "./Dashboard Components/PatientDashboard";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, role } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!accessToken || !role) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [accessToken, role, navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-blue-500"></span>
          <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {role === "patient" ? <PatientDashboard /> : <InsurerDashboard />}
    </div>
  );
};

export default Dashboard;