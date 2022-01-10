# &lt;local-weather&gt;

A web component used as main-component for the local-weather application. Handeling events and making http-request and processing the data from api:s etc. The component is using the Geolocation API.

## Attributes

### `offline`

A boolean attribute; that if present triggers the hiding of search-bar, the signaling of lost-connection banner and disabeling of geolocation-icon.


## Example

```html
   <local-weather offline></local-weather>
```
