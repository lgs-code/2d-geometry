import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Polygon2d } from "./polygon2d";

/**
 * Defines a quadrilateral in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Quadrilateral}
 */
export class Quadiralteral2d extends Polygon2d {
  constructor(vertices: Point2d[]);
  constructor(edges: Line2d[]);
  constructor(item: Point2d[] | Line2d[]) {
    if (item[0] instanceof Point2d) {
      /* istanbul ignore next */
      if (item.length != 4) {
        throw new Error("Expected number of vertices is 4");
      }
      super(item as Point2d[]);
    } else {
      /* istanbul ignore next */
      if (item.length != 4) {
        throw new Error("Expected number of edges is 4");
      }
      super(item as Line2d[]);
    }
  }

  /**
   * Gets the center of the quadrilateral.
   */
  override get centroid(): Point2d {
    var diag1 = new Line2d(this.vertices[0], this.vertices[2]);
    var diag2 = new Line2d(this.vertices[1], this.vertices[3]);

    return diag1.getIntersectionPoints(diag2)[0];
  }
}
