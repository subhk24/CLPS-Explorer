import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ErrorState';
import { Container } from './Container';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('CLPS Explorer caught an unhandled rendering anomaly:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container size="xl" className="py-12">
          <ErrorState
            title={this.props.fallbackTitle || 'Subsystem Rendering Anomaly'}
            message={
              this.props.fallbackMessage ||
              this.state.error?.message ||
              'An unexpected rendering error occurred in this exploration module. Please retry or refresh the application.'
            }
            onRetry={this.handleReset}
          />
        </Container>
      );
    }

    return this.props.children;
  }
}
