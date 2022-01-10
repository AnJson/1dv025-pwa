# &lt;memory-clock&gt;

A web component used to display time in minutes:seconds:hundreds.

## Attributes

### `running`

When present starts the clock and outputs the time every hundredth of a second. If not present time is stopped and the elapsed time in ms is saved.

## Methods

### getter `duration()`

A method that, when called, will return the time from start to stop in ms.

Returns: number; time in ms.

## Example

```html
   <memory-clock running></memory-clock>
```

