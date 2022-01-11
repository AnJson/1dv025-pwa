# &lt;memory-highscore&gt;

A web component used as the screen to display highscore.

## Methods

### `displayHighscore(level, highscore)`

A method that, when called, will generate generate a list of the higshscore provided as parameter and display it.

Parameters: `level` - String; Possible values:
`easy`
`medium`
`hard`

Parameters: `highscore` - Object; object containing `username`, `rank` and `time` to generate list from. (In this application provided from local-storage.)

## Events

| Event Name | Fired When |
|------------|------------|
| `restart-button-clicked`| The restart-button is clicked. |

## Example

```html
   <memory-highscore></memory-highscore>
```

