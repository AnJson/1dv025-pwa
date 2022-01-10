import * as constants from './lib/constants.js'
import { template } from './template.js'
import '../local-weather-illustration/'
import '../local-weather-search/'

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
     * The div-element showing offline-message.
     *
     * @type {HTMLElement}
     */
    #offlineMessageElement

    /**
     * Svg element to set to local geolocation.
     *
     * @type {HTMLElement}
     */
    #myPositionIcon

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
     * Wrapper div for location, no-result-message and loader.
     *
     * @type {HTMLElement}
     */
    #locationElement

    /**
     * Div element holding the city-name and time for forecast.
     *
     * @type {HTMLElement}
     */
    #locationDataElement

    /**
     * Div to hold skeleton of locationElement, to illustrate loading.
     *
     * @type {HTMLElement}
     */
    #skeletonLocationElement

    /**
     * Div to hold skeleton of weather data, to illustrate loading.
     *
     * @type {HTMLElement}
     */
    #skeletonWeatherDataElement

    /**
     * H2 element that signals no results in weather search.
     *
     * @type {HTMLElement}
     */
    #noResultElement

    /**
     * Wrapper div for weather-data.
     *
     * @type {HTMLElement}
     */
    #weatherDataElement

    /**
     * Container div for weather-data-boxes.
     *
     * @type {HTMLElement}
     */
    #weatherDataBoxes

    /**
     * Span element to display temperature.
     *
     * @type {HTMLElement}
     */
    #tempDataElement

    /**
     * Span element to display wind-speed.
     *
     * @type {HTMLElement}
     */
    #windDataElement

    /**
     * Svg-icon to display wind-direction.
     *
     * @type {HTMLElement}
     */
    #windDirectionIcon

    /**
     * Span element to display rain/h.
     *
     * @type {HTMLElement}
     */
    #rainDataElement

    /**
     * Data of the current location, defaults to Stockholm.
     *
     * @type {object}
     */
    #currentLocation = {
      city: 'Stockholm',
      county: 'Stocholm',
      longitude: 18.063,
      latitude: 59.334
    }

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#searchElement = this.shadowRoot.querySelector('#search')
      this.#offlineMessageElement = this.shadowRoot.querySelector('#offline-message')
      this.#locationDataElement = this.shadowRoot.querySelector('#location-data')
      this.#locationElement = this.shadowRoot.querySelector('#location')
      this.#myPositionIcon = this.shadowRoot.querySelector('#my-position-icon')
      this.#illustration = this.shadowRoot.querySelector('#illustration')
      this.#cityNameElement = this.shadowRoot.querySelector('#city-name')
      this.#dateElement = this.shadowRoot.querySelector('#date')
      this.#skeletonLocationElement = this.shadowRoot.querySelector('#skeleton-location-data')
      this.#skeletonWeatherDataElement = this.shadowRoot.querySelector('#skeleton-weather-data-box-wrapper')
      this.#weatherDataBoxes = this.shadowRoot.querySelector('#weather-data-box-wrapper')
      this.#tempDataElement = this.shadowRoot.querySelector('#temp')
      this.#rainDataElement = this.shadowRoot.querySelector('#rain')
      this.#windDataElement = this.shadowRoot.querySelector('#wind-strength')
      this.#windDirectionIcon = this.shadowRoot.querySelector('#wind-direction')
      this.#noResultElement = this.shadowRoot.querySelector('#no-result')
      this.#weatherDataElement = this.shadowRoot.querySelector('#weather-data')

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
        event.stopPropagation()
        this.#setCurrentLocation(event.detail.cityData)
        this.#showLocalWeather(event.detail.cityData)
      })

      this.#myPositionIcon.addEventListener('click', event => {
        event.stopPropagation()

        if (!this.hasAttribute('offline')) {
          this.#setLoadingState()
          this.#askForLocation()
        }
      })
    }

    /**
     * Ask user-client for geolocation.
     *
     */
    connectedCallback () {
      if (!this.hasAttribute('offline')) {
        this.#askForLocation()
      }
    }

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['offline']
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
        if (name === 'offline') {
          if (this.hasAttribute('offline')) {
            // Add offline-message and hide search.
            this.#searchElement.classList.add('hidden')
            this.#offlineMessageElement.classList.remove('hidden')
          } else {
            // Hide offline-message and display search.
            this.#offlineMessageElement.classList.add('hidden')
            this.#searchElement.classList.remove('hidden')
          }
        }
      }
    }

    /**
     * If geolocation is available ask for current location.
     *
     */
    #askForLocation () {
      if ('geolocation' in navigator) {
        try {
          navigator.geolocation.getCurrentPosition(position => {
            const longitude = position.coords.longitude
            const latitude = position.coords.latitude

            this.#setCurrentLocation({
              longitude,
              latitude
            })
            this.#showLocalWeather({
              longitude,
              latitude
            })
          }, () => {
            this.#showLocalWeather({
              longitude: this.#currentLocation.longitude,
              latitude: this.#currentLocation.latitude
            })
          }, {
            timeout: 5000,
            maximumAge: 1800000
          })
        } catch (error) {
          console.log(error)
          this.#showLocalWeather({
            longitude: this.#currentLocation.longitude,
            latitude: this.#currentLocation.latitude
          })
        }
      } else {
        this.#showLocalWeather({
          longitude: this.#currentLocation.longitude,
          latitude: this.#currentLocation.latitude
        })
      }
    }

    /**
     * Set the cityNameElements textcontent by current location-field.
     *
     */
    #updateLocationText () {
      this.#cityNameElement.textContent = this.#currentLocation.county ? `${this.#currentLocation.city}, ${this.#currentLocation.county}` : `${this.#currentLocation.city}`
    }

    /**
     * Update the current location-field object.
     *
     * @param {object} position - Object with city-data to set as current location.
     */
    #setCurrentLocation (position) {
      this.#currentLocation.city = position.city ? position.city : 'Your location'
      this.#currentLocation.county = position.county ? position.county : null
      this.#currentLocation.longitude = Number.parseFloat(position.longitude).toFixed(3)
      this.#currentLocation.latitude = Number.parseFloat(position.latitude).toFixed(3)
    }

    /**
     * Filter duplicate cities in search-result.
     *
     * @param {object[]} locations - Array of objects from search-result.
     * @returns {object[]} - Filtered search-result.
     */
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
     * Search weather for selected location and trigger showWeather in local-weather-search.
     *
     * @param {object} data - Search-object containing city, county, longitude, latitude.
     */
    async #showLocalWeather (data) {
      try {
        this.#setLoadingState()
        const weatherData = await this.#getWeather(Number.parseFloat(data.longitude).toFixed(3), Number.parseFloat(data.latitude).toFixed(3))
        const currentWeatherData = this.#filterWeatherData(weatherData.timeSeries)
        this.#showWeatherResult(currentWeatherData)
      } catch (error) {
        console.log(error)
        this.#setNoResultsState()
      }
    }

    /**
     * Filter and map the weather-data to contain the most recent weather data.
     *
     * @param {object[]} weatherData - Array of with weather-data from all available times.
     * @returns {object} - Object with the latest and relevent weather data.
     */
    #filterWeatherData (weatherData) {
      const now = Date.now()
      const latestForecasts = weatherData.filter(data => new Date(data.validTime.substring(0, 19)).getTime() < now)
      const mappedData = [latestForecasts.pop()].map(data => ({
        time: data.validTime.substring(0, 19),
        temp: data.parameters[11].values[0],
        windAngle: data.parameters[13].values[0],
        windSpeed: data.parameters[14].values[0],
        rain: data.parameters[3].values[0],
        symbol: data.parameters[18].values[0]
      }))

      return mappedData[0]
    }

    /**
     * Set the loading-state of the app.
     *
     */
    #setLoadingState () {
      this.#hideAllInLocationDiv()
      this.#hideAllInWeatherData()
      this.#skeletonLocationElement.classList.remove('hidden')
      this.#skeletonWeatherDataElement.classList.remove('hidden')
    }

    /**
     * Shows the weather-results.
     *
     */
    #setShowWeatherState () {
      this.#hideAllInLocationDiv()
      this.#hideAllInWeatherData()

      this.#locationDataElement.classList.remove('hidden')
      this.#weatherDataBoxes.classList.remove('hidden')
    }

    /**
     * Reveal the no-results-state of the app.
     *
     */
    #setNoResultsState () {
      this.#hideAllInLocationDiv()
      this.#noResultElement.classList.remove('hidden')
    }

    /**
     * Sets up the display of location and weatherforecast.
     *
     * @param {object} weather - Weather-forecast from smhi-api.
     */
    #showWeatherResult (weather) {
      const weatherDate = new Date(weather.time)
      const day = weatherDate.toLocaleDateString('en-EN', {
        weekday: 'long'
      })
      const dateString = `${day} ${weatherDate.getDate()}/${weatherDate.getMonth() + 1} ${weatherDate.getHours().toString().padStart(2, '0')}:${weatherDate.getMinutes().toString().padStart(2, '0')}`
      this.#updateLocationText()
      this.#dateElement.textContent = dateString
      this.#tempDataElement.textContent = `${weather.temp}°`
      this.#windDataElement.textContent = `${weather.windSpeed}m/s`
      this.#windDirectionIcon.style.transform = `rotate(${weather.windAngle}deg)`
      this.#rainDataElement.textContent = `${weather.rain} mm`
      const weatherSymbol = this.#convertToSymbol(weather.symbol)
      this.#illustration.setAttribute('data-symbol', weatherSymbol)
      this.#setShowWeatherState()
    }

    /**
     * Convert weather symbol number to string.
     *
     * @param {number} num - Number representing weather-symbol from smhi api.
     * @returns {string} - Name of weather-symbol.
     */
    #convertToSymbol (num) {
      let symbol

      if (num === 1 || num === 2) {
        symbol = 'clear-sky'
      }

      if (num === 3 || num === 4) {
        symbol = 'halfclear-sky'
      }

      if (num >= 5 && num <= 7) {
        symbol = 'cloudy-sky'
      }

      if ((num >= 8 && num <= 14) || (num >= 18 && num <= 24)) {
        symbol = 'rain'
      }

      if ((num >= 15 && num <= 17) || (num >= 25 && num <= 27)) {
        symbol = 'snow'
      }

      return symbol
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
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * Fetch cities by city-name and response is in json.
     *
     * @param {string} search - Search-string (city-name).
     * @returns {Promise} - Promise for json-data.
     */
    async #getCities (search) {
      const response = await window.fetch(`${constants.CITIES_BASE_URL}?query=${search}&format=json&apikey=${constants.CITIES_API_KEY}`)

      return response.json()
    }

    /**
     * Fetch for weather for selected longitude and latitude.
     *
     * @param {number} longitude - Longitude with three decimals.
     * @param {number} latitude - Latitude with three decimals.
     * @returns {Promise} - Promise for json-data.
     */
    async #getWeather (longitude, latitude) {
      const response = await window.fetch(`${constants.WEATHER_BASE_URL}lon/${longitude}/lat/${latitude}/data.json`)

      return response.json()
    }

    /**
     * Hide all elements in content-div.
     *
     */
    #hideAllInLocationDiv () {
      for (const element of this.#locationElement.children) {
        element.classList.add('hidden')
      }
    }

    /**
     * Hide all elements in weather-data div.
     *
     */
    #hideAllInWeatherData () {
      for (const element of this.#weatherDataElement.children) {
        element.classList.add('hidden')
      }
    }
  })
