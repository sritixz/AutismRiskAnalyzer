import { Component } from "react";
import Button from "./Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Hook point for sending this to an error-tracking service later
    // (Sentry, etc.) — for now just logged so it's not silently lost.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-xl font-semibold text-calm-800">
            Something went wrong on our end
          </h2>
          <p className="max-w-md text-calm-600">
            This isn't anything you did. Reloading the page usually fixes
            it — if it keeps happening, please reach out so we can look
            into it.
          </p>
          <Button onClick={this.handleReload}>Reload page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
