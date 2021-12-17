const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
    }


  </style>
  <div id="main">Memory<div>
`

customElements.define('memory-app',
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
