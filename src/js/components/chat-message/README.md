# &lt;chat-message&gt;

A web component used as a wrapper to hold chat-messages.

## Methods

### `setMeta(data)`

A method that, when called, will set the text-content of the meta-div to the username-property of parameter and also display the hours and seconds from the time-property of the parameter.

Parameters: `data` - object with `time`(number/timestamp) and `username`(string) properties.

## Example

```html
   <chat-message>Hi, my name is Anders. Who are you?</chat-message>
```
