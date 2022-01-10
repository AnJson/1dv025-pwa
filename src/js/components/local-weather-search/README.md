# &lt;local-weather-search&gt;

A web component used enter city-search and display results in dropdown-list.

## Methods

### `showSearchResult(cities)`

A method that, when called, display a list with the city-name and county with coordinates as data-attributes.

Parameters: `cities` - An object with `city`, `county`, `longitude` and `latitude` properties.

### `clearResults()`

When called, it will clear the ul-element of its list-elements.


## Events

| Event Name | Fired When |
|------------|------------|
| `selected`| The listitem in search-results is clicked. Sending the `cityData`-object in detail. |
| `input`| The input event on the text-input is triggered. Sending the `value` in detail. |


## Example

```html
   <local-weather-search></local-weather-search>
```

