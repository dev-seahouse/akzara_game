const gamePlatform = new GamePlatForm();
const gameSave = gamePlatform.getGameSave();
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
  if (radioPlayer.isPlaying()) {
    radioPlayer.stop();
    playBtn.innerHTML = "<i class=\"fad fa-play\"></i>"
  } else {
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

nextBtn.addEventListener('click', function () {
  radioPlayer.playNext();
  nowPlayingElem.textContent = "Now Listening: " + radioPlayer.getStationTitle();
  musicTypeElem.textContent = "Genre: " + radioPlayer.getStationType();
});

prevBtn.addEventListener('click', function () {
  radioPlayer.playPrevious();
  nowPlayingElem.textContent = "Now Listening: " + radioPlayer.getStationTitle();
  musicTypeElem.textContent = "Genre: " + radioPlayer.getStationType();

});

let radioPlayer = new RadioPlayer(stations);
radioPlayer.setStation(0);

nowPlayingElem.textContent = "Now Listening: " + radioPlayer.getStationTitle();
musicTypeElem.textContent = "Genre: " + radioPlayer.getStationType();

/*
 * UI
 */

function updateHighScoreBoard() {
  const highScoresOLElement = document.getElementById('highScoresList');
  highScoresOLElement.innerHTML = "";
  const highScoreArr = gameSave.getHighScores();
  highScoreArr.forEach(score => {
    let listItem = document.createElement("li");
    listItem.textContent = score;
    highScoresOLElement.appendChild(listItem);
  });
}

updateHighScoreBoard();

const clearOverLay = () => {
  gameContainer.style.filter = "";
  overlay.style.display = "none";
};

const showOverLay = function () {
  this.style.filter = "blur(8px)";
  overlay.style.display = "flex";
};

gameContainer.addEventListener('mouseout', function (e) {
  showOverLay.call(this);
  if (gamePlatform && gamePlatform.isGameStarted()) {
    gamePlatform.stop();
  }
});

gameContainer.addEventListener('hasGameEnded', function (e) {
  updateHighScoreBoard();
  showOverLay.call(this);
});

resumeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  clearOverLay();
  if (gamePlatform && gamePlatform.isGamePaused()) {
    setTimeout(function () {
      gamePlatform.resume();
    }, 1000)
  }
});

newGameBtn.addEventListener('click', function (e) {
  e.preventDefault();
  updateHighScoreBoard();
  clearOverLay();
  if (gamePlatform) {
    setTimeout(function () {
      gamePlatform.start();
    }, 1000);
  }
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
