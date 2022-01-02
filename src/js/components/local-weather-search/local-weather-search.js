const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      font-size: 10px;
    }

    #input {
      width: 100%;
      padding: 1em 1em;
      box-sizing: border-box;
      border: none;
    }

    #list-container {
      position: relative;
    }

    #cities {
      position: absolute;
      left: 0;
      top: 0;
      list-style-type: none;
      padding: 0;
      margin: 0;
      width: 100%;
      font-size: 1.3em;
      font-family: sans-serif;
      z-index: 100;
    }

    #cities > li {
      width: 100%;
      padding: 10px 10px;
      box-sizing: border-box;
      cursor: pointer;
    }

    #cities > li:hover {
      background-color: var(--color-active-background);
    }
  </style>
  <input id="input" type="text" list="cities" placeholder="Search location" part="input" />
  <div id="list-container">
    <ul id="cities" part="list"></ul>
  </div>
`

customElements.define('local-weather-search',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * Text-input.
     *
     * @type {HTMLElement}
     */
    #inputField

    /**
     * Datalist-element for autocomplete search.
     *
     * @type {HTMLElement}
     */
    #cityList

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#inputField = this.shadowRoot.querySelector('#input')
      this.#cityList = this.shadowRoot.querySelector('#cities')

      this.#inputField.addEventListener('input', event => {
        event.stopPropagation()

        if (event instanceof InputEvent) {
          if (this.#inputField.value.trim() !== '') {
            this.#inputHandler()
          }
        } else {
          this.#inputField.blur()
          this.#inputField.focus()
        }
      })

      this.#cityList.addEventListener('click', event => {
        if (event.target.matches('li')) {
          const data = {
            city: event.target.getAttribute('data-city'),
            county: event.target.getAttribute('data-county'),
            longitude: event.target.getAttribute('data-long'),
            latitude: event.target.getAttribute('data-lat')
          }
          this.#citySelectedHandler(data)
        }
        this.clearResults()
      })
    }

    /**
     * Dispatch input-event and send value of input-field in detail.
     *
     */
    #inputHandler () {
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: this.#inputField.value
        }
      }))
    }

    /**
     * Dispatch selected-event and send data of selected city in detail.
     *
     * @param {object} cityData - Data to send in event.
     */
    #citySelectedHandler (cityData) {
      this.dispatchEvent(new CustomEvent('selected', {
        detail: {
          cityData
        }
      }))
    }

    /**
     * Populate the city-list with search-results as autocomplete.
     *
     * @param {object[]} cities - Result passed from fetch.
     */
    showSearchResult (cities) {
      this.clearResults()

      cities.forEach(result => {
        const li = document.createElement('li')
        li.textContent = `${result.city}, ${result.county}`
        li.setAttribute('data-city', result.city)
        li.setAttribute('data-county', result.county)
        li.setAttribute('data-long', result.longitude)
        li.setAttribute('data-lat', result.latitude)

        this.#cityList.appendChild(li)
      })
    }

    /**
     * Clear the list from list-elements.
     *
     */
    clearResults () {
      while (this.#cityList.lastChild) {
        this.#cityList.removeChild(this.#cityList.lastChild)
      }
    }
  })
