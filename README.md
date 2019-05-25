# tPlayer
A simple and beautiful ```Netease Music``` embed player.

## Simply enjoy it on your website
First, you need to add ```tplayer.js``` , ```tplayer.css``` and ```jQuery``` on your website.
And then just create a player by simply call ```createPlayer``` function through JavaScript.

| Parameter | Description |
| ------ | ------ |
| ```options``` | Options for player |

#### Description of ```options```
| Type | Name | Default | Description |
| ------ | ------ | ------ | ------ |
| Boolean | ```autoplay``` | ```true``` | Play music after player ready? |
| Boolean | ```random``` | ```false``` | Random choose a music after player ready? |
| ```HTMLElement```, ```jQuery``` object or a String | ```container``` | ```document.body``` | Container of player |
| Object | ```playlist``` | ***Required*** | Playlist of player |

If everything goes right, your player should be created on your page.

###### Sample
This sample will create a player with Netease Playlist ```935836938``` and a MP3 file ```http://server.noip.cn:65534/Chouchou%20-%201619kHz.mp3``` with thumbnail ```http://server.noip.cn:65534/tn.jpg```
```
createPlayer(
  {
    playlist:[
      {
        type:"netease-playlist",
        playlist:"935836938"
      },
      {
        name:"1619kHz",
        artists:"Chouchou",
        thumbnail:"http://server.noip.cn:65534/tn.jpg",
        url:"http://server.noip.cn:65534/Chouchou%20-%201619kHz.mp3"
      }
    ]
  }
);
```

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

You can visit ```rewrite``` version [here](https://tenmahw.com/tPlayer/rewrite/demo.html)
