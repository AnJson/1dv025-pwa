import * as constants from './lib/constants.js'
import '../local-weather-illustration/'
import '../local-weather-search/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      font-size: 10px;
    }

    #main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40em;
      min-height: 30em;
      box-sizing: border-box;
    }

    #content {
      padding: 0 1em 1em;
      box-sizing: border-box;
    }

    #city-name {
      font-family: sans-serif;
      font-size: 3em;
      color: var(--color-text);
      margin-bottom: 0;
    }

    #date {
      font-family: sans-serif;
      font-weight: 400;
      font-size: 1.8em;
      color: var(--color-text);
      margin: 0;
    }

    local-weather-search::part(input) {
      background-color: var(--color-active-background);
      color: var(--color-text);
    }

    local-weather-search::part(input):focus {
      outline: none;
    }

    local-weather-search::part(list) {
      background-color: var(--color-inactive-background);
      color: var(--color-text);
    }
  </style>
  <div id="main">
    <local-weather-search id="search"></local-weather-search>
    <div id="content">
      <h2 id="city-name">Stockholm</h2>
      <h3 id="date">Thursday 6/1</h3>
      <local-weather-illustration id="illustration"></local-weather-illustration>
    </div>
  </div>
`

customElements.define('local-weather',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The custom local-weather-illustration element.
     *
     * @type {HTMLElement}
     */
    #illustration

    /**
     * The custom local-weather-search element.
     *
     * @type {HTMLElement}
     */
    #searchElement

    /**
     * H2 element displaying city-name.
     *
     * @type {HTMLElement}
     */
    #cityNameElement

    /**
     * H3 element displaying date.
     *
     * @type {HTMLElement}
     */
    #dateElement

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#illustration = this.shadowRoot.querySelector('#illustration')
      this.#searchElement = this.shadowRoot.querySelector('#search')
      this.#cityNameElement = this.shadowRoot.querySelector('#city-name')
      this.#dateElement = this.shadowRoot.querySelector('#date')

      this.#searchElement.addEventListener('input', event => {
        if (event.detail.value.length >= 4) {
          clearTimeout(this.citySearchDebounce)
          this.citySearchDebounce = setTimeout(() => {
            this.#showCitySearchResult(event.detail.value)
          }, 800)
        } else {
          clearTimeout(this.citySearchDebounce)
          this.#searchElement.clearResults()
        }
      })

      this.#searchElement.addEventListener('selected', event => {
        console.log(event.detail)
      })
    }

    // TODO: This is just for test.
    connectedCallback () {
      // this.#getCitySearchResult('väster')
    }

    #filterLocation (locations) {
      const hash = {}

      return locations.filter(location => {
        const county = location.county.toLowerCase()
        const city = location.city.toLowerCase()

        if (!Object.keys(hash).includes(county)) {
          hash[county] = [city]
          return true
        } else if (!hash[county].includes(city)) {
          hash[county].push(city)
          return true
        } else {
          return false
        }
      })
    }

    /**
     * Search for cities and trigger showSearchResult in local-weather-search.
     *
     * @param {string} city - Search text.
     */
    async #showCitySearchResult (city) {
      try {
        if (city.length >= 4) {
          const data = await this.#getCities(city)
          const formattedResult = this.#filterLocation(data.results).map(result => ({
            city: result.city,
            county: result.county,
            latitude: result.latitude,
            longitude: result.longitude
          }))

          this.#searchElement.showSearchResult(formattedResult)
        }
      } catch {
      }
    }

    /**
     * Search for cities and response is in json.
     *
     * @param {string} search - Search-string (city-name).
     * @returns {Promise} - Promise for json-data
     */
    async #getCities (search) {
      const response = await window.fetch(`${constants.CITIES_BASE_URL}?query=${search}&format=json&apikey=${constants.CITIES_API_KEY}`)

      return response.json()
    }
  })
