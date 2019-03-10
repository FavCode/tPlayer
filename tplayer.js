!function() {
    let player = $("<div class='tenma-player'><img class='song-thumbnail'/><div class='song-info'><h4 class='song-name'></h4><small class='song-author'></small></div><div class='controls'><span class='prev'></span><span class='play-pause play'></span><span class='next'></span></div><div class='progress-bar'></div><audio></audio></div>"),jsapi = {
        play:function(id) {
            if (id != undefined && typeof(id) == "number" && id >= 0 && id < songlist.length) {
                playing = id;
                let author = "";
                for (let i = 0;i<songlist[playing].artists.length;i++) {
                    if (i != 0) {
                        author += ", " + songlist[playing].artists[i].name;
                    } else {
                        author += songlist[playing].artists[i].name;
                    }
                }
                player.setAuthor(author);
                player.setSongname(songlist[playing].name);
                player.setThumbnail(songlist[playing].album.picUrl);
                player.getAudio().src = (location.protocol == "file:" ? "http:" : "") + "//music.163.com/song/media/outer/url?id=" + songlist[playing].id + ".mp3";
            }
            player.getAudio().play();
        },
        pause:function() {
            player.getAudio().pause();
        },
        next:function() {
            this.play(playing+1);
        },
        prev:function() {
            this.play(playing-1);
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
    },songlist,playing,errorcount = 0;
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
    player.find(".prev").on("click",function() {
        jsapi.prev();
    });
    player.find(".next").on("click",function() {
        jsapi.next();
    });
    player.find(".play-pause").on("click",function() {
        if ($(this).hasClass("play")) {
            player.find(".play-pause").removeClass("play");
            player.find(".play-pause").addClass("pause");
            jsapi.play();
        } else {
            player.find(".play-pause").removeClass("pause");
            player.find(".play-pause").addClass("play");
            jsapi.pause();
        }
    });
    player.getJqAudio().on("load",function() {
        if (isNaN(this.duration)) {return;}
        errorcount = 0;
    });
    player.getJqAudio().on("play",function() {
        player.addClass("playing");
        player.find(".play-pause").removeClass("play");
        player.find(".play-pause").addClass("pause");
    });
    player.getJqAudio().on("pause",function() {
        player.removeClass("playing");
        player.find(".play-pause").removeClass("pause");
        player.find(".play-pause").addClass("play");
    });
    player.getJqAudio().on("ended",function() {
        if (playing == songlist.length-1) {
            playing = 0;
        } else {
            playing++;
        }
        let author = "";
        for (let i = 0;i<songlist[playing].artists.length;i++) {
            if (i != 0) {
                author += ", " + songlist[playing].artists[i].name;
            } else {
                author += songlist[playing].artists[i].name;
            }
        }
        player.setAuthor(author);
        player.setSongname(songlist[playing].name);
        player.setThumbnail(songlist[playing].album.picUrl);
        player.getAudio().src = (location.protocol == "file:" ? "http:" : "") + "//music.163.com/song/media/outer/url?id=" + songlist[playing].id + ".mp3";
        player.getAudio().play();
    });
    player.getJqAudio().on("error",function() {
        player.removeClass("playing");
        if (errorcount < 5) {
            print(songlist[playing].name + " 播放失败，已跳过");
            jsapi.next();
            errorcount++;
        } else {
            print(songlist[playing].name + " 播放失败，连续失败次数已达" + errorcount + "次，暂停播放");
            jsapi.pause();
            errorcount = 0;
        }
    });
    player.getJqAudio().on("timeupdate",function() {
        player.find(".progress-bar").css("width",(this.currentTime / this.duration) * 100 + "%");
    });
    function playerResizeChecker() {
        if (player.find(".song-info").css("max-width") != parseInt(player.css("width").replace("px")) - 74 + "px") {
            player.find(".song-info").css("max-width",parseInt(player.css("width").replace("px")) - 74 + "px");
        }
        requestAnimationFrame(playerResizeChecker);
    }
    function print(text) {
        console.log("%ctPlayer%c" + text,"border-top-left-radius:5px;border-bottom-left-radius:5px;padding:0 5px;font-size:24px;font-family:'Microsoft YaHei Light','Microsoft YaHei';background-color:darkred;color:white;","border-top-right-radius:5px;border-bottom-right-radius:5px;padding:5px;padding-top:10px;padding-bottom:2px;font-size:14px;font-family:'Microsoft YaHei Light','Microsoft YaHei';background-color:pink;color:darkred;margin:5px;margin-left:0;");
    }
    window.createPlayer = function(container,playlist,autoplay = true) {
        if (typeof(playlist) == "number") {
            print("检测到playlist参数使用了number，请避免使用number");
        }
        $(container).append(player);
        playerResizeChecker();
        player.find(".song-info").css("max-width",parseInt(player.css("width").replace("px")) - 74 + "px");
        player.find(".controls").css("display","none");
        player.find(".controls").css("opacity","0");
        player.find(".song-thumbnail").css("display","none");
        player.find(".song-thumbnail").css("width","0");
        player.find(".song-thumbnail").css("height","0");
        player.setSongname("播放器加载中...");
        $.ajax({
            url:"https://tenmahw.com/tPlayer/tplayer.php?id=" + playlist,
            success:function(data) {
                window.createPlayer = undefined;
                let tracks = data.result.tracks;
                if (location.protocol == "https:") {
                    for (let track of tracks) {
                        track.album.picUrl = track.album.picUrl.replace("http:",location.protocol);
                    }
                }
                songlist = tracks;
                print("开始播放歌单 " + data.result.name);
                playing = 0;
                let author = "";
                for (let i = 0;i<songlist[playing].artists.length;i++) {
                    if (i != 0) {
                        author += ", " + songlist[playing].artists[i].name;
                    } else {
                        author += songlist[playing].artists[i].name;
                    }
                }
                player.setAuthor(author);
                player.setThumbnail(songlist[playing].album.picUrl);
                player.setSongname(songlist[playing].name);
                player.getAudio().src = (location.protocol == "file:" ? "http:" : "") + "//music.163.com/song/media/outer/url?id=" + songlist[playing].id + ".mp3";
                if (autoplay) {
                    player.getAudio().play();
                }
                player.find(".controls").css("display","block");
                player.find(".song-thumbnail").css("display","inline-block");
                setTimeout(function() {
                    let wPlaying = player.hasClass("playing");
                    player.removeClass("playing");
                    player.find(".song-thumbnail").css("width","64px");
                    setTimeout(function() {
                        player.find(".song-thumbnail").css("height","64px");
                        setTimeout(function() {
                            player.find(".controls").css("opacity","1");
                        },150);
                        if (wPlaying) {
                            setTimeout(function() {
                                player.addClass("playing");
                            },300);
                        }
                    },300);
                },500);
            },
            error:function() {
                print("tPlayer创建失败");
                player.remove();
            },
            dataType:"json"
        });
        return jsapi;
    };
    print("tPlayer已初始化 | https://tenmahw.com/");
}()