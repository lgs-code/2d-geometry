import { Point2d } from "./point2d";

/**
 * Defines common methods and properties exposed by a shape.
 */
export interface IShape2d {
  /**
   * Checks if the current shape intersect with the given one.
   * @param shape The reference shape.
   * @returns true it the two shapes intersect, otherwise false.
   */
  doesIntersect(shape: IShape2d): boolean;

  /**
   * Get the intersection points with the given shape.
   * @param shape The reference shape.
   * @returns An array of points if any intersection exist, otherwise an empty array.
   */
  getIntersectionPoints(shape: IShape2d): Point2d[];
}
