import * as constants from './lib/constants.js'
import '../local-weather-illustration/'

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
      justify-content: center;
      width: 40em;
      height: 50em;
    }
  </style>
  <div id="main">
    <local-weather-illustration id="illustration"></local-weather-illustration>
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
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#illustration = this.shadowRoot.querySelector('#illustration')
    }

    // TODO: This is just for test.
    connectedCallback () {
      // this.#getCitySearchResult('väster')
    }

    // TODO: Data fetch ok, handle this later.
    async #getCitySearchResult (city) {
      try {
        const data = await this.#getCities(city)
        console.log(data)
        /* const cityResults = data.results
          .map(result => ({
            city: result.city,
            county: result.county,
            latitude: result.latitude,
            longitude: result.longitude
          })) */
      } catch (error) {
        console.log('Something went wrong.')
        console.log(error)
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
