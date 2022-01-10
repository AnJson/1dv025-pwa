const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 5em;
      height: 5em;
      font-size: 10px;
      cursor: pointer;
    }

    ::slotted(*) {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
  <slot>Icon</slot>
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
     * The title of the target-element to open on click.
     *
     * @type {string}
     */
    #targetTitle

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
            target: this.#targetElement,
            title: this.#targetTitle ? this.#targetTitle : 'Title'
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
      return ['data-target', 'data-title']
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

        if (name === 'data-title') {
          this.#targetTitle = newVal
        }
      }
    }
  })
