/**
 * Base-class for elements in canvas in the local-weather-illustration.
 *
 * @class WeatherIllustration
 */
export class WeatherIllustration {
  /**
   * Creates an instance of WeatherIllustration.
   *
   * @param {number} [x=0] - The position on the x-axis.
   * @param {number} [y=0] - The position on the y-axis.
   * @param {number} [dx=1] - The steps to take when moving on the x-axis.
   * @param {number} [dy=1] - The steps to take when moving on the y-axis.
   * @memberof WeatherIllustration
   */
  constructor (x = 0, y = 0, dx = 1, dy = 1) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
  }

  /**
   * Move one step (dx) to given direction.
   *
   * @param {string} direction - Which direction to move.
   */
  step (direction = 'right') {
    if (direction === 'right') {
      this.x += this.dx
    }

    if (direction === 'left') {
      this.x -= this.dx
    }

    if (direction === 'up') {
      this.y -= this.dy
    }

    if (direction === 'down') {
      this.y += this.dy
    }
  }
}
