const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      font-size: 10px;
      cursor: pointer;
    }

    #icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 7em;
      height: 7em;
      border-radius: 50%;
      background-color: white;
    }

    ::slotted(*) {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
  <div id="icon" part="icon"><slot>Icon</slot></div>
`

customElements.define('app-icon',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The tag-name of the element to open on click.
     *
     * @type {string}
     */
    #targetElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('icon-clicked', {
          bubbles: true,
          detail: {
            element: this.#targetElement
          }
        }))
      })
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-target']
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
        if (name === 'data-target') {
          this.#targetElement = newVal
        }
      }
    }
  })
