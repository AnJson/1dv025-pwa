const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: 400px;
      min-width: 400px;
    }

    .loader-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .loader-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .loader {
      position: relative;
      display: block;
      width: 4rem;
      height: 4rem;
    }
    .loader::after {
      content: " ";
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 8px solid var(--color-extra-light);
      border-color: var(--color-extra-light) transparent transparent;
      animation: pulse-ring 1s linear infinite;
    }
    .loader::before {
      content: " ";
      position: absolute;
      width: 80%;
      height: 80%;
      top: 53%;
      left: 53%;
      border-radius: 50%;
      border: 8px solid var(--color-extra-dark);
      border-color: transparent transparent var(--color-extra-dark);
      animation: pulse-ring-translate 0.6s linear infinite;
    }
    @keyframes pulse-ring-translate {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      50% {
        border-width: 1px;
        transform: translate(-50%, -50%) rotate(180deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg);
        border-width: 6px;
      }
    }
    @keyframes pulse-ring {
      0% {
        transform: rotate(0deg);
      }
      50% {
        border-width: 1px;
        transform: rotate(180deg);
      }
      100% {
        transform: rotate(360deg);
        border-width: 6px;
      }
    }
  </style>
  <div class="loader-wrapper">
    <span class="loader"></span>
  </div>
  `

customElements.define('my-loader',
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
