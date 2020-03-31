const gamePlatform = new GamePlatForm();
/*
 *  Radio
 */
const gameContainer = document.getElementById("gameContainer");
const nowPlayingElem = document.getElementById('nowPlaying');
const musicTypeElem = document.getElementById('musicType');
const muteBtn = document.getElementById('muteBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const overlay = document.getElementById('overlay');
const newGameBtn = document.getElementById('newGameBtn');
const resumeBtn = document.getElementById('resumeBtn');

playBtn.addEventListener('click', function () {
  if(radioPlayer.isPlaying()) {
    radioPlayer.stop();
    playBtn.innerHTML = "<i class=\"fad fa-play\"></i>"
  }else {
    radioPlayer.play();
    playBtn.innerHTML = "<i class=\"fad fa-stop\"></i>"
  }
});

muteBtn.addEventListener('click', function () {
  if (radioPlayer.isMuted()) {
    muteBtn.innerHTML = "<i class=\"fad fa-volume\"></i>";
    radioPlayer.unmute();
  } else {
    muteBtn.innerHTML = "<i class=\"fad fa-volume-mute\"></i></i>";
    radioPlayer.mute();
  }
});

nextBtn.addEventListener('click',function () {
  radioPlayer.playNext();
  nowPlayingElem.textContent = "Now Listening: "+ radioPlayer.getStationTitle();
  musicTypeElem.textContent = "Genre: " + radioPlayer.getStationType();
});

prevBtn.addEventListener('click', function () {
  radioPlayer.playPrevious();
  nowPlayingElem.textContent = "Now Listening: "+ radioPlayer.getStationTitle();
  musicTypeElem.textContent = "Genre: " + radioPlayer.getStationType();

});


let radioPlayer = new RadioPlayer(stations);
radioPlayer.setStation(0);

nowPlayingElem.textContent = "Now Listening: "+ radioPlayer.getStationTitle();
musicTypeElem.textContent = "Genre: " + radioPlayer.getStationType();

/*
 * UI
 */

const clearOverLay = () => {
  gameContainer.style.filter = "";
  overlay.style.display = "none";
};

gameContainer.addEventListener('mouseout',function (e) {
  this.style.filter = "blur(8px)";
  overlay.style.display = "flex";
  if (gamePlatform && gamePlatform.isGameStarted()) {
    gamePlatform.stop();
  }
});

resumeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  clearOverLay();
  setTimeout(function () {
    gamePlatform.resume();
  }, 1500)
});


newGameBtn.addEventListener('click', function(e) {
  e.preventDefault();
  clearOverLay();
  gamePlatform.start();
  setTimeout(function () {
  },1500);
});


// Background color breathe effect
let bgColors = ["#ffb6b6", "#ccf0e1", "#f8dc88", "#fcf8f3", "#d4ebd0",
"#856c8b", "#a4c5c6", "#faf4ff", "beebe9", "f4eeff"];
let bgIndex = 0;
setInterval(function () {
  document.body.style.cssText = "background-color: " + bgColors[bgIndex++];
  if (!bgIndex || bgIndex >= bgColors.length) {
    bgIndex = 0;
  }
}, 1400);

// On mouse out pause game and display menu


/*
 *  Client
 */

