# &lt;app-window&gt;

A web component used to simulate a window for desktop-application.

## Attributes

### `data-title`

A string attribute; used to display the title in header.

### `offline`

A boolean attribute; signaling `(offline)` in header.

## Methods

### `positionWindow(x, y)`

A method that, when called, will position the component with absolute-positioning from left and top.

Parameters: `x` - The amount of pixels from the left. `y` - The amount of pixels from the top.

### `dragStart(x, y)`

When called, it will set the initial x and y position.

Parameters: `x` - The amount of pixels from the left. `y` - The amount of pixels from the top, where to calculate the offset from.

### `dragEnd(x, y)`

When called, it will check if the whole component is visible and if not it will push it in, and set the position of the component to the current position.

Parameters: `x` - The amount of pixels from the left. `y` - The amount of pixels from the top.

### `drag(x, y)`

When called, it will set the new absolute position of the component.

Parameters: `x` - The amount of pixels from the left. `y` - The amount of pixels from the top.

## Events

| Event Name | Fired When |
|------------|------------|
| `close-window`| The close-icon is clicked. |
| `app-window-focused`| The component is clicked. |
| `app-window-header-mousedown`| The mousedown-event is triggered on the header. |


## Example

```html
   <app-window data-title="Memory" offline></app-window>
```
