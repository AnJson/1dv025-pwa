const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .error-banner {
      display: flex;
      justify-content: center;
      padding: .5em 2em;
      background-color: var(--color-extra-light);
      box-sizing: border-box;
      z-index: 1000;
      color: var(--color-text);
      transition: all 300ms;
    }

    #error-banner span {
      font-family: sans-serif;
      font-size: 1.4em;
    }

    .hidden {
      opacity: 0;
    }

  </style>
  <div id="error-banner" class="error-banner hidden"><span id="message">Error-message</span><div>
`

customElements.define('error-banner',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The span-element to show error-message in.
     *
     * @type {HTMLElement}
     */
    #messageElement

    /**
     * The div-element acting as banner.
     *
     * @type {HTMLElement}
     */
    #errorBannerElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#messageElement = this.shadowRoot.querySelector('#message')
      this.#errorBannerElement = this.shadowRoot.querySelector('#error-banner')
    }

    /**
     * Reveal banner using css-class.
     *
     */
    connectedCallback () {
      setTimeout(() => {
        this.#errorBannerElement.classList.remove('hidden')
      }, 100)
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-message']
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
        if (name === 'data-message') {
          this.#messageElement.textContent = newVal
        }
      }
    }
  })
