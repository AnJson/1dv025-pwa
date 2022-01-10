# &lt;memory-start&gt;

A web component used as the start-screen of the memory-app, holding the nickname-form and level-select buttons.

## Attributes

### `data-nickname`

String attribute; that sets the value of the text-input for entering nickname.

## Events

| Event Name | Fired When |
|------------|------------|
| `level-selected`| One of the level-buttons is clicked. |
| `nickname-button-clicked`| The nickname-form is submitted. |

## Example

```html
   <memory-start data-nickname="Andy"></memory-start>
```

