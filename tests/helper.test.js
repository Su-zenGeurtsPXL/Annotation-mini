import { mapboxLongLat } from '@/utils/helper.ts';

describe('mapboxLongLat', () => {
  test('converts a string of long lat coordinates to a 2D array', () => {
    expect(mapboxLongLat('14.233, 12.25588')).toStrictEqual([14.233, 12.25588]);
  });
});