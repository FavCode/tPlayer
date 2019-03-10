# tPlayer
A simple and beautiful ```Netease Music``` embed player.

## Simply enjoy it on your website
First, you need to add ```tplayer.js``` , ```tplayer.css``` and ```jQuery``` on your website.
And then just create a player by simply call ```createPlayer``` function through JavaScript.

| Parameter | Description |
| ------ | ------ |
| ```container``` | The container of player, should be a HTML element or a selector string |
| ```playlist``` | The ID of Netease Music playlist (Don't use ```number``` if you can) |
| ```autoplay```(optional) | Should music play after player created |

If everything goes right, your player should be created on your page.

## Taking control of player
If you need to control player through JavaScript, just get the returned value of ```createPlayer```.

It should returns a ```object```.If not, that means player create failed.
#### Description of propertys
| Type | Name | Description |
| ------ | ------ | ------ |
| Function | ```play(id)``` | Make player play now (id is optional, if you fill it with a number, it will jump to ```id``` and play it) |
| Function | ```pause()``` | Make player pause now |
| Function | ```next()``` | Play next music in playlist |
| Function | ```prev()``` | Play previous music in playlist |
| Number | ```volume``` | Player volume (a number between 0-1) ```get and set``` |
| Boolean | ```playing``` | Shows is player playing ```get``` |
