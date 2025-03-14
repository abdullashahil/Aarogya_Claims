import React from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Confirm Logout</h3>
        <p className="py-4">Are you sure you want to log out?</p>
        <div className="modal-action">
          <button className="btn bg-red-500 border-none shadow-none hover:bg-red-400" onClick={onConfirm}>
            Yes, Logout
          </button>
          <button className="btn bg-transparent border-none shadow-none hover:bg-gray-700" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default LogoutModal;
