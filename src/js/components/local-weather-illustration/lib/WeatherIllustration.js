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
   * @param {number} [alpha=1] - The alpha(opacity) of the element.
   * @param {number} [alphaSpeed=1] - The speed of changing the alpha.
   * @memberof WeatherIllustration
   */
  constructor (x = 0, y = 0, dx = 1, dy = 1, alpha = 1, alphaSpeed = 1) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.alpha = alpha
    this.alphaSpeed = alphaSpeed
  }
}
