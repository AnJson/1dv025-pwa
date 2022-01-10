import svgUrl from './lib/symbol-defs.svg'

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

    #offline-message {
      width: 100%;
      padding: 10px;
      background-color: var(--color-extra-light);
      color: var(--color-text);
      font-family: sans-serif;
      font-size: 1.2em;
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
    <div id="offline-message" class="hidden">Lost connection...</div>
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
export { template }
