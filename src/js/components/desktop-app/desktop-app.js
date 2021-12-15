import '../app-window/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: block;
      height: 100vh;
      font-size: 10px;
    }

    #desktop {
      position: relative;
      background-color: green;
      height: 100%;
    }

    #icon-bar {
      background-color: blue;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 8em;
      z-index: 100;
    }

    app-window:focus {
      outline: none;
      z-index: 10;
    }
  </style>
  <div id="desktop">
    <app-window tabindex="1"></app-window>
    <app-window tabindex="2"></app-window>
  </div>
  <div id="icon-bar"></div>
`

customElements.define('desktop-app',
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

      this.addEventListener('app-window-focused', event => {
        event.stopPropagation()
        event.target.focus()
      })
    }
  })
