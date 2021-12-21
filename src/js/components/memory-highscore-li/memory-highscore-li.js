const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    #list-row {
      display: flex;
      justify-content: space-between;
    }
  </style>
  <li id="list-row">
    <span id="rank"></span>
    <span id="name"></span>
    <span id="time"></span>
  </li>
`

customElements.define('memory-highscore-li',
  /**
   * Custom-element class.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * The span-element for rank.
     *
     * @type {HTMLElement} - Span-element.
     */
    #rankSpan

    /**
     * The span-element for name.
     *
     * @type {HTMLElement} - Span-element.
     */
    #nameSpan

    /**
     * The span-element for time.
     *
     * @type {HTMLElement} - Span-element.
     */
    #timeSpan

    /**
     * Constructor of my custom element to be defined.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#rankSpan = this.shadowRoot.querySelector('#rank')
      this.#nameSpan = this.shadowRoot.querySelector('#name')
      this.#timeSpan = this.shadowRoot.querySelector('#time')
    }

    /**
     * Attributes to observe.
     *
     * @returns {string[]} - Array of attribute-names to observe.
     */
    static get observedAttributes () {
      return ['data-name', 'data-time', 'data-rank']
    }

    /**
     * Callback-function triggered when observed attribute has been manipulated.
     *
     * @param {string} name - Name of the attribute.
     * @param {string} oldVal - Value before change.
     * @param {string} newVal - Value after change.
     */
    attributeChangedCallback (name, oldVal, newVal) {
      if (oldVal !== newVal) {
        if (name === 'data-name') {
          this.#nameSpan.textContent = newVal
        }

        if (name === 'data-rank') {
          this.#rankSpan.textContent = newVal
        }

        if (name === 'data-time') {
          this.#timeSpan.textContent = newVal
        }
      }
    }
  })
