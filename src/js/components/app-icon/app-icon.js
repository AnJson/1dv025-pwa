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
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('icon-clicked', {
          bubbles: true
        }))
      })
    }
  })
