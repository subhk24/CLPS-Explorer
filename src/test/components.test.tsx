import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

describe('CLPS Explorer UI Primitives & Accessibility Tests', () => {
  describe('Button Component', () => {
    it('renders button with children text', () => {
      render(<Button>Launch Mission</Button>);
      const btn = screen.getByRole('button', { name: /launch mission/i });
      expect(btn).toBeInTheDocument();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole('button', { name: /click me/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('respects disabled state', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const btn = screen.getByRole('button', { name: /disabled/i });
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Badge Component', () => {
    it('renders text with appropriate styling', () => {
      render(<Badge variant="accent">TO2-IM</Badge>);
      expect(screen.getByText('TO2-IM')).toBeInTheDocument();
    });
  });

  describe('StatusBadge Component (Color + Icon + Text Rule)', () => {
    it('renders status text and hidden screen-reader announcement', () => {
      render(<StatusBadge status="landed_anomaly" />);
      expect(screen.getByText(/landed \(partial tilt\)/i)).toBeInTheDocument();
      expect(screen.getByText('Mission Status:')).toHaveClass('sr-only');
    });

    it('renders different statuses with respective labels', () => {
      const { rerender } = render(<StatusBadge status="delivered" />);
      expect(screen.getByText(/delivered \/ surface active/i)).toBeInTheDocument();

      rerender(<StatusBadge status="planned" />);
      expect(screen.getByText(/planned \(target window\)/i)).toBeInTheDocument();

      rerender(<StatusBadge status="transit_loss" />);
      expect(screen.getByText(/transit loss/i)).toBeInTheDocument();
    });
  });

  describe('Modal Component', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog, title, and content when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Odysseus Mission Dossier">
          <p>Payload details here</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /odysseus mission dossier/i })).toBeInTheDocument();
      expect(screen.getByText(/payload details here/i)).toBeInTheDocument();
    });

    it('calls onClose when close button or backdrop is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      // Close button click
      const closeBtn = screen.getByRole('button', { name: /close dialog/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);

      // Backdrop click
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(2);
    });

    it('calls onClose when Escape key is pressed', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('EmptyState Component', () => {
    it('renders empty state message and triggers reset', () => {
      const handleReset = vi.fn();
      render(
        <EmptyState
          title="No missions found"
          description="Try clearing your filters"
          onReset={handleReset}
        />
      );

      expect(screen.getByText('No missions found')).toBeInTheDocument();
      expect(screen.getByText('Try clearing your filters')).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorState Component', () => {
    it('renders alert message with retry action', () => {
      const handleRetry = vi.fn();
      render(
        <ErrorState
          title="Telemetry Error"
          message="Failed to parse coordinates"
          onRetry={handleRetry}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Telemetry Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to parse coordinates')).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /retry operation/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
