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
      height: 60em;
      border-radius: 3px;
    }

    #chat-container {
      display: flex;
      flex-direction: column;
      position: relative;
      width: 100%;
      height: 100%;
    }

    #chat-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 10px;
      background-color: var(--color-extra-light);
      z-index: 10;
      color: var(--color-text);
      font-family: sans-serif;
      font-size: 1.2em;
      box-sizing: border-box;
    }

    #chat {
      height: 100%;
      padding: 1em;
      box-sizing: border-box;
      overflow: auto;
    }

    #chat::-webkit-scrollbar {
      width: 0.6em;
    }

    #chat::-webkit-scrollbar-track {
      background-color: var(--color-active-background);
    }

    #chat::-webkit-scrollbar-thumb {
      width: 0.6rem;
      border-radius: 3px;
      background-color: var(--color-highlight);
    }

    .row {
      display: flex;
      padding: .7em 0;
      box-sizing: border-box;
    }

    .row > * {
      max-width: 50%;
    }

    .row__left {
      justify-content: flex-start;
    }

    .row__right {
      justify-content: flex-end;
    }

    #controls {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background-color: var(--color-active-background);
      padding: 1em;
      box-sizing: border-box;
    }

    #nickname-wrapper {
      display: flex;
      align-items: center;
      gap: 1em;
      margin-bottom: .5em;
    }

    #nickname-text {
      margin: 0;
      font-family: sans-serif;
      color: var(--color-text);
      font-size: 1.2em;
    }

    #edit-nickname-icon {
      width: 1.2em;
      height: 1.2em;
      fill: var(--color-inactive-text);
      transition: all 200ms;
      cursor: pointer;
    }

    #edit-nickname-icon:hover {
      fill: var(--color-text);
    }

    #message-form {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0;
      width: 100%;
    }

    #textarea-wrapper {
      position: relative;
    }

    #textarea {
      resize: none;
      font-family: sans-serif;
      font-size: 1.3em;
      color: var(--color-text);
      background-color: var(--color-inactive-background);
      border: none;
      padding: .5em;
      border-radius: 3px;
      -ms-overflow-style: none;
      scrollbar-width: none; 
    }

    #textarea::-webkit-scrollbar {
      display: none;
    }

    #textarea:focus {
      outline: none;
    }

    #emoji-picker {
      position: absolute;
      bottom: 8em;
      left: 0;
      width: 35em;
      height: 35em;
      z-index: 200;
    }

    #emoji-icon {
      position: absolute;
      bottom: 0;
      right: -1.6em;
      width: 1.5em;
      height: 1.5em;
      fill: var(--color-inactive-text);
      transition: all 200ms;
      cursor: pointer;
    }

    #emoji-icon:hover {
      fill: var(--color-text);
    }

    #send-button {
      border: none;
      border-radius: 3px;
      background-color: #FFE000;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);
      padding: .7em 1.5em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms;
    }

    #send-button:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
    }

    #send-button:disabled {
      background-color: #eddb54;
      cursor: default;
    }

    #send-button:disabled:hover {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .2);
    }

    #send-button:focus {
      outline: none;
    }

    .hidden {
      display: none !important;
    }
  </style>
  <div id="main">
    <div id="chat-container" class="hidden">
      <div id="chat-banner" class="hidden"></div>
      <div id="chat"></div>
      <div id="controls">
        <div id="nickname-wrapper">
          <p id="nickname-text"></p>
          <svg id="edit-nickname-icon">
            <use href="${svgUrl}#icon-pencil" />
          </svg>
        </div>
        <form id="message-form">
          <div id="textarea-wrapper">
            <svg id="emoji-icon">
              <use href="${svgUrl}#icon-emoji" />
            </svg>
            <emoji-picker id="emoji-picker" class="dark hidden"></emoji-picker>
            <textarea id="textarea" placeholder="Write your message..." rows="3" cols="31" disabled></textarea>
          </div>
          <button id="send-button" disabled>Send</button>
        </form>
      </div>
    </div>
    <chat-nickname id="nickname"></chat-nickname>
  </div>
`

export { template }
