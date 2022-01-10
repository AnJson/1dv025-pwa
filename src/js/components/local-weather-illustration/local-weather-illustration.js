import cloudImgUrl from './lib/cloud.png'
import sunImgUrl from './lib/sun.png'
import rainImgUrl from './lib/rain.png'
import snowImgUrl from './lib/snow.png'
import { CanvasImage } from './lib/CanvasImage.js'
import { Sun } from './lib/Sun.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      font-size: 10px;
    }

    #canvas {
      width: 100%;
      height: 250px;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  </style>
  <canvas id="canvas" height="200px"></canvas>
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
    #elements = {}

    /**
     * An array of elements currently on display in canvas.
     *
     * @type {object[]}
     */
    #elementsOnDisplay = []

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

    /**
     * Set up elements-field to contain elements available to draw on canvas.
     *
     */
    connectedCallback () {
      const cloudImg = document.createElement('img')
      cloudImg.setAttribute('src', cloudImgUrl)
      const sunImg = document.createElement('img')
      sunImg.setAttribute('src', sunImgUrl)
      const rainImg = document.createElement('img')
      rainImg.setAttribute('src', rainImgUrl)
      const snowImg = document.createElement('img')
      snowImg.setAttribute('src', snowImgUrl)

      this.#elements = {
        sun: new Sun(sunImg, 60, 60, -60, 25, 4, 3),
        cloud: new CanvasImage(cloudImg, 100, 60, this.#canvas.width + 50, 40, 6, 4),
        rain: new CanvasImage(rainImg, 80, 60, this.#canvas.width + 50, 80, 5.68, 4),
        snow: new CanvasImage(snowImg, 80, 60, this.#canvas.width + 50, 80, 5.68, 4)
      }
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-symbol']
    }

    /**
     * React on attribute-changed.
     *
     * @param {string} name - Name of attribute.
     * @param {string} oldVal - Attribute-value before change.
     * @param {string} newVal - Attribute-value after change.
     */
    attributeChangedCallback (name, oldVal, newVal) {
      if (oldVal !== newVal) {
        if (name === 'data-symbol') {
          this.#showWeather(newVal)
        }
      }
    }

    /**
     * Clear canvas from illustrations not needed to illustrate the new symbol, then bring in the illustrations needed.
     *
     * @param {string} symbol - Weather-symbol to illustrate.
     */
    async #showWeather (symbol) {
      const newSymbolSet = []

      if (symbol === 'clear-sky') {
        newSymbolSet.push(this.#elements.sun)
      }

      if (symbol === 'halfclear-sky') {
        newSymbolSet.push(this.#elements.sun)
        newSymbolSet.push(this.#elements.cloud)
      }

      if (symbol === 'cloudy-sky') {
        newSymbolSet.push(this.#elements.cloud)
      }

      if (symbol === 'rain') {
        newSymbolSet.push(this.#elements.cloud)
        newSymbolSet.push(this.#elements.rain)
      }

      if (symbol === 'snow') {
        newSymbolSet.push(this.#elements.cloud)
        newSymbolSet.push(this.#elements.snow)
      }

      // Compare newSymbolSet with elements on display, remove and add.
      const shouldGoOut = []
      for (const element of this.#elementsOnDisplay) {
        if (!newSymbolSet.includes(element)) {
          shouldGoOut.push(element)
        }
      }

      if (shouldGoOut.length > 0) {
        await this.#sendOutElements(shouldGoOut)
        this.#elementsOnDisplay = newSymbolSet
      } else {
        this.#elementsOnDisplay = newSymbolSet
      }

      for (const element of this.#elementsOnDisplay) {
        element.moveIn(this.#canvas)
      }

      this.#paintCanvas()
    }

    /**
     * Move out elements from canvas.
     *
     * @param {object[]} elements - Array of elements to animate out of canvas.
     * @returns {Promise} - A promise to make all elements leave canvas.
     */
    async #sendOutElements (elements) {
      return Promise.all(elements.map(element => element.moveOut(this.#canvas)))
    }

    /**
     * Paint all elements in elementsOnDisplay-field on the canvas as long as there is any.
     *
     */
    #paintCanvas () {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
      this.#ctx.shadowColor = '#000'
      this.#ctx.shadowBlur = 5

      for (const element of this.#elementsOnDisplay) {
        element.drawAnimation(this.#ctx)
      }

      requestAnimationFrame(this.#paintCanvas.bind(this))
    }
  })
