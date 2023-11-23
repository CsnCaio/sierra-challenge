
type LatLng = {
  lat: number;
  lng: number;
};

export class GeometryUtil {
  private static rad(x: number): number {
    return x * Math.PI / 180;
  }

  public static getDistance(p1: LatLng, p2: LatLng): number {
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = GeometryUtil.rad(p2.lat - p1.lat);
    const dLong = GeometryUtil.rad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(GeometryUtil.rad(p1.lat)) * Math.cos(GeometryUtil.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d; // returns the distance in meter
  }
}
