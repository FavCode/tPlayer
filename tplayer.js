!function() {
    Math.randNfloor = (min,max) => {
        return Math.random()*(max-min+1)+min;
    }
    Math.rand = (min,max) => {
        return Math.floor(Math.randNfloor(min,max));
    }
    function print(text) {
        console.log("%ctPlayer%c" + text,"border-top-left-radius:5px;border-bottom-left-radius:5px;padding:0 5px;font-size:24px;font-family:'Microsoft YaHei Light','Microsoft YaHei';background-color:darkred;color:white;","border-top-right-radius:5px;border-bottom-right-radius:5px;padding:5px;padding-top:10px;padding-bottom:2px;font-size:14px;font-family:'Microsoft YaHei Light','Microsoft YaHei';background-color:pink;color:darkred;margin:5px;margin-left:0;");
    }
    function getOffsetLeft(obj) {
        var tmp = obj.offsetLeft;
        var val = obj.offsetParent;
        while (val != null) {
            tmp += val.offsetLeft;
            val = val.offsetParent;
        }
        return tmp;
    }
    function playlistInited(player,options) {
        if (player.playlist.length == 0) {
            print("播放列表为空，播放器已移除");
            player.remove();
            return;
        }
        print("播放列表初始化完毕");
        player.playing = options.random ? Math.rand(0,player.playlist.length-1) : 0;
        player.setAuthor(player.playlist[player.playing].artists);
        player.setSongname(player.playlist[player.playing].name);
        player.setThumbnail(player.playlist[player.playing].thumbnail);
        player.getAudio().src = player.playlist[player.playing].url;
        if (options.autoplay) {
            player.api.play();
        }
        player.find(".player-body").css("height","67px");
        player.find(".player-body>.controls").css("display","block");
        player.find(".player-body>.controls").css("opacity","1");
        player.find(".player-body>.song-thumbnail").css("display","inline-block");
        player.find(".player-body>.song-thumbnail").css("width","64px");
        player.find(".player-body>.song-thumbnail").css("height","64px");
        player.find(".player-body>.progress-bar,.player-body>.progress-bar>*").on("mousedown",function(e) {
            if (isNaN(player.getAudio().duration)) {
                return;
            }
            player.progressChanging = true;
            player.progressBar = player.find(".player-body>.progress-bar,.player-body>.progress-bar")[0];
            $(player.progressBar).children(".played").css("animation","none");
            player.oldState = player.api.playing;
            player.api.pause();
            player.getAudio().currentTime = player.getAudio().duration * (e.offsetX / player.progressBar.clientWidth);
        });
        $(window).on("mousemove",(e) => {
            if (isNaN(player.getAudio().duration)) {
                player.progressChanging = false;
                player.progressBar = undefined;
                return;
            }
            if (player.progressChanging) {
                player.getAudio().currentTime = player.getAudio().duration * ((e.clientX - getOffsetLeft(player.progressBar)) / player.progressBar.clientWidth);
            }
        });
        $(window).on("mouseup",() => {
            if (player.oldState) {
                player.api.play();
            }
            $(player.progressBar).children(".played").css("animation","");
            player.progressChanging = false;
            player.progressBar = undefined;
        });
        if (player.playlist.length > 1) {
            player.find(".player-body>.list-toggle").css("opacity","1");
            player.find(".player-body>.list-toggle").on("click",() => {
                if (player.children(".song-list").hasClass("hide")) {
                    player.children(".song-list").removeClass("hide");
                } else {
                    player.children(".song-list").addClass("hide");
                }
            });
            for (let i = 0;i<player.playlist.length;i++) {
                let song = player.playlist[i];
                player.children(".song-list").append("<div class='song' data-id='" + i + "'><img src='" + song.thumbnail + "' class='thumbnail'/><h4 class='name'>" + song.name + "</h4><span class='author'>" + song.artists + "</span></div>");
            }
            player.find(".song-list>.song").on("click",function() {
                player.api.play(parseInt($(this).data("id")));
            });
        }
    }
    window.createPlayer = (options) => {
        if (typeof(options) != "object"||options.playlist == undefined||options.playlist.length == 0) {
            return false;
        }
        if (options.playlist == undefined) {
            options.playlist = [];
        }
        if (options.container == undefined) {
            options.container = $(document.body);
        } else {
            options.container = $(options.container);
            if (options.container.length == 0) {
                return false;
            }
        }
        if (options.random == undefined) {
            options.random = false;
        }
        if (options.autoplay == undefined) {
            options.autoplay = true;
        }
        let player = $("<div class='tenma-player'><div class='player-body'><img class='song-thumbnail'/><div class='song-info'><h4 class='song-name'></h4><small class='song-author'></small></div><div class='controls'><span class='prev'></span><span class='play-pause play'></span><span class='next'></span></div><div class='list-toggle'></div><div class='progress-bar'><div class='played'></div></div><audio></audio></div><div class='song-list hide'></div></div>");
        options.container.append(player);
        player.find(".player-body>.controls").css("display","none");
        player.find(".player-body>.controls").css("opacity","0");
        player.find(".player-body>.song-thumbnail").css("display","none");
        player.find(".player-body>.song-thumbnail").css("width","0");
        player.find(".player-body>.song-thumbnail").css("height","0");
        player.find(".player-body>.list-toggle").css("opacity","0");
        player.setSongname = function(name) {
            this.find(".song-name").text(name);
        }
        player.getSongname = function() {
            return this.find(".song-name").text();
        }
        player.setAuthor = function(author) {
            this.find(".song-author").text(author);
        }
        player.getAuthor = function() {
            this.find(".song-author").text();
        }
        player.setThumbnail = function(src) {
            this.find(".song-thumbnail")[0].src = src;
        }
        player.getThumbnail = function() {
            return this.find(".song-thumbnail")[0].src;
        }
        player.getJqAudio = function() {
            return this.find("audio");
        }
        player.getAudio = function() {
            return this.find("audio")[0];
        }
        player.find(".player-body>.controls>.prev").on("click",() => {
            player.api.prev();
        });
        player.find(".player-body>.controls>.next").on("click",() => {
            player.api.next();
        });
        player.find(".player-body>.controls>.play-pause").on("click",function() {
            if ($(this).hasClass("play")) {
                player.find(".player-body>.controls>.play-pause").removeClass("play");
                player.find(".player-body>.controls>.play-pause").addClass("pause");
                player.api.play();
            } else {
                player.find(".player-body>.controls>.play-pause").removeClass("pause");
                player.find(".player-body>.controls>.play-pause").addClass("play");
                player.api.pause();
            }
        });
        player.getJqAudio().on("load",function() {
            if (isNaN(this.duration)) {return;}
            player.errorcount = 0;
        });
        player.getJqAudio().on("play",() => {
            player.addClass("playing");
            player.find(".player-body>.controls>.play-pause").removeClass("play");
            player.find(".player-body>.controls>.play-pause").addClass("pause");
        });
        player.getJqAudio().on("pause",() => {
            player.removeClass("playing");
            player.find(".player-body>.controls>.play-pause").removeClass("pause");
            player.find(".player-body>.controls>.play-pause").addClass("play");
        });
        player.getJqAudio().on("ended",() => {
            if (player.playing == player.playlist.length-1) {
                player.playing = 0;
            } else {
                player.playing++;
            }
            player.api.play(player.playing);
        });
        player.getJqAudio().on("error",() => {
            player.removeClass("playing");
            if (player.errorcount < 5) {
                print(player.playlist[player.playing].name + " 播放失败，已跳过");
                player.api.next();
                player.errorcount++;
            } else {
                print(player.playlist[player.playing].name + " 播放失败，连续失败次数已达" + player.errorcount + "次，暂停播放");
                player.api.pause();
                player.errorcount = 0;
            }
        });
        player.getJqAudio().on("timeupdate",function() {
            player.find(".player-body>.progress-bar>.played").css("width",(this.currentTime / this.duration) * 100 + "%");
        });
        player.api = {
            play:(id) => {
                if (id != undefined && typeof(id) == "number" && id >= 0 && id < player.playlist.length) {
                    player.playing = id;
                    player.setAuthor(player.playlist[player.playing].artists);
                    player.setSongname(player.playlist[player.playing].name);
                    player.setThumbnail(player.playlist[player.playing].thumbnail);
                    player.getAudio().src = player.playlist[player.playing].url;
                    player.find(".player-body>.song-thumbnail").css("animation","none");
                    setTimeout(() => {
                        player.find(".player-body>.song-thumbnail").css("animation","");
                    });
                }
                player.getAudio().play();
            },
            pause:() => {
                player.getAudio().pause();
            },
            next:function() {
                this.play(player.playing+1);
            },
            prev:function() {
                this.play(player.playing-1);
            },
            get duration() {
                return player.getAudio().duration;  
            },
            set currentTime(value) {
                player.getAudio().currentTime = value;
            },
            get currentTime() {
                return player.getAudio().currentTime;
            },
            set volume(value) {
                player.getAudio().volume = value;
            },
            get volume() {
                return player.getAudio().volume;
            },
            get playing() {
                return !player.getAudio().paused;
            }
        };
        player.errorcount = 0;
        player.setSongname("播放器加载中...");
        player.playlist = [];
        let loadedItems = 0;
        for (let i = 0;i<options.playlist.length;i++) {
            let item = options.playlist[i];
            if (item.type == "netease-playlist") {
                print("导入网易云音乐歌单 " + item.playlist + "...");
                $.ajax({
                    url:"https://tenmahw.com/tPlayer/tplayer.php?id=" + item.playlist,
                    success:(data) => {
                        if (!data.result||!data.result.tracks) {
                            return;
                        }
                        for (let song of data.result.tracks) {
                            if (location.protocol == "https:") {
                                song.album.picUrl = song.album.picUrl.replace("http:",location.protocol);
                            }
                            let author = "";
                            for (let i = 0; i < song.artists.length; i++) {
                                if (i != 0) {
                                    author += ", " + song.artists[i].name;
                                } else {
                                    author += song.artists[i].name;
                                }
                            }
                            player.playlist.push({
                                name:song.name,
                                artists:author,
                                thumbnail:song.album.picUrl,
                                url:(location.protocol == "file:" ? "http:" : "") + "//music.163.com/song/media/outer/url?id=" + song.id + ".mp3"
                            });
                        }
                    },
                    complete:() => {
                        loadedItems++;
                        if (loadedItems == options.playlist.length) {
                            playlistInited(player,options);
                        }
                    },
                    dataType:"json"
                })
            } else {
                if (item.url == undefined) {
                    return false;
                }
                player.playlist.push({
                    name:item.name || "未知",
                    artists:item.author || "未知",
                    thumbnail:item.thumbnail || "",
                    url:item.url
                });
                loadedItems++;
            }
            if (loadedItems == options.playlist.length) {
                playlistInited(player,options);
            }
        }
        return player.api;
    }
    print("tPlayer已初始化 | https://github.com/FavCode/tPlayer");
}();