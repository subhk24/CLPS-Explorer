import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

describe('App Redesign Full Integration Test Suite', () => {
  it('renders homepage with preserved video, removed mute button, and NASA-inspired sections below video', () => {
    render(<App />);

    // 1. Hero Video preserved with source
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/videos/nasa-hero.mp4');

    // 2. Mute button removed; Play/pause remains
    expect(screen.queryByRole('button', { name: /unmute|mute/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause background video|play background video/i })).toBeInTheDocument();

    // 3. Section 1: "Featured Deliveries" (4 portrait cards inspired by "Humans in Space")
    expect(screen.getByRole('heading', { name: /featured deliveries/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /im-1 odysseus/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /blue ghost 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prime-1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /griffin 1 & viper/i })).toBeInTheDocument();

    // 4. Section 2: Large horizontal feature card
    expect(screen.getByRole('heading', { name: /im-1 odysseus: historic touchdown at malapert a/i })).toBeInTheDocument();

    // 5. Section 3: Asymmetric Observatory Gallery
    expect(screen.getByRole('heading', { name: /lunar science & exploration catalogs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nasa scientific payloads gallery/i })).toBeInTheDocument();

    // 6. Section 4: Full-width photographic banner
    expect(screen.getByRole('heading', { name: /explore the universe from the lunar surface/i })).toBeInTheDocument();

    // 7. Section 5: 8-card portrait grid ("Explore the Campaign")
    expect(screen.getByRole('heading', { name: /explore the campaign/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadre rover swarm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lusee-night/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trident ice drill/i })).toBeInTheDocument();

    // 8. Section 6: Interactive 3D Selenography & Program Metrics
    expect(screen.getByRole('heading', { name: /explore clps touchdown sites in 3d space/i })).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument(); // Deliveries awarded metric
  });

  it('navigates to dedicated Mission Detail Page when a featured mission card is clicked', () => {
    render(<App />);

    // Click IM-1 Odysseus card from featured row
    const im1Card = screen.getAllByRole('button', { name: /im-1 odysseus/i })[0];
    fireEvent.click(im1Card);

    // Dedicated Mission Detail Page rendered
    expect(screen.getByRole('heading', { name: /im-1 \(odysseus\)/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/scientific objectives & program mandate/i)).toBeInTheDocument();
    expect(screen.getByText(/manifested nasa science payloads/i)).toBeInTheDocument();

    // Breadcrumb navigation back to Missions or Home
    const backBtn = screen.getByRole('button', { name: /back to missions/i });
    fireEvent.click(backBtn);

    // Navigated to Missions Explorer
    expect(screen.getByRole('heading', { name: /clps delivery missions explorer/i })).toBeInTheDocument();
  });

  it('navigates across all tabs and dedicated detail pages seamlessly', () => {
    render(<App />);

    // Navigate to Payloads
    const payloadsNav = screen.getByRole('button', { name: 'Payloads' });
    fireEvent.click(payloadsNav);
    expect(screen.getByRole('heading', { name: /scientific payloads & technology directory/i })).toBeInTheDocument();

    // Click a payload card (e.g. LRA or NSS) to open dedicated detail page
    const lraCard = screen.getAllByRole('button', { name: /laser retroreflector array/i })[0];
    fireEvent.click(lraCard);

    // Dedicated Payload Detail Page rendered
    expect(screen.getByText(/primary scientific investigation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to payloads/i })).toBeInTheDocument();

    // Navigate to Providers
    const providersNav = screen.getByRole('button', { name: 'Providers' });
    fireEvent.click(providersNav);
    expect(screen.getByRole('heading', { name: /commercial vendor directory & lander matrix/i })).toBeInTheDocument();

    // Click a provider dossier button to open dedicated provider detail page
    const dossierButtons = screen.getAllByRole('button', { name: /dossier/i });
    fireEvent.click(dossierButtons[0]);
    expect(screen.getByText(/lander architecture & propulsion matrix/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to providers/i })).toBeInTheDocument();
  });
});
