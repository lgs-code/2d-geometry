import { Point2d } from "./point2d";
import { Quadiralteral2d } from "./quadrilateral2d";

/**
 * Defines a rectangle in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Rectangle}
 */
export class Rect2d extends Quadiralteral2d {
  private _location: Point2d;
  width: number;
  height: number;

  constructor(location: Point2d, width: number, height: number) {
    const vertices = [
      location,
      new Point2d(location.x + width, location.y),
      new Point2d(location.x + width, location.y + height),
      new Point2d(location.x, location.y + height),
    ];

    super(vertices);

    this._location = location;

    this.width = width;
    this.height = height;
  }

  get location() {
    return this._location;
  }

  /**
   * Gets the area.
   */
  get area(): number {
    return this.width * this.height;
  }

  /**
   * Gets the perimeter.
   */
  get perimeter(): number {
    return this.width * 2 + this.height * 2;
  }
}
