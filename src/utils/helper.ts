// converts a string of long lat coordinates to a 2D array
export const mapboxLongLat = (longLat: string): [number, number] => {
  const coordsStr = longLat.split(',');
  const coordsNum: number[] = [];
  coordsStr.forEach((element, index) => {
    coordsNum[index] = parseFloat(element);
  });
  return [coordsNum[0], coordsNum[1]];
};
