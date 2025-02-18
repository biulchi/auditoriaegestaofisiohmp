import React from "react";
import ErrorMessage from "./error-message";

interface ErrorPageProps {
  title?: string;
  message?: string;
  onBack?: () => void;
}

const ErrorPage = ({ title, message, onBack }: ErrorPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <ErrorMessage title={title} message={message} onBack={onBack} />
    </div>
  );
};

export default ErrorPage;
