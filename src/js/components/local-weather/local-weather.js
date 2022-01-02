import svgUrl from './lib/symbol-defs.svg'
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
      position: relative;
      width: 100%;
      padding: 0 1em 2em;
      box-sizing: border-box;
    }

    #location {
      width: 100%;
    }

    #position-icon-wrapper {
      position: absolute;
      top: 1em;
      right: 1em;
      color: var(--color-inactive-text);
      cursor: pointer;
    }

    #position-icon-wrapper:hover {
      color: var(--color-text);
    }

    #my-position-icon {
      width: 2em;
      height: 2em;
      fill: currentColor;
      transition: all 300ms;
    }

    #city-name {
      font-family: sans-serif;
      font-size: 2em;
      color: var(--color-text);
      margin-bottom: 0;
    }

    #date {
      font-family: sans-serif;
      font-weight: 400;
      font-size: 1.6em;
      color: var(--color-text);
      margin: 0;
    }

    #skeleton-city-name {
      position: relative;
      display: block;
      width: 40%;
      height: 2.5em;
      border-radius: 1em;
      margin-bottom: .5em;
      margin-top: 1.1em;
      overflow: hidden;
    }

    #skeleton-date {
      position: relative;
      display: block;
      width: 60%;
      height: 1.6em;
      border-radius: 1em;
      margin: 0;
      overflow: hidden;
    }
    
    .skeleton-box {
      background: 
        linear-gradient(0.25turn, transparent, #666, transparent),
        linear-gradient(#333, #333),
        radial-gradient(38px circle at 19px 19px, #333 50%, transparent 51%),
        linear-gradient(#333, #333);  
      background-repeat: no-repeat;
      background-size: 315px 250px, 315px 180px, 100px 100px, 225px 30px; 
      background-position: -315px 0, 0 0, 0px 190px, 50px 195px; 
      animation: loading 1.5s infinite;
    }
    
    #weather-data-box-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .weather-data-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 70px;
      min-width: 50px;
      padding: 0 .8em;
      border-radius: 3px;
      background-color: var(--color-active-background);
      color: var(--color-text);
    }

    .weather-data-box__heading {
      font-size: 1.1em;
      font-family: sans-serif;
      font-weight: 400;
    }

    .weather-data-box__data {
      font-size: 1.5em;
      font-family: sans-serif;
      font-weight: 600;
    }

    #wind-direction-icon {
      width: 1.1em;
      height: 1.1em;
      fill: var(--color-text);
      transform: rotate(-45deg);
    }

    #skeleton-weather-data-box-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .skeleton-weather-data-box {
      height: 70px;
      width: 65px;
      border-radius: 3px;
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
    
    #loader {
      height: 30em;
    }
    
    #no-result {
      color: var(--color-text);
      font-family: sans-serif;
    }
    
    .hidden {
      display: none !important;
    }

    @keyframes loading {  
      to {
        background-position: 315px 0, 0 0, 0 190px, 50px 195px;
      }
    }
    </style>
  <div id="main">
    <local-weather-search id="search"></local-weather-search>
    <div id="content">
      <div id="location">
        <div id="location-data" class="hidden">
          <h2 id="city-name"></h2>
          <h3 id="date"></h3>
          <div id="position-icon-wrapper">
            <svg id="my-position-icon">
              <use href="${svgUrl}#icon-location" />
            </svg>
        </div>
        </div>
        <div id="skeleton-location-data">
          <div id="skeleton-city-name" class="skeleton-box"></div>
          <div id="skeleton-date" class="skeleton-box"></div>
        </div>
        <h2 id="no-result" class="hidden">No results, try again...</h2>
      </div>
      <local-weather-illustration id="illustration"></local-weather-illustration>
      <div id="weather-data">
        <div id="weather-data-box-wrapper" class="hidden">
          <div class="weather-data-box">
            <span class="weather-data-box__heading">Temp</span>
            <span class="weather-data-box__data" id="temp">2.5C</span>
          </div>
          <div class="weather-data-box">
            <span class="weather-data-box__heading">Wind</span>
            <span class="weather-data-box__data" id="wind-strength">5 m/s</span>
            <span class="weather-data-box__data" id="wind-direction">
              <svg id="wind-direction-icon">
                <use href="${svgUrl}#icon-compass" />
              </svg>
            </span>
          </div>
          <div class="weather-data-box">
            <span class="weather-data-box__heading">Rain/h</span>
            <span class="weather-data-box__data" id="rain">1.5 mm</span>
          </div>
        </div>
        <div id="skeleton-weather-data-box-wrapper">
          <div class="skeleton-weather-data-box skeleton-box"></div>
          <div class="skeleton-weather-data-box skeleton-box"></div>
          <div class="skeleton-weather-data-box skeleton-box"></div>
        </div>
      </div>
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
        this.#setLoadingState()
        this.#askForLocation()
      })
    }

    /**
     * Ask user-client for geolocation.
     *
     */
    connectedCallback () {
      this.#askForLocation()
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
        temp: data.parameters[10].values[0],
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
      console.log(weather)
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
      // TODO: set weather-symbol as attribute on weather illustration.
      this.#setShowWeatherState()
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
