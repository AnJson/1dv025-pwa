import '../memory-card'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60em;
      font-size: 10px;
    }

    memory-card:focus {
      outline: none;
      animation: wobble 1.4s infinite ease-out;
    }

    memory-card.correct {
      animation: correct .6s ease;
    }

    #back-button {
      border: none;
      background-color: #FFE000;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);
      padding: 1em 2em;
      margin-top: 2em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms;
    }

    #back-button:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
    }

    #gameboard {
      display: grid;
      grid-gap: 2em;
      padding: 2em 2em;
      justify-items: center;
      min-width: 40em;
      max-width: 80em;
    }

    #gameboard span {
      font-family: sans-serif;
      font-size: 2em;
    }

    .four-by-two {
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .four-by-four {
      grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .two-by-two {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr 1fr;
    }

    .hidden {
      display: none !important;
    }

    @keyframes wobble {
      33% {
        transform: rotate(5deg);
      }
      66% {
        transform: rotate(-5deg);
      }
      100% {
        transform: rotate(0);
      }
    }

    @keyframes correct {
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  </style>
  <div id="gameboard"><span>Select level to play...</span></div>
  <button id="back-button">back</button>
`
customElements.define('memory-game-board',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The number of cards on the board for the current round.
     *
     * @type {number}
     */
    #cardsOnBoard = 16

    /**
     * Url-string for each of the 8 images.
     *
     * @type {string[]}
     */
    #imageUrls = []

    /**
     * The div holding the cards.
     *
     * @type {HTMLElement} - Div-element.
     */
    #gameboardElement

    /**
     * The button-element to go back to start.
     *
     * @type {HTMLElement} - Button-element.
     */
    #backButtonElement

    /**
     * Array of cards facing up.
     *
     * @type {HTMLElement[]} - Array of memory-card elements.
     */
    #flippedCards = []

    /**
     * Number of cards matched and hidden.
     *
     * @type {number} - Number of matched cards.
     */
    #matchedCards = 0

    /**
     * Attach shadow-dom and template.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#gameboardElement = this.shadowRoot.querySelector('#gameboard')
      this.#backButtonElement = this.shadowRoot.querySelector('#back-button')

      for (let i = 1; i <= 8; i++) {
        this.#imageUrls.push(new URL(`../../../images/${i}.png`, import.meta.url))
      }

      this.shadowRoot.addEventListener('flipped', event => {
        event.stopPropagation()
        event.target.blur()
        this.#onFlipHandler(event.target)
      })

      this.#backButtonElement.addEventListener('click', event => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('back-button-clicked'))
      })
    }

    /**
     * Place the card and images on the board for the selected level.
     *
     */
    startGame () {
      this.#gameboardElement = this.#clearCardgrid()
      this.#gameboardElement = this.#addCardsToGrid()
      this.#gameboardElement = this.#setGridClass()
      this.#gameboardElement = this.#placeRandomizeImages()
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-level']
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
        if (name === 'data-level') {
          switch (newVal) {
            case 'easy':
              this.#cardsOnBoard = 4
              break
            case 'medium':
              this.#cardsOnBoard = 8
              break
            default:
              this.#cardsOnBoard = 16
          }
        }
      }
    }

    /**
     * Add cards to the board.
     *
     * @returns {HTMLElement} - The current instance.
     */
    #addCardsToGrid () {
      for (let i = 0; i < this.#cardsOnBoard; i++) {
        const card = document.createElement('memory-card')
        card.setAttribute('tabindex', 0)
        const img = document.createElement('img')
        img.classList.add('memory-image')
        card.appendChild(img)

        this.#gameboardElement.appendChild(card)
      }

      return this.#gameboardElement
    }

    /**
     * Set the css-class for the #gameboard to display the cards correctly.
     *
     * @returns {HTMLElement} - The current instance.
     */
    #setGridClass () {
      if (this.#cardsOnBoard === 4) {
        this.#gameboardElement.className = 'two-by-two'
      } else if (this.#cardsOnBoard === 8) {
        this.#gameboardElement.className = 'four-by-two'
      } else if (this.#cardsOnBoard === 16) {
        this.#gameboardElement.className = 'four-by-four'
      }

      return this.#gameboardElement
    }

    /**
     * Place the images-urls for the round randomly in the grid.
     *
     * @returns {HTMLElement} - The current instance of the gameboard.
     */
    #placeRandomizeImages () {
      const amountOfUniqueImages = this.#cardsOnBoard / 2
      const shuffledImages = this.#getShuffleArray(this.#imageUrls)

      const urlsArray = []
      urlsArray.push(...Array.from(shuffledImages).slice(-amountOfUniqueImages), ...Array.from(shuffledImages).slice(-amountOfUniqueImages))

      const shuffledUrlsArray = this.#getShuffleArray(urlsArray)

      this.shadowRoot.querySelectorAll('.memory-image').forEach((img, index) => {
        img.setAttribute('src', shuffledUrlsArray[index])
      })

      return this.#gameboardElement
    }

    /**
     * Shuffles an array by fisher-yates pattern.
     *
     * @param {Array} array - Array to copy and sort.
     * @returns {Array} - A shuffled copy of the param.
     */
    #getShuffleArray (array) {
      const shuffledArray = Array.from(array)

      for (let i = shuffledArray.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * i + 1)
        const temp = shuffledArray[i]
        shuffledArray[i] = shuffledArray[randomIndex]
        shuffledArray[randomIndex] = temp
      }

      return shuffledArray
    }

    /**
     * Add flipped card to memory and when two cards are stored compare them and drop them.
     *
     * @param {HTMLElement} cardElement - The memory-card that was flipped.
     */
    #onFlipHandler (cardElement) {
      this.#flippedCards.push(cardElement)

      if (this.#flippedCards.length === 2) {
        this.#disableAllCards()
        this.#compareCards(this.#flippedCards[0], this.#flippedCards[1])
        this.#flippedCards.length = 0

        setTimeout(() => {
          this.#enableAllCards()
        }, 900)

        this.dispatchEvent(new CustomEvent('round-complete'))
      }
    }

    /**
     * Compare the two cards and if a match, signal correct match and hide them.
     * Else turn them back.
     *
     * @param {HTMLElement} cardOne - Memory-card elements to compare.
     * @param {HTMLElement} cardTwo - Memory-card elements to compare.
     */
    #compareCards (cardOne, cardTwo) {
      if (cardOne.isEqual(cardTwo)) {
        setTimeout(() => {
          cardOne.classList.add('correct')
          cardTwo.classList.add('correct')
        }, 400)

        setTimeout(() => {
          cardOne.toggleAttribute('hidden')
          cardTwo.toggleAttribute('hidden')
        }, 900)

        this.#matchedCards += 2

        if (this.#matchedCards === this.#cardsOnBoard) {
          this.dispatchEvent(new CustomEvent('all-cards-matched'))
          this.#matchedCards = 0
        }
      } else {
        setTimeout(() => {
          this.#hideCards(cardOne, cardTwo)
        }, 1000)
      }
    }

    /**
     * Hide selected memory-cards.
     *
     * @param  {...HTMLElement} cards - An amount of memory-card elements to hide.
     */
    #hideCards (...cards) {
      for (const card of cards) {
        card.removeAttribute('flipped')
      }
    }

    /**
     * Disable all cards by adding attribute disabled.
     *
     */
    #disableAllCards () {
      for (const card of this.#gameboardElement.children) {
        card.setAttribute('disabled', '')
      }
    }

    /**
     * Enable all cards by removing attribute disabled.
     *
     */
    #enableAllCards () {
      for (const card of this.#gameboardElement.children) {
        card.removeAttribute('disabled')
      }
    }

    /**
     * Clears the content of the gameboard.
     *
     * @returns {HTMLElement} - The current instance.
     */
    #clearCardgrid () {
      while (this.#gameboardElement.lastChild) {
        this.#gameboardElement.removeChild(this.#gameboardElement.lastChild)
      }

      return this.#gameboardElement
    }
  })
