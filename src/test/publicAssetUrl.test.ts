import { describe, expect, it } from 'vitest';
import { publicAssetUrl } from '../utils/publicAssetUrl';

describe('publicAssetUrl', () => {
  it('resolves root-relative public assets under Vite BASE_URL', () => {
    expect(publicAssetUrl('/images/missions/to2-im.jpg')).toBe(
      `${import.meta.env.BASE_URL}images/missions/to2-im.jpg`
    );
  });

  it('does not modify external NASA asset URLs', () => {
    const nasaUrl = 'https://images.nasa.gov/test.jpg';
    expect(publicAssetUrl(nasaUrl)).toBe(nasaUrl);
  });
});
