# &lt;memory-highscore&gt;

A web component used as the screen to display highscore.

## Methods

### `displayHighscore(level)`

A method that, when called, will get the highscore from localstorage for the level sent as argument and display it.

Parameters: `level` - string; Possible values:
`easy`
`medium`
`hard`

## Events

| Event Name | Fired When |
|------------|------------|
| `restart-button-clicked`| The restart-button is clicked. |

## Example

```html
   <memory-highscore></memory-highscore>
```

