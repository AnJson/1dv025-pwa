# &lt;memory-game-board&gt;

A web component used as the board to display memory-cards on.

## Attributes

### `data-level`

Sets the number of cards on board. Possible values:
`easy`
`medium`
`hard`

## Methods

### `startGame()`

A method that, when called, will add cards to the board and randomize the images on the cards.

## Events

| Event Name | Fired When |
|------------|------------|
| `round-complete`| Two cards have been flipped. |
| `all-cards-matched`| All the cards have been matched an no cards are left. |
| `back-button-clicked`| The back-button is clicked. |

## Example

```html
   <memory-game-board data-level="easy"></memory-game-board>
```

