import { WeatherIllustration } from './WeatherIllustration.js'

/**
 * Sun-element for canvas.
 *
 * @augments WeatherIllustration
 * @class Sun
 */
export class Sun extends WeatherIllustration {
  /**
   * Creates an instance of class.
   *
   * @param {number} shadow - The shadow of the element.
   * @param {number} shadowSpeed - The speed of changing the alpha.
   * @param {number} size - The radius of the sun.
   * @param {number} x - The position on the x-axis.
   * @param {number} y - The position on the y-axis.
   * @param {number} dx - The steps to take when moving on the x-axis.
   * @param {number} dy - The steps to take when moving on the y-axis.
   * @memberof Sun
   */
  constructor (shadow, shadowSpeed, size, x, y, dx, dy) {
    super(x, y, dx, dy)
    this.shadow = shadow
    this.shadowSpeed = shadowSpeed
    this.size = size
  }

  /**
   * Draw/animate sun on canvas.
   *
   * @param {object} ctx - The 2d context of the canvas.
   */
  drawAnimation (ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, (Math.PI * 2), false)
    ctx.fillStyle = '#FFE000'
    ctx.fill()

    ctx.shadowColor = '#FFE000'
    this.shadow += this.shadowSpeed
    ctx.shadowBlur = this.shadow

    if (this.shadow > 25 || this.shadow < 8) {
      this.shadowSpeed *= -1
    }
  }

  /**
   * Move the sun on the canvas.
   *
   * @param {HTMLElement} canvas - The canvas-element.
   * @returns {Promise} - A promise for positioning the element in the center of canvas.
   */
  moveIn (canvas) {
    return new Promise(resolve => {
      /**
       * Move the sun in on canvas.
       *
       * @returns {Promise} - A promise that is resolved.
       */
      const move = () => {
        this.step('right')

        if (this.x >= canvas.width / 2) {
          return resolve()
        }
        requestAnimationFrame(move)
      }

      move()
    })
  }
}
