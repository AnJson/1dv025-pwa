import imgUrl from './lib/0.png'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      font-size: 10px;
      height: 10em;
      width: 10em;
    }

    ::slotted(*) {
      max-width: 100%;
      max-height: 100%;
    }

    #card {
      position: relative;
      height: 100%;
      width: 100%;
      perspective: 50em;
      -moz-perspective: 50em;
      box-sizing: border-box;
      cursor: pointer;
    }

    .card-side {
      position: absolute;
      top: 0;
      left: 0;
      height: 10em;
      width: 100%;
      padding: 1em;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all .6s ease;
      backface-visibility: hidden;
      border-radius: 3px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, .3);
      box-sizing: border-box;
      transform-origin: 50% 50%;
    }

    .card-side--front {
      background-color: #fff;
      transform: rotateY(180deg);
    }

    .card-side--back {
      background: #FFE000 url(${imgUrl}) no-repeat center;
      background-size: 80%;
      transform: rotateY(0)
    }

    .reveal-front {
      transform: rotateY(0);
    }

    .hide-back {
      transform: rotateY(-180deg);
    }

    .hidden {
      display: none;
    }
  </style>
  <div id="card">
    <div class="card-side card-side--front" part="card-front" id="card-front">
      <slot></slot>
    </div>
    <div class="card-side card-side--back" part="card-back" id="card-back"></div>
  </div>
`
customElements.define('memory-card',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The wrapper-div called card.
     *
     * @type {HTMLElement} - Div-element.
     */
    #card

    /**
     * The backside of the card.
     *
     * @type {HTMLElement} - Div-element.
     */
    #cardBack

    /**
     * The frontside of the card.
     *
     * @type {HTMLElement} - Div-element.
     */
    #cardFront

    /**
     * Attach shadow-dom and template, define fields and add eventlisteners.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#card = this.shadowRoot.querySelector('#card')
      this.#cardBack = this.shadowRoot.querySelector('#card-back')
      this.#cardFront = this.shadowRoot.querySelector('#card-front')

      this.addEventListener('click', () => {
        if (!this.hasAttribute('disabled')) {
          this.setAttribute('flipped', '')
        }
      })

      this.addEventListener('keyup', event => {
        if (event.key.toLowerCase() === 'enter') {
          this.setAttribute('flipped', '')
        }
      })
    }

    /**
     * Attributes to observe.
     *
     * @returns {string[]} - Name of attributes to observe.
     */
    static get observedAttributes () {
      return ['flipped', 'hidden']
    }

    /**
     * Handler for observed attributes.
     *
     * @param {string} name - Name of the modified attribute.
     * @param {*} oldVal - Value before modification.
     * @param {*} newVal - Value after modification.
     */
    attributeChangedCallback (name, oldVal, newVal) {
      if (oldVal !== newVal) {
        if (name === 'flipped') {
          this.#flipCard()

          if (this.hasAttribute('flipped')) {
            this.dispatchEvent(new CustomEvent('flipped', {
              bubbles: true
            }))
          }
        }

        if (name === 'hidden') {
          this.#card.classList.toggle('hidden')
          this.removeAttribute('tabindex')
        }
      }
    }

    /**
     * Compares content of this instance with another element and specifies if its equal.
     *
     * @param {HTMLElement} element - Element to compare with this instance.
     * @returns {boolean} - Are elements content equal.
     */
    isEqual (element) {
      return this.isEqualNode(element)
    }

    /**
     * Flip the card and dispatch 'flipped'-event.
     *
     */
     #flipCard () {
      if (this.hasAttribute('hidden') && this.hasAttribute('disabled')) {
        return
      }

      this.#cardBack.classList.toggle('hide-back')
      this.#cardFront.classList.toggle('reveal-front')
    }
  })
