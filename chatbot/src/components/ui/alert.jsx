// src/components/ui/alert.jsx

import React from "react";

export const Alert = ({ children, className = "" }) => {
  return (
    <div className={`p-4 border rounded-md ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <p>{children}</p>;
};
