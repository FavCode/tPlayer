!function() {
    function setCookie(c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    }
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return null
    }
    function resetCookie() {
        gConfig = {};
        gConfig[plId] = {
            playing:0
        };
        gConfig["paused"] = false;
        gConfig["volume"] = 0.5;
        setCookie("tplayer",JSON.stringify(gConfig),365);
    }
    function saveConfig() {
        setCookie("tplayer",JSON.stringify(gConfig),365);
    }
    let player = $("<div class='tenma-player'><div class='player-body'><img class='song-thumbnail'/><div class='song-info'><h4 class='song-name'></h4><small class='song-author'></small></div><div class='controls'><span class='prev'></span><span class='play-pause play'></span><span class='next'></span></div><div class='list-toggle'></div><div class='progress-bar'></div><audio></audio></div><div class='song-list hide'></div></div>"),jsapi = {
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
                gConfig[plId].playing = playing;
                saveConfig();
                player.setAuthor(author);
                player.setSongname(songlist[playing].name);
                player.setThumbnail(songlist[playing].album.picUrl);
                player.getAudio().src = (location.protocol == "file:" ? "http:" : "") + "//music.163.com/song/media/outer/url?id=" + songlist[playing].id + ".mp3";
                player.find(".player-body>.song-thumbnail").css("animation","none");
                setTimeout(function() {
                    player.find(".player-body>.song-thumbnail").css("animation","");
                });
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
    },songlist,playing,gConfig = {},plId,errorcount = 0;
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
    player.find(".player-body>.controls>.prev").on("click",function() {
        jsapi.prev();
    });
    player.find(".player-body>.controls>.next").on("click",function() {
        jsapi.next();
    });
    player.find(".player-body>.controls>.play-pause").on("click",function() {
        if ($(this).hasClass("play")) {
            player.find(".player-body>.controls>.play-pause").removeClass("play");
            player.find(".player-body>.controls>.play-pause").addClass("pause");
            jsapi.play();
            gConfig["paused"] = false;
            saveConfig();
        } else {
            player.find(".player-body>.controls>.play-pause").removeClass("pause");
            player.find(".player-body>.controls>.play-pause").addClass("play");
            jsapi.pause();
            gConfig["paused"] = true;
            saveConfig();
        }
    });
    player.find(".player-body>.list-toggle").on("click",function() {
        if ($(".song-list").hasClass("hide")) {
            $(".song-list").removeClass("hide");
        } else {
            $(".song-list").addClass("hide");
        }
    });
    player.getJqAudio().on("load",function() {
        if (isNaN(this.duration)) {return;}
        errorcount = 0;
    });
    player.getJqAudio().on("play",function() {
        player.addClass("playing");
        player.find(".player-body>.controls>.play-pause").removeClass("play");
        player.find(".player-body>.controls>.play-pause").addClass("pause");
    });
    player.getJqAudio().on("pause",function() {
        player.removeClass("playing");
        player.find(".player-body>.controls>.play-pause").removeClass("pause");
        player.find(".player-body>.controls>.play-pause").addClass("play");
    });
    player.getJqAudio().on("ended",function() {
        if (playing == songlist.length-1) {
            playing = 0;
        } else {
            playing++;
        }
        jsapi.play(playing);
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
        player.find(".player-body>.progress-bar").css("width",(this.currentTime / this.duration) * 100 + "%");
        if (gConfig[plId].song == undefined) {
            gConfig[plId].song = {id:songlist[playing].id,currentTime:this.currentTime};
        } else {
            gConfig[plId].song.id = songlist[playing].id;
            gConfig[plId].song.currentTime = this.currentTime;
        }
        saveConfig();
    });
    function playerResizeChecker() {
        if (player.find(".player-body>.song-info").css("max-width") != parseInt(player.css("width").replace("px")) - 74 + "px") {
            player.find(".player-body>.song-info").css("max-width",parseInt(player.css("width").replace("px")) - 74 + "px");
        }
        requestAnimationFrame(playerResizeChecker);
    }
    function print(text) {
        console.log("%ctPlayer%c" + text,"border-top-left-radius:5px;border-bottom-left-radius:5px;padding:0 5px;font-size:24px;font-family:'Microsoft YaHei Light','Microsoft YaHei';background-color:darkred;color:white;","border-top-right-radius:5px;border-bottom-right-radius:5px;padding:5px;padding-top:10px;padding-bottom:2px;font-size:14px;font-family:'Microsoft YaHei Light','Microsoft YaHei';background-color:pink;color:darkred;margin:5px;margin-left:0;");
    }
    window.createPlayer = function(container,playlist,autoplay = true) {
        let self = createPlayer;
        window.createPlayer = undefined;
        if (typeof(playlist) == "number") {
            print("检测到playlist参数使用了number，请避免使用number");
            playlist = playlist.toString();
        }
        plId = playlist;
        print("加载歌单数据...");
        $(container).append(player);
        playerResizeChecker();
        player.find(".player-body>.song-info").css("max-width",parseInt(player.css("width").replace("px")) - 74 + "px");
        player.find(".player-body>.controls").css("display","none");
        player.find(".player-body>.controls").css("opacity","0");
        player.find(".player-body>.song-thumbnail").css("display","none");
        player.find(".player-body>.song-thumbnail").css("width","0");
        player.find(".player-body>.song-thumbnail").css("height","0");
        player.find(".player-body>.list-toggle").css("opacity","0");
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
                let songId = 0;
                for (let song of songlist) {
                    let author = "";
                    for (let i = 0; i < song.artists.length; i++) {
                        if (i != 0) {
                            author += ", " + song.artists[i].name;
                        } else {
                            author += song.artists[i].name;
                        }
                    }
                    $(".tenma-player>.song-list").append("<div class='song' data-id='" + songId + "'><img src='" + song.album.picUrl + "' class='thumbnail'/><h4 class='name'>" + song.name + "</h4><span class='author'>" + author + "</span></div>");
                    songId++;
                }
                $(".tenma-player>.song-list>.song").on("click",function() {
                    jsapi.play(parseInt($(this).data("id")));
                });
                print("开始播放歌单 " + data.result.name);
                let c = getCookie("tplayer"),cTime = -1;
                if (c == null) {
                    playing = -1;
                    resetCookie();
                } else {
                    try {
                        let config = JSON.parse(c);
                        if (config[plId] == undefined) {
                            playing = -1;
                            resetCookie();
                        } else {
                            gConfig = config;
                            let pConfig = config[plId];
                            playing = pConfig.playing;
                            if (songlist[playing].id == pConfig.song.id) {
                                cTime = pConfig.song.currentTime;
                            }
                            print("检测到播放器数据，跳至第" + (playing+1) + "首音乐");
                        }
                    } catch(e) {
                        playing = -1;
                        resetCookie();
                    }
                }
                if (gConfig["paused"] == undefined||gConfig["volume"] == undefined) {
                    resetCookie();
                }
                jsapi.volume = gConfig["volume"];
                if (playing == -1) {
                    playing = 0;
                    print("未检测到播放器数据或数据读取失败，从头播放");
                    resetCookie();
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
                player.setThumbnail(songlist[playing].album.picUrl);
                player.setSongname(songlist[playing].name);
                player.getAudio().src = (location.protocol == "file:" ? "https:" : "") + "//music.163.com/song/media/outer/url?id=" + songlist[playing].id + ".mp3";
                if (cTime != -1) {
                    player.getJqAudio().one("timeupdate",function() {
                        player.getAudio().currentTime = cTime;
                        print("检测到上次播放时长，已跳转");
                    });
                }
                if (autoplay) {
                    if (!gConfig["paused"]) {
                        player.getAudio().play();
                    } else {
                        print("自动播放被取消，用户曾暂停播放器");
                    }
                }
                player.find(".player-body>.controls").css("display","block");
                player.find(".player-body>.song-thumbnail").css("display","inline-block");
                setTimeout(function() {
                    let wPlaying = player.hasClass("playing");
                    player.removeClass("playing");
                    player.find(".player-body>.song-thumbnail").css("width","64px");
                    setTimeout(function() {
                        player.find(".player-body>.song-thumbnail").css("height","64px");
                        setTimeout(function() {
                            player.find(".player-body>.controls").css("opacity","1");
                            player.find(".player-body>.list-toggle").css("opacity","1");
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
                window.createPlayer = self;
            },
            dataType:"json"
        });
        return jsapi;
    };
    print("tPlayer已初始化 | https://github.com/FavCode/tPlayer");
}()