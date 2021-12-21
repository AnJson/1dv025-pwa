import '../memory-game-board/'
import '../memory-start/'
import '../memory-highscore/'
import '../memory-clock/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      font-size: 10px;
    }

    #header {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      padding: 1em 1em 0;
      box-sizing: border-box;
    }

    #count {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: sans-serif;
      font-weight: 600;
      color: #FFE000;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, .9);
      font-size: 2.5em;
    }

    #main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 60em;
      height: 70em;
    }

    .hidden {
      display: none !important;
    }
  </style>
  <div id="header">
    <div id="count" class="hidden">Turns:<span id="round-count">0</span>
    </div>
    <memory-clock id="memory-clock" class="hidden"></memory-clock>
  </div>
  <div id="main">
    <memory-start id="memory-start"></memory-start>
    <memory-game-board id="game-board" class="hidden" data-level="hard"></memory-game-board>
    <memory-highscore id="highscore" class="hidden"></memory-highscore>
  </div>
`

customElements.define('memory-game',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The header div-element.
     *
     * @type {HTMLElement}
     */
    #headerElement

    /**
     * The main div-element.
     *
     * @type {HTMLElement}
     */
    #mainElement

    /**
     * The custom memory-game-board element.
     *
     * @type {HTMLElement}
     */
    #gameBoardElement

    /**
     * The custom memory-start element.
     *
     * @type {HTMLElement}
     */
    #memoryStartElement

    /**
     * The custom memory-highscore element.
     *
     * @type {HTMLElement}
     */
    #highscoreElement

    /**
     * The custom memory-clock element.
     *
     * @type {HTMLElement}
     */
    #memoryClockElement

    /**
     * The container for the round-count in header.
     *
     * @type {HTMLElement}
     */
    #countElement

    /**
     * The span-element to display the round-count.
     *
     * @type {HTMLElement}
     */
    #roundCountElement

    /**
     * The nickname entered in this session.
     *
     * @type {string}
     */
    #nickname

    /**
     * The level selected in this session.
     *
     * @type {string}
     */
    #level

    /**
     * Attach shadow-dom and template.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#headerElement = this.shadowRoot.querySelector('#header')
      this.#mainElement = this.shadowRoot.querySelector('#main')
      this.#memoryStartElement = this.shadowRoot.querySelector('#memory-start')
      this.#memoryClockElement = this.shadowRoot.querySelector('#memory-clock')
      this.#gameBoardElement = this.shadowRoot.querySelector('#game-board')
      this.#highscoreElement = this.shadowRoot.querySelector('#highscore')
      this.#countElement = this.shadowRoot.querySelector('#count')
      this.#roundCountElement = this.shadowRoot.querySelector('#round-count')

      this.#memoryStartElement.addEventListener('level-selected', event => {
        this.#level = event.detail.level
        this.#gameBoardElement.setAttribute('data-level', event.detail.level)
      })

      this.#memoryStartElement.addEventListener('start-game', event => {
        this.#nickname = event.detail.nickname
        this.#startGameHandler()
      })

      this.shadowRoot.addEventListener('reset-game', () => {
        this.#resetGameHandler()
      })

      this.#gameBoardElement.addEventListener('game-over', () => {
        this.#gameOverHandler()
      })

      this.#gameBoardElement.addEventListener('round-complete', () => {
        const currentRoundCount = Number.parseInt(this.#roundCountElement.textContent)
        this.#roundCountElement.textContent = currentRoundCount + 1
      })
    }

    /**
     * Show game-board and start game-clock.
     *
     */
    #startGameHandler () {
      this.#hideAllSectionsInContainer(this.#mainElement)
      this.#memoryClockElement.classList.remove('hidden')
      this.#memoryClockElement.setAttribute('running', '')
      this.#countElement.classList.remove('hidden')
      this.#gameBoardElement.classList.remove('hidden')
      this.#gameBoardElement.startGame()
    }

    /**
     * Show start-screen and stop clock.
     *
     */
    #resetGameHandler () {
      this.#memoryClockElement.removeAttribute('running')
      this.#hideAllSectionsInContainer(this.#mainElement)
      this.#hideAllSectionsInContainer(this.#headerElement)
      this.#roundCountElement.textContent = 0
      this.#memoryStartElement.classList.remove('hidden')
    }

    /**
     * Show highscore-section and stop the clock.
     *
     */
    #gameOverHandler () {
      this.#memoryClockElement.removeAttribute('running')
      this.#hideAllSectionsInContainer(this.#mainElement)
      this.#hideAllSectionsInContainer(this.#headerElement)
      this.#updateHighscore()
      this.#highscoreElement.displayHighscore(this.#level)
      this.#highscoreElement.classList.remove('hidden')
    }

    /**
     * If entered top five update highscore.
     *
     */
    #updateHighscore () {
      const highscore = JSON.parse(window.localStorage.getItem(`mymemory-highscore-${this.#level}`))
      const myScore = {
        name: this.#nickname,
        time: this.#memoryClockElement.duration
      }

      if (highscore && highscore.length === 5) {
        if (highscore.some(player => player.time > this.#memoryClockElement.duration)) {
          highscore.push(myScore)
          const updatedHighscore = highscore.sort((a, b) => a.time - b.time)
            .filter((player, index) => index < 5)

          window.localStorage.setItem(`mymemory-highscore-${this.#level}`, JSON.stringify(updatedHighscore))
        }
      } else if (highscore && highscore.length < 5) {
        highscore.push(myScore)
        highscore.sort((a, b) => a.time - b.time)

        window.localStorage.setItem(`mymemory-highscore-${this.#level}`, JSON.stringify(highscore))
      } else {
        window.localStorage.setItem(`mymemory-highscore-${this.#level}`, JSON.stringify([myScore]))
      }
    }

    /**
     * Hide all elements in the container element.
     *
     * @param {HTMLElement} container - The element to hide all child-elements in.
     */
     #hideAllSectionsInContainer (container) {
      for (const el of container.children) {
        el.classList.add('hidden')
      }
    }
  })
