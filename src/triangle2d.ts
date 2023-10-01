import { log } from "console";
import { Point2d } from "./point2d";
import { Line2d } from "./line2d";
import { Polygon2d } from "./polygon2d";

/**
 * Defines a triangle in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Triangle}
 */
export class Triangle2d extends Polygon2d {
  constructor(vertices: Point2d[]);
  constructor(edges: Line2d[]);
  constructor(item: Point2d[] | Line2d[]) {
    if (item[0] instanceof Point2d) {
      /* istanbul ignore next */
      if (item.length != 3) {
        throw new Error("Expected number of vertices is 3");
      }

      super(item as Point2d[]);
    } else {
      /* istanbul ignore next */
      if (item.length != 3) {
        throw new Error("Expected number of edges is 3");
      }

      /* istanbul ignore next */
      super(item as Line2d[]);
    }
  }

  /**
   * Gets the area.
   */
  get area(): number {
    const b = this.edges[0].length;
    const h = this.edges[0].getOrthogonalLineThrough(this.edges[1].p2).length;

    return Number.parseFloat(((b * h) / 2).toFixed(2));
  }

  /**
   * Gets the medians or the triangle.
   */
  get medians(): Line2d[] {
    return [
      new Line2d(this.edges[0].p1, this.edges[1].centroid),
      new Line2d(this.edges[1].p1, this.edges[2].centroid),
      new Line2d(this.edges[2].p1, this.edges[0].centroid),
    ];
  }

  /**
   * Gets the center point of the triangle.
   * The intersection of the medians is the centroid.
   */
  get centroid(): Point2d {
    const medians = this.medians;
    return medians[0].getIntersectionPoints(medians[1])[0];
  }

  /**
   * Gets the circumcenter point of the triangle.
   * The circumcenter is the center of a circle passing through the three vertices of the triangle.
   */
  get circumCenter(): Point2d {
    const length = Math.max(...this.edges.map((e) => e.length));

    const ortho1 = this.edges[0].getOrthogonalLineFrom(
      this.edges[0].centroid,
      length,
      true,
    );

    const ortho2 = this.edges[1].getOrthogonalLineFrom(
      this.edges[1].centroid,
      length,
    );

    const ortho3 = this.edges[2].getOrthogonalLineFrom(
      this.edges[2].centroid,
      length,
    );

    // NOTE: intersection between ortho2 and ortho3 should be the same point
    return ortho1.getIntersectionWithLine(ortho2);
  }

  /**
   * Gets the incircle point of the triangle.
   * The intersection of the angle bisectors is the center of the incircle.
   */
  //get incircle(): Point2d {}

  /**
   * Gets the orthocenter point of the triangle.
   * The intersection of the altitudes is the orthocenter.
   */
  get orthoCenter(): Point2d {
    var ortho1 = this.edges[1].getOrthogonalLineThrough(this.edges[0].p1);
    var ortho2 = this.edges[2].getOrthogonalLineThrough(this.edges[1].p1);
    var ortho3 = this.edges[0].getOrthogonalLineThrough(this.edges[1].p2);

    // NOTE: intersection between ortho2 and ortho3 should be the same point
    return ortho1.getIntersectionWithLine(ortho2);
  }

  /**
   * Makes the lines starting from the same point, and go in the same direction.
   * @param line1
   * @param line2
   * @returns New set of lines.
   */
  /* istanbul ignore next */
  private normalize(line1: Line2d, line2: Line2d): Line2d[] {
    const intersection = line1.getIntersectionPoints(line2)[0];

    if (intersection.equals(line1.p1)) {
      if (intersection.equals(line2.p1)) {
        return [line1, line2];
      }
      if (intersection.equals(line2.p2)) {
        return [line1, new Line2d(line2.p2, line2.p1)];
      }
    }

    if (intersection.equals(line1.p2)) {
      if (intersection.equals(line2.p1)) {
        return [new Line2d(line1.p2, line1.p1), line2];
      }
      if (intersection.equals(line2.p2)) {
        return [new Line2d(line1.p2, line1.p1), new Line2d(line2.p2, line2.p1)];
      }
    }
  }

  /**
   * Indicates if the triangle is right.
   * @returns true if this is the case.
   */
  get isRight(): boolean {
    const n1 = this.normalize(this.edges[0], this.edges[1]);
    const n2 = this.normalize(this.edges[1], this.edges[2]);
    const n3 = this.normalize(this.edges[2], this.edges[0]);

    const angles = [
      n1[0].angleTo(n1[1]),
      n2[0].angleTo(n2[1]),
      n3[0].angleTo(n3[1]),
    ];

    return angles.some((a) => a === 90);
  }

  /**
   * Indicates if the triangle is equilateral.
   * @returns true if this is the case.
   */
  get isEquilateral(): boolean {
    const lengths = this.edges.map((e) => e.length);

    return lengths[0] === lengths[1] && lengths[0] === lengths[2];
  }

  /**
   * Indicates if the triangle is isoceles.
   * @returns true if this is the case.
   */
  get isIsoceles(): boolean {
    const lengths = this.edges.map((e) => e.length);

    return (
      !this.isEquilateral &&
      (lengths[0] === lengths[1] ||
        lengths[0] === lengths[2] ||
        lengths[1] === lengths[2])
    );
  }
}
