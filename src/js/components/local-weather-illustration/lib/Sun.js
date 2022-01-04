import { CanvasImage } from './CanvasImage.js'

/**
 * Sun-element for canvas.
 *
 * @augments CanvasImage
 * @class Sun
 */
export class Sun extends CanvasImage {
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
