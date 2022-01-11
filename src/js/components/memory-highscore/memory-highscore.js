import '../memory-highscore-li/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      font-size: 10px;
      color: #000;
    }

    #heading {
      font-family: sans-serif;
      font-weight: 600;
      font-size: 6em;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #FFE000;
      margin: 0;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, .9);
    }

    #level-heading {
      font-family: sans-serif;
      font-weight: 600;
      font-size: 4em;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #FFE000;
      margin: 0;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, .9);
    }

    #highscore-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 15em;
      font-family: sans-serif;
      font-size: 1.9em;
      font-weight: 600;
      width: 50%;
    }

    #highscore-list {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1em;
      width: 100%;
      color: var(--color-text);
    }

    #restart-button {
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

    #restart-button:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
    }
  </style>
  <h2 id="heading">Highscore</h2>
  <h3 id="level-heading">level</h3>
  <div id="highscore-container">
    <ul id="highscore-list">
    </ul>
  </div>
  <button id="restart-button">Play Again!</button>
`

customElements.define('memory-highscore',
  /**
   * Custom-element class.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * The highscore-container div.
     *
     * @type {HTMLElement} - Div-element.
     */
    #highscoreList

    /**
     * The restart-button element.
     *
     * @type {HTMLElement} - Button-element.
     */
    #restartButton

    /**
     * The h3-element to show level.
     *
     * @type {HTMLElement} - H3-element.
     */
    #levelHeadingElement

    /**
     * Constructor of my custom element to be defined.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#highscoreList = this.shadowRoot.querySelector('#highscore-list')
      this.#levelHeadingElement = this.shadowRoot.querySelector('#level-heading')
      this.#restartButton = this.shadowRoot.querySelector('#restart-button')

      this.#restartButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('restart-button-clicked'))
      })
    }

    /**
     * Get highscore for the current level from localstorage and show it.
     *
     * @param {string} level - Hard, medium, easy.
     * @param {object[]} highscore - Highscore from localstorage.
     */
    displayHighscore (level, highscore) {
      if (highscore) {
        this.#clearHighscoreTable()
        this.#showHighscoreTable(highscore)
        this.#levelHeadingElement.textContent = level
      } else {
        this.#highscoreList.textContent = `No highscores for level ${level}.`
      }
    }

    /**
     * Generates a table with the highscore-items.
     *
     * @param {object[]} highscore - Highscore from localstorage.
     */
    #showHighscoreTable (highscore) {
      for (const [i, player] of highscore.entries()) {
        const time = new Date(player.time)
        const timeString = `${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}:${(time.getMilliseconds() / 10).toFixed(0).toString().padStart(2, '0')}`

        const li = document.createElement('memory-highscore-li')
        li.setAttribute('data-rank', i + 1)
        li.setAttribute('data-name', player.name)
        li.setAttribute('data-time', timeString)
        this.#highscoreList.appendChild(li)
      }
    }

    /**
     * Clear the table before inserting the highscore from localstorage.
     *
     */
    #clearHighscoreTable () {
      while (this.#highscoreList.lastChild) {
        this.#highscoreList.removeChild(this.#highscoreList.lastChild)
      }
    }
  })
