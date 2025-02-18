import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onBack?: () => void;
}

const ErrorMessage = ({
  title = "No PRD Provided",
  message = "Unable to proceed without a Product Requirements Document.",
  onBack = () => window.history.back(),
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-background">
      <Alert variant="destructive" className="max-w-[600px] mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <Button variant="outline" onClick={onBack} className="mt-4">
        Go Back
      </Button>
    </div>
  );
};

export default ErrorMessage;
