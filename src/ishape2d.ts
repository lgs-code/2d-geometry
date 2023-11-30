import { Point2d } from "./point2d";
import { Vector2d } from "./vector2d";

/**
 * Defines common methods and properties exposed by a shape.
 */
export interface IShape2d {
  /**
   * Translates the shape using the given vector for direction.
   * @param vector The vector defining the direction.
   */
  translate(vector: Vector2d): void;

  /**
   * Rotates the shape by the given angle in degree, around a point.
   * @param angle The rotation angle.
   * @param origin The origin from which the rotation is supposed to be done.
   */
  rotate(angle: number, origin: Point2d): void;

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

  /**
   * Checks if the given point is in the edge of the shape.
   * @param point The reference point.
   * @param threshold A value used as a threshold / range to check if the point is on the line.
   */
  isOnEdge(point: Point2d, threshold: number): boolean;
}

/**
 * Defines common methods and properties exposed by a closed shape.
 */
export interface IClosedShape2d extends IShape2d {
  /**
   * Gets the are of the shape.
   */
  readonly area: number;

  /**
   * Gets the perimeter of the shape.
   */
  readonly perimeter: number;

  /**
   * Checks if the given point is located inside the shape.
   * @param point The reference point.
   * @returns true if the point is inside the shape.
   */
  contains(point: Point2d): boolean;
}
