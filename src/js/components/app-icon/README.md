# &lt;app-icon&gt;

A web component used as a wrapper for an icon, providing click-listener.

## Attributes

### `data-target`

A string attribute; is used in icon-clicked event-detail. 

### `data-title`

A string attribute; is used in icon-clicked event-detail.


## Events

| Event Name | Fired When |
|------------|------------|
| `icon-clicked`| The icon is clicked, sending `target` and `title` in details.

## Example

```html
   <app-icon data-target="memory-game" data-title="Memory">
     <img src="/my-icon.png">
   </app-icon>
```
