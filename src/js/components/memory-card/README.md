# &lt;memory-card&gt;

A web component used to anmimate the weather-symbol using the Canvas API.

## Attributes

### `flipped`

When present flips the card to reveal the front-side, and if not present and the front-side is revealed the card is turned back again.

### `hidden`

Hides the card.

## Methods

### `isEqual(element)`

A method that, when called, will compare the instance of this element with the element provided as parameter.

Parameters: `element` - HTMLElement.

Returns: boolean.

## Events

| Event Name | Fired When |
|------------|------------|
| `flipped`| The component gets the attribute `flipped`. |

## Styling with CSS

The cards front-side (div element) is styleable using the part `card-front`
The cards back-side (div element) is styleable using the part `card-back`


## Example

```html
   <memory-card data-title="Memory" offline></memory-card>
```

