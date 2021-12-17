const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    #error-banner {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      padding: 1em 2em;
      background-color: var(--color-extra-light);
      box-sizing: border-box;
      z-index: 1000;
    }

  </style>
  <div id="error-banner">Memory<div>
`

customElements.define('error-banner',
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
    }
  })
