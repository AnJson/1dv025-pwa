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
      border-radius: 3px;
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
     * The element to open on click.
     *
     * @type {HTMLElement}
     */
    // TODO: remove default value.
    #targetElement = 'memory-game'

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
  })
