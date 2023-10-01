import { Point2d } from "./point2d";
import { Quadiralteral2d } from "./quadrilateral2d";

/**
 * Defines a square in two-dimensional coordinates.
 * @see {@link https://en.wikipedia.org/wiki/Square}
 */
export class Square2d extends Quadiralteral2d {
  private _location: Point2d;
  width: number;

  constructor(location: Point2d, width: number) {
    const vertices = [
      location,
      new Point2d(location.x + width, location.y),
      new Point2d(location.x + width, location.y + width),
      new Point2d(location.x, location.y + width),
    ];

    super(vertices);

    this._location = location;

    this.width = width;
  }

  get location() {
    return this._location;
  }

  get height(): number {
    return this.width;
  }

  /* istanbul ignore next */
  set height(value: number) {
    this.width = value;
  }

  /**
   * Gets the area.
   */
  get area(): number {
    return this.width * this.width;
  }

  /**
   * Gets the perimeter.
   */
  get perimeter(): number {
    return this.width * 4;
  }
}
