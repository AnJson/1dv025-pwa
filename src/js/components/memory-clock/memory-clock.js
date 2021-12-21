const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      flex-direction: block;
    }

    #clock-container {
      font-family: sans-serif;
      font-weight: bold;
      color: #FFE000;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, .9);
      font-size: 5em;
    }

    #clock {
      display: flex;
    }

    #clock span {
      display: block;
      width: 1.1em;
    }
  </style>
  <div id="clock-container">
    <div id="clock"><span id="minutes"></span>:<span id="seconds"></span>:<span id="hundredths"></span></div>
  </div>
`

customElements.define('memory-clock',
  /**
   * Custom-element class.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * The minutes span.
     *
     * @type {HTMLElement} - Span-element.
     */
    #minutesSpan

    /**
     * The seconds span.
     *
     * @type {HTMLElement} - Span-element.
     */
    #secondsSpan

    /**
     * The hundredths span.
     *
     * @type {HTMLElement} - Span-element.
     */
    #hundredthsSpan

    /**
     * The reference to the interval for displaying time-countdown.
     *
     */
    #interval

    /**
     * The timestamp when clock started.
     *
     * @type {number} - Timestamp.
     */
    #startTime

    /**
     * The time passed between start and stop.
     *
     * @type {number} - Timestamp.
     */
    #duration

    /**
     * Constructor of my custom element to be defined.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#minutesSpan = this.shadowRoot.querySelector('#minutes')
      this.#secondsSpan = this.shadowRoot.querySelector('#seconds')
      this.#hundredthsSpan = this.shadowRoot.querySelector('#hundredths')
    }

    /**
     * Clear the interval when unmounted.
     *
     */
    disconnectedCallback () {
      clearInterval(this.#interval)
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['running']
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
        if (name === 'running') {
          if (this.hasAttribute('running')) {
            this.#startClock()
          } else {
            this.#stopClock()
          }
        }
      }
    }

    /**
     * Start the countdown to display in element.
     *
     */
    #startClock () {
      this.#resetClock()
      this.#startTime = Date.now()

      this.#interval = setInterval(() => {
        this.#outputTime()
      }, 10)
    }

    /**
     * Output the time.
     *
     */
    #outputTime () {
      const time = new Date(Date.now() - this.#startTime)
      this.#minutesSpan.textContent = `${time.getMinutes().toString().padStart(2, '0')}`
      this.#secondsSpan.textContent = `${time.getSeconds().toString().padStart(2, '0')}`
      this.#hundredthsSpan.textContent = `${(time.getMilliseconds() / 10).toFixed(0).toString().padStart(2, '0')}`
    }

    /**
     * Stop the clock and set the gameTime-field.
     *
     */
    #stopClock () {
      if (this.#startTime) {
        clearInterval(this.#interval)
        this.#duration = Date.now() - this.#startTime
      }
    }

    /**
     * Reset the clock and output the zero-time.
     *
     */
    #resetClock () {
      this.#minutesSpan.textContent = ''
      this.#secondsSpan.textContent = ''
      this.#hundredthsSpan.textContent = ''
      this.#duration = null
    }

    /**
     * Get the time passed between start and stop.
     *
     * @readonly
     * @returns {number} - The duration-field.
     */
    get duration () {
      if (this.#duration) {
        return this.#duration
      }
    }
  })
