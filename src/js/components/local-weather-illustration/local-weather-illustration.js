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
      width: 300;
      height: 200px;
      background-color: green;
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
     * The sun in the canvas.
     *
     * @type {object}
     */
    #sun = {
      x: 30,
      y: 50,
      size: 30,
      shadow: 4,
      shadowSpeed: 0.3,
      dx: 4,
      dy: 3
    }

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
      this.#moveSun('in')
    }

    /**
     * Draw sun on canvas.
     *
     */
    #drawSun () {
      const ctx = this.#ctx
      const sun = this.#sun

      ctx.beginPath()
      ctx.arc(sun.x, sun.y, sun.size, 0, (Math.PI * 2))
      ctx.fillStyle = '#FFE000'
      ctx.fill()
    }

    /**
     * Move/animate the sun on the canvas.
     *
     * @param {string} direction - in or out to set direction of move.
     */
    #moveSun (direction) {
      const ctx = this.#ctx
      const sun = this.#sun
      ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
      this.#drawSun()

      if (direction === 'in' || direction === 'out') {
        if (direction === 'in') {
          if (!(sun.x > this.#canvas.width / 2)) {
            sun.x += sun.dx
          }

          ctx.shadowColor = '#FFE000'
          ctx.shadowBlur = sun.shadow += sun.shadowSpeed

          if (ctx.shadowBlur > 30 || ctx.shadowBlur < 3) {
            sun.shadowSpeed *= -1
          }
        } else if (direction === 'out') {
          sun.x -= sun.dx
        }

        requestAnimationFrame(this.#moveSun.bind(this, direction))
      }
    }
  })
