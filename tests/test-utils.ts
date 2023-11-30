import { Point2d } from "../build/index";

export function pointsDoMatch(points: Point2d[], source: number[][]): boolean {
  return (
    points.length > 0 &&
    points.every((p, i) => {
      return p.x === source[i][0] && p.y === source[i][1];
    })
  );
}
