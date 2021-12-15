const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      font-size: 10px;
      height: 60vh;
      max-width: 80em; 
      min-height: 60em;
    }

    #header {
      height: 3em;
      background-color: red;
    }

    #content {
      height: 100%;
      background-color: yellow;
    }
  </style>
  <div id="header"></div>
  <div id="content"></div>
`

customElements.define('app-window',
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
