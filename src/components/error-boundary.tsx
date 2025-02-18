import { Component, ErrorInfo, ReactNode } from "react";
import ErrorPage from "./error-page";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="Algo deu errado"
          message={this.state.error?.message || "Erro inesperado"}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
