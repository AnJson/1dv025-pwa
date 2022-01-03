import { WeatherIllustration } from './WeatherIllustration.js'

/**
 * Cloud-element for canvas.
 *
 * @augments WeatherIllustration
 * @class Cloud
 */
export class Cloud extends WeatherIllustration {
  /**
   * Creates an instance of class.
   *
   * @param {HTMLElement} image - Img-element of the cloud-image.
   * @param {number} width - Width of the image.
   * @param {number} height - Height of the image.
   * @param {number} x - The position on the x-axis.
   * @param {number} y - The position on the y-axis.
   * @memberof Cloud
   */
  constructor (image, width, height, x, y) {
    super(x, y)
    this.width = width
    this.height = height
    this.image = image
  }

  /**
   * Draw/animate cloud on canvas.
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

        if (this.x >= canvas.width / 2) {
          return resolve()
        }
        requestAnimationFrame(move)
      }

      move()
    })
  }
}
