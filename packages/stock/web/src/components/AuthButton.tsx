import React from "react";

interface AuthButtonProps {
  label: string;
  onClick: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        backgroundColor: "#61dafb",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
};

