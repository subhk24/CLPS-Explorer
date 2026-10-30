import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { latLonToVector3, LunarGlobe3D } from '../components/map/LunarGlobe3D';
import { IMAGERY_REGISTRY, getImageForEntity, ImageRecord } from '../data/imagery';
import { ScientificImageCard } from '../components/common/ScientificImageCard';
import { MissionRelationshipGraph } from '../components/visualization/MissionRelationshipGraph';

describe('Coordinate Transformation & Selenographic Geometry', () => {
  it('scales vector magnitude exactly to sphere radius', () => {
    const radius = 2.4;
    const testPoints = [
      { lat: 0, lon: 0 },
      { lat: 45, lon: 45 },
      { lat: -80.4, lon: 0.4 }, // Malapert A
      { lat: 38.3, lon: -35.0 }, // Mons Gruithuisen Gamma
      { lat: -21.4, lon: 88.5 }, // Mare Crisium
    ];

    testPoints.forEach(({ lat, lon }) => {
      const v = latLonToVector3(lat, lon, radius);
      const magnitude = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      expect(magnitude).toBeCloseTo(radius, 4);
    });
  });

  it('correctly maps the lunar North and South poles', () => {
    const radius = 2.4;
    const northPole = latLonToVector3(90, 0, radius);
    expect(northPole.y).toBeCloseTo(radius, 4);
    expect(northPole.x).toBeCloseTo(0, 4);
    expect(northPole.z).toBeCloseTo(0, 4);

    const southPole = latLonToVector3(-90, 0, radius);
    expect(southPole.y).toBeCloseTo(-radius, 4);
    expect(southPole.x).toBeCloseTo(0, 4);
    expect(southPole.z).toBeCloseTo(0, 4);
  });

  it('correctly maps the Prime Meridian equator (0° lat, 0° lon)', () => {
    const radius = 2.4;
    const equatorPrime = latLonToVector3(0, 0, radius);
    expect(equatorPrime.y).toBeCloseTo(0, 4);
    expect(equatorPrime.x).toBeCloseTo(radius, 4);
    expect(equatorPrime.z).toBeCloseTo(0, 4);
  });
});

describe('Scientific Imagery Registry & Data Integrity', () => {
  it('contains verified metadata for major CLPS missions and payloads', () => {
    expect(IMAGERY_REGISTRY['to2-im']).toBeDefined();
    expect(IMAGERY_REGISTRY['to19d']).toBeDefined();
    expect(IMAGERY_REGISTRY['ndl']).toBeDefined();
    expect(IMAGERY_REGISTRY['malapert-a']).toBeDefined();
  });

  it('guarantees all registry items have valid imageUrl, caption, credit, and imageType', () => {
    const validTypes = ['photograph', 'artists_concept', 'rendering', 'scientific_visualization'];

    Object.entries(IMAGERY_REGISTRY).forEach(([key, record]) => {
      expect(record.imageUrl.length, `Registry item ${key} missing imageUrl`).toBeGreaterThan(5);
      expect(record.caption.length, `Registry item ${key} missing caption`).toBeGreaterThan(5);
      expect(record.credit.length, `Registry item ${key} missing credit`).toBeGreaterThan(3);
      expect(validTypes).toContain(record.imageType);
    });
  });

  it('falls back cleanly to default category images when unknown entity ID is requested', () => {
    const fallbackLander = getImageForEntity('unknown-lander-123', 'Experimental Lander');
    expect(fallbackLander.title).toBe('Experimental Lander');
    expect(fallbackLander.fallbackSvgType).toBe('payload');
    expect(fallbackLander.imageType).toBe('scientific_visualization');
    expect(fallbackLander.credit).toBe('NASA Science Mission Directorate');
  });
});

describe('ScientificImageCard Component', () => {
  const sampleImage: ImageRecord = {
    id: 'test-nova-c',
    title: 'Intuitive Machines Nova-C',
    caption: 'Nova-C surface deployment verification at lunar south pole',
    credit: 'NASA / Intuitive Machines',
    imageType: 'photograph',
    sourceUrl: 'https://science.nasa.gov/mission/im-1/',
    imageUrl: 'https://images.nasa.gov/test.jpg',
    fallbackSvgType: 'lander',
  };

  it('renders image, credit, caption, and image type badge', () => {
    render(<ScientificImageCard image={sampleImage} />);

    expect(screen.getByAltText('Intuitive Machines Nova-C')).toBeInTheDocument();
    expect(screen.getByText('NASA Photograph')).toBeInTheDocument();
    expect(screen.getByText('NASA / Intuitive Machines')).toBeInTheDocument();
    expect(screen.getByText('Nova-C surface deployment verification at lunar south pole')).toBeInTheDocument();
  });

  it('falls back to vector schematic when image load fails', () => {
    render(<ScientificImageCard image={sampleImage} />);

    const img = screen.getByAltText('Intuitive Machines Nova-C');
    fireEvent.error(img);

    // After error event, the image is replaced by SVG with aria-label
    expect(screen.getByRole('img', { name: 'Intuitive Machines Nova-C' })).toBeInTheDocument();
  });
});

describe('MissionRelationshipGraph Component', () => {
  it('renders all 7 stages of the CLPS mission architecture', () => {
    render(<MissionRelationshipGraph />);

    expect(screen.getByText(/01 \/\/ Objective/i)).toBeInTheDocument();
    expect(screen.getByText(/02 \/\/ Mission/i)).toBeInTheDocument();
    expect(screen.getByText(/03 \/\/ Provider/i)).toBeInTheDocument();
    expect(screen.getByText(/04 \/\/ Lander/i)).toBeInTheDocument();
    expect(screen.getByText(/05 \/\/ Payload/i)).toBeInTheDocument();
    expect(screen.getByText(/06 \/\/ Site/i)).toBeInTheDocument();
    expect(screen.getByText(/07 \/\/ Outcome/i)).toBeInTheDocument();
  });

  it('renders preset pathway selectors and allows switching pathways', () => {
    render(<MissionRelationshipGraph />);

    const to19dBtn = screen.getByRole('button', { name: /TO19D \(Blue Ghost 1\)/i });
    expect(to19dBtn).toBeInTheDocument();

    fireEvent.click(to19dBtn);
    // After selecting TO-19D, Blue Ghost 1 and Mare Crisium should be active
    const blueGhostMatches = screen.getAllByText(/Blue Ghost 1/i);
    expect(blueGhostMatches.length).toBeGreaterThanOrEqual(1);
    const mareCrisiumMatches = screen.getAllByText(/Mare Crisium/i);
    expect(mareCrisiumMatches.length).toBeGreaterThanOrEqual(1);
  });

  it('opens detailed inspection modal when clicking an entity card', () => {
    render(<MissionRelationshipGraph />);

    // Click on the mission entity card
    const missionCard = screen.getByRole('button', { name: /02 \/\/ Mission/i });
    fireEvent.click(missionCard);

    // Modal dialog opens
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Scientific Role & Function/i)).toBeInTheDocument();

    // Close button dismisses modal
    const closeBtn = screen.getByLabelText(/Close entity detail panel/i);
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('LunarGlobe3D Component', () => {
  it('renders 3D Lunar Selenography container and HUD elements', () => {
    render(<LunarGlobe3D />);

    expect(screen.getByLabelText(/Interactive 3D Moon Globe showing CLPS Landing Sites/i)).toBeInTheDocument();
    expect(screen.getByText(/LUNAR 3D SELENOGRAPHY/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Surface Sites/i)).toBeInTheDocument();
  });

  it('provides accessible rotation play/pause and reset controls', () => {
    render(<LunarGlobe3D />);

    const rotateBtn = screen.getByRole('button', { name: /Pause rotation/i });
    expect(rotateBtn).toBeInTheDocument();

    // Toggle rotation
    fireEvent.click(rotateBtn);
    expect(screen.getByRole('button', { name: /Resume slow rotation/i })).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset 3D camera to default view/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    const zoomInBtn = screen.getByRole('button', { name: /Zoom in/i });
    const zoomOutBtn = screen.getByRole('button', { name: /Zoom out/i });
    expect(zoomInBtn).toBeInTheDocument();
    expect(zoomOutBtn).toBeInTheDocument();
  });
});
