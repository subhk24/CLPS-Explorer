import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LunarMap } from '../components/map/LunarMap';

describe('LunarMap Component Tests', () => {
  it('renders interactive SVG map and projection controls', () => {
    render(<LunarMap />);
    expect(screen.getByRole('heading', { name: /selenographic destination map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nearside \(0°\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /far side \(180°\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /south pole \(<-60°\)/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /interactive lunar map/i })).toBeInTheDocument();
  });

  it('displays default selected site details (Malapert A)', () => {
    render(<LunarMap />);
    expect(screen.getByRole('heading', { name: /malapert a/i })).toBeInTheDocument();
    expect(screen.getByText(/80.1221°S/i)).toBeInTheDocument();
    expect(screen.getByText(/-3,607 m/i)).toBeInTheDocument();
    expect(screen.getByText(/LROC Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Ancient anorthositic highlands/i)).toBeInTheDocument();
  });

  it('switches projections and updates visible projection header', () => {
    render(<LunarMap />);

    // Switch to Far Side
    fireEvent.click(screen.getByRole('button', { name: /far side \(180°\)/i }));
    expect(screen.getByText(/Far Side Orthographic Projection/i)).toBeInTheDocument();

    // Switch to South Pole
    fireEvent.click(screen.getByRole('button', { name: /south pole \(<-60°\)/i }));
    expect(screen.getByText(/South Polar Azimuthal Projection/i)).toBeInTheDocument();
  });

  it('selects a landing site when clicked on map pin', () => {
    const handleSelectSite = vi.fn();
    render(<LunarMap onSelectSite={handleSelectSite} />);

    // Mare Crisium pin is on Nearside
    const mareCrisiumPin = screen.getByRole('button', { name: /mare crisium landing site/i });
    fireEvent.click(mareCrisiumPin);

    expect(handleSelectSite).toHaveBeenCalledWith('mare-crisium');
    expect(screen.getByRole('heading', { name: /mare crisium/i })).toBeInTheDocument();
    expect(screen.getByText(/18.5°N/i)).toBeInTheDocument();
    expect(screen.getByText(/61.8°E/i)).toBeInTheDocument();
  });

  it('calls onSelectMission when Dossier button in site panel is clicked', () => {
    const handleSelectMission = vi.fn();
    render(<LunarMap onSelectMission={handleSelectMission} />);

    const dossierBtn = screen.getByRole('button', { name: /dossier/i });
    fireEvent.click(dossierBtn);

    expect(handleSelectMission).toHaveBeenCalledTimes(1);
    expect(handleSelectMission.mock.calls[0][0].id).toBe('to2-im');
  });

  it('toggles to accessible table view showing all 8 cataloged landing sites', () => {
    render(<LunarMap />);

    // Switch to Table View
    fireEvent.click(screen.getByRole('button', { name: /accessible table view/i }));

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/showing 8 cataloged regions/i)).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /malapert a/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /mare crisium/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /reiner gamma/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /schrödinger basin/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /gruithuisen domes/i })).toBeInTheDocument();
  });
});
