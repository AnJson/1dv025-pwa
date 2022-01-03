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
   * @param {HTMLElement} image - Img-element of the sun-image.
   * @param {number} width - Width of the image.
   * @param {number} height - Height of the image.
   * @param {number} [x=0] - The position on the x-axis.
   * @param {number} [y=0] - The position on the y-axis.
   * @param {number} [dx=1] - The steps to take when moving on the x-axis.
   * @param {number} [dy=1] - The steps to take when moving on the y-axis.
   * @memberof Sun
   */
  constructor (image, width, height, x = 0, y = 0, dx = 1, dy = 1) {
    super(x, y, dx, dy)
    this.width = width
    this.height = height
    this.image = image
  }

  /**
   * Draw/animate sun on canvas.
   *
   * @param {object} ctx - The 2d context of the canvas.
   */
  drawAnimation (ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
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

        if (this.x >= ((canvas.width / 2) - (this.width / 1.5))) {
          return resolve()
        }
        requestAnimationFrame(move)
      }

      move()
    })
  }

  /**
   * Move the sun off the canvas.
   *
   * @returns {Promise} - A promise for positioning the element outside of canvas.
   */
  moveOut () {
    return new Promise(resolve => {
      /**
       * Move the sun in on canvas.
       *
       * @returns {Promise} - A promise that is resolved.
       */
      const move = () => {
        this.step('left')

        if (this.x < (0 - (this.size * 2))) {
          return resolve()
        }
        requestAnimationFrame(move)
      }

      move()
    })
  }
}
