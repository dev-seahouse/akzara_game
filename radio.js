const stations = [
  {
    station: 'Radio Bar',
    type: 'piano',
    src: 'https://edge4.peta.live365.net/b96307_128mp3?listening-from-radio-garden=1585584007818',
  },
  {
    station: 'Smooth Grooves',
    type: 'groove',
    src: 'https://21293.live.streamtheworld.com/SUBLIMESMOOTH.mp3?listening-from-radio-garden=1585625323916'
  },
  {
    station: 'Snazzy Jazz',
    type: 'jazz',
    src: 'https://edge4.peta.live365.net/b82873_128mp3?listening-from-radio-garden=1585584261407'
  },
  {
    station: 'Strumtastic',
    type: 'guitar',
    src: 'https://edge4.peta.live365.net/b64575_128mp3?listening-from-radio-garden=1585584314008'
  },
  {
    station: '80s',
    type: 'retro',
    src: "http://stream.radio.co/s4eb622211/listen?listening-from-radio-garden=1585626110057"
  },
  {
    station: 'Non Stop',
    type: 'pop',
    src: "https://21283.live.streamtheworld.com/SRGSTR09.mp3?listening-from-radio-garden=1585625856582"
  },
  {
    station: "Non Stop Pure Dance",
    type: 'dance',
    src: "http://stream.nonstopplay.co.uk/nsppd-128k-mp3?listening-from-radio-garden=1585625990705"
  }
];

class RadioPlayer {
  constructor(stations) {
    this.stations = stations;
    this.nowPlaying = null;
    this.nowPlayingTitle = "";
    this.nowPlayingStationType = "";
    this.muted = false;
    this.playing = false;
    this.currentStationIndex = 0;
  }

  setStation(index = 0) {
    isNaN(index) ? index = 0 : index;
    let radioSource = this.stations[index].src;
    this.nowPlaying = new Howl({
      src: radioSource,
      html5: true,
      volume: 0.5,
      format: ['mp3', 'aac']
    });
    this.nowPlayingTitle = this.stations[index].station;
    this.nowPlayingStationType = this.stations[index].type;
  }

  getStationTitle() {
    return this.nowPlayingTitle;
  }

  getStationType() {
    return this.nowPlayingStationType;
  }

  play() {
    if (Howler.ctx.state == "suspended") {
      Howler.ctx.resume().then(() => this.nowPlaying.play());
    } else {
      this.nowPlaying.play();
    }
    this.playing = true;
  }

  isPlaying() {
    return this.playing;
  }

  stop() {
    this.nowPlaying.stop();
    this.playing = false;
  }

  mute() {
    this.nowPlaying.mute(true);
    this.muted = true;
  }

  unmute() {
    this.nowPlaying.mute(false);
    this.muted = false;
  }

  playNext() {

    this.nowPlaying.stop();

    if (this.currentStationIndex === this.stations.length - 1) {
      this.currentStationIndex = 0;
    } else {
      this.currentStationIndex++;
    }
    this.setStation(this.currentStationIndex);
    if (this.isPlaying()) {
      this.play();
    }
  }

  playPrevious() {
    this.nowPlaying.stop();
    if (this.currentStationIndex === 0) {
      this.currentStationIndex = this.stations.length - 1
    } else {
      this.currentStationIndex--;
    }
    this.setStation(this.currentStationIndex);
    if (this.isPlaying()) {
      this.play();
    }
  }

  isMuted() {
    return this.muted;
  }

}

