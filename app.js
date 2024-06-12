const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//const PLAYER_STORAGE_KEY = 'Admin';

const heading = $('.header h2');
const cdThumb = $('.main-background img');
const audio = $('.audio');
const playList = $('.play-list');
const playBtn = $('.play');
const progessRange = $('.progess input');
const nextBtn = $('.next');
const preBtn = $('.back');
const randomBtn = $('.random');
const repeatBtn = $('.return');


const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    //config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Trò chuyện với thời gian',
            singer: 'Tryler',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img2.jpeg',
            // played: false
        },
        {
            name: 'Người Đáng Thương Là Anh',
            singer: 'Only C',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img1.jpeg',
            // played: false
        },
        {
            name: 'Chờ Anh Nhé',
            singer: 'Hoàng Dũng',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img4.jpeg',
            // played: false
        },
        {
            name: 'Phố Không Em',
            singer: 'Thái Đinh',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img5.jpeg',
            // played: false
        },
        {
            name: 'Cảm Ơn Và Xin Lỗi',
            singer: 'Chillies',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img7.jpeg',
            // played: false
        },
        {
            name: 'Tình Yêu Là',
            singer: 'Hiền Hồ',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img6.jpeg',
            // played: false
        },
        {
            name: 'Mơ',
            singer: 'Vũ Cát Tường',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img8.jpeg',
            // played: false
        },
        {
            name: 'Mưa Cứ Rơi',
            singer: 'Mr.A',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img9.jpeg',
            // played: false
        },
        {
            name: 'Gọi Tên Một Nỗi Buồn',
            singer: 'Lâm Bảo Ngọc',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img10.jpeg',
            // played: false
        },
        {
            name: 'Anh',
            singer: 'Hồ Quỳnh Hương',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img11.jpeg',
            // played: false
        },
        {
            name: 'Miên Man',
            singer: 'Minh Huy',
            path: './assets/mp3/music.mp3',
            image: './assets/img/img3.jpeg',
            // played: false
        }
        
    ],
    // setConfig: function(key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    // },
    render: function() { 
        var htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index == this.currentIndex ? 'active-song' : ''}" data-index="${index}">
                    <div class="img">
                        <img src="${song.image}" alt="">
                    </div>
                    <div class="info">
                        <div class="name">
                            <h3>${song.name}</h3>
                        </div>
                        <div class="author">
                            <p>${song.singer}</p>
                        </div>
                    </div>
                    <div class="more-option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })

        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        // add 'currentSong' proprety to app 
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function() {
        // Scroll
        var img = $('.main-background');
        var currentWidth = img.offsetWidth;

        document.onscroll = function() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var newWidth = (currentWidth - scrollTop);
            if(newWidth<0) newWidth=0;
            
            img.style.width = newWidth + 'px';
            img.style.height = newWidth + 'px';
            img.style.opacity = newWidth / currentWidth;
        }

        // CD rotate
        var cdRotate = cdThumb.animate([
            {transform: "rotate(360deg)"}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause();
        
        // Play-Pause
        playBtn.onclick = function() {
            if(app.isPlaying) {
                audio.pause();
                app.pausing();
                cdRotate.pause();
            } else {
                audio.play();
                app.playing();
                cdRotate.play();
            }
        }
        
        // Play progess
        audio.ontimeupdate = function() {
            if(audio.duration) {
                progessRange.value = ( audio.currentTime * 100 ) / audio.duration;
            }
        }

        // Progess skip
        progessRange.oninput = function() {
            var currentPercent = progessRange.value;
            audio.currentTime = ( currentPercent * audio.duration ) / 100;
        }

        // Next song
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.nextRandomSong();
                app.render();
                app.scrollToActiveSong();
            } else {
                app.nextSong();
                app.render();
                app.scrollToActiveSong();
            }
            cdRotate.play();
        }

        // Pre song
        preBtn.onclick = function() {
            app.preSong();
            app.render();
            app.scrollToActiveSong();
            cdRotate.play();
        }

        //when ended
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //choose song ( click song in playlist )
        // playList.onclick = function(e) {
        //     const songNode = e.target.closest('.song:not(.active-song)');
        //     const option = e.target.closest('.option');
        //     if(songNode || option) {
        //         //when click song in playlist
        //         if(songNode) {
        //             app.currentIndex = Number(songNode.dataset.index);
        //             app.loadCurrentSong();
        //             app.render();
        //             audio.play();
        //             cdRotate.play();
        //             app.playing();
        //         }

        //         //when click option ( ... )
        //         if(option) {
                    
        //         }
        //     }
        // }

        //random song
        // randomBtn.onclick = function() {
        //     app.isRandom = !app.isRandom;
        //     app.setConfig('isRandom', app.isRandom);
        //     randomBtn.classList.toggle('active', app.isRandom);
        // }

        //repeat song
        // repeatBtn.onclick = function() {
        //     app.isRepeat = !app.isRepeat;
        //     app.setConfig('isRepeat', app.isRepeat);
        //     repeatBtn.classList.toggle('active', app.isRepeat);
        // }
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name;
        cdThumb.src = this.currentSong.image;
        audio.src = this.currentSong.path;
        //change status played
        // this.setConfig('currentIndex', this.currentIndex);
        // Object.defineProperty(this.songs[this.currentIndex],"played", {value:true});
    },
    // loadConfig: function() {
    //     this.isRandom = this.config.isRandom;
    //     this.isRepeat = this.config.isRepeat;
    //     this.currentIndex = this.config.currentIndex;
    // },
    // initListRandomSongs: function() {
    //     var randomList = [...app.songs];
    //     return randomList;
    // },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex > this.songs.length-1) {
            this.currentIndex = 0;
        }  
        this.loadCurrentSong();
        audio.play();
        this.playing();    
    },
    // nextRandomSong: function() {
    //     do {
    //         var random = Math.floor(Math.random() * this.songs.length);
    //     } while(random == this.currentIndex || this.songs[random].played == true);
    //     this.currentIndex = random;
    //     this.loadCurrentSong();
    //     audio.play();
    //     this.playing();  

    //     if(app.songs.every( (song, index) => song.played == true )) {
    //         app.songs.forEach( (song, index) => {
    //             if(index != this.currentIndex) {
    //                 Object.defineProperty(app.songs[index],"played", {value:false});
    //             }
    //         } )
    //     }
    // },
    preSong: function() {
        app.currentIndex--;
        if(app.currentIndex < 0) {
            app.currentIndex = app.songs.length-1;
        }
        this.loadCurrentSong();
        audio.play();
        this.playing();
    },
    playing: function() {
        audio.onplay = function() {
            app.isPlaying = true;
            playBtn.classList.remove('fa-play');
            playBtn.classList.add('fa-pause');
            playBtn.classList.add('playing');
        }
    },
    pausing: function() {
        audio.onpause = function() {
            app.isPlaying = false;
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active-song').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300);
    },
    

    start: function() {
        //this.loadConfig(); //load setting
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvent();

        this.render();
        // set lai trang thai ban dau
        // randomBtn.classList.toggle('active', app.isRandom);
        // repeatBtn.classList.toggle('active', app.isRepeat);
    }
}

app.start();
