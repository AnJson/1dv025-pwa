import { Sun } from './lib/Sun.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
      font-size: 10px;
    }

    #canvas {
      width: 100%;
      height: 200px;
    }
  </style>
  <canvas id="canvas"></canvas>
`

customElements.define('local-weather-illustration',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The canvas-element.
     *
     * @type {HTMLElement}
     */
    #canvas

    /**
     * The context-object.
     *
     * @type {object}
     */
    #ctx

    /**
     * A collection of elements in the canvas.
     *
     * @type {object}
     */
    #elements = {
      sun: new Sun(10, 0.3, 30, 30, 70, 4, 3, 0, 0.1)
    }

    /**
     * An array of elements currently on display in canvas.
     *
     * @type {object[]}
     */
    #elementsOnDisplay = [this.#elements.sun]

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#canvas = this.shadowRoot.querySelector('#canvas')
      this.#ctx = this.#canvas.getContext('2d')
    }

    connectedCallback () {
      // TODO: Add test animations with timeout.
      this.#paintCanvas()
      this.moveInElement(this.#elements.sun)
    }

    // TODO: Testing the animation. Remove this.
    async moveInElement (el) {
      await el.moveIn(this.#canvas)
      console.log('done')
    }

    /**
     * Paint all elements in elementsOnDisplay-field on the canvas as long as there is any.
     *
     */
    #paintCanvas () {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

      for (const element of this.#elementsOnDisplay) {
        element.drawAnimation(this.#ctx)
      }

      if (this.#elementsOnDisplay.length) {
        requestAnimationFrame(this.#paintCanvas.bind(this))
      }
    }
  })
