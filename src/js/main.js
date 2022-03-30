// @ts-check

/**
 * @todo Make default song be set from javascript
 * @todo Move DOM caching into separate file
 * @todo Move range mapping into separate file as a module
 */

// |@ 1. Cache the DOM:
/**
 * @typedef {Object} Controls
 * @property {HTMLElement} prev
 * @property {HTMLElement} play
 * @property {HTMLElement} next
 */
/**
 * @typedef {Object} Progress
 * @property {number} min
 * @property {number} current
 * @property {number} max
 */
/**
 * @typedef {Object} Scale
 * @property {number} min
 * @property {number} max
 */

/**
 * @type {Object}
 * @param {HTMLAudioElement} source
 * @param {HTMLElement} source
 * @param {HTMLImageElement} source
 */
const audio = {
  source: document.querySelector('.music-player__audio'),
  title: document.querySelector('.audio-meta__title'),
  cover: document.querySelector('.audio-cover__disk img'),
};

/**
 * @type {Object}
 * @param {HTMLElement} container
 * @param {Object} container
 * @param {Controls} controls
 * @param {HTMLElement} durationBar
 * @param {HTMLMeterElement} volumeBar
 * @param {Function} changeVolume
 * @param {Boolean} isOn
 * @param {Function} changeStatus
 */
const player = {
  container: document.querySelector('.music-player'),
  controls: {
    prev: document.querySelector('.controls__previous'),
    play: document.querySelector('.controls__play'),
    next: document.querySelector('.controls__next'),
  },
  durationBar: document.querySelector('.audio-meta__progress-bar'),
  volumeBar: document.querySelector('.music-player__audio-volume'),
  changeVolume() {
    audio.source.volume = this.volumeBar.value / 100;
  },
  isOn: false,
  changeStatus() {
    this.isOn = !this.isOn;
    this.container.classList.toggle('music-player--on');

    /**
     * @type {HTMLElement}
     */
    const toggleButtonIcon = this.controls.play.querySelector('i.fas');

    if (this.isOn) {
      toggleButtonIcon.classList.remove('fa-play');
      toggleButtonIcon.classList.add('fa-pause');
    } else {
      toggleButtonIcon.classList.remove('fa-pause');
      toggleButtonIcon.classList.add('fa-play');
    }
  },
};

// |@ 2. Define constants:
/**
 * @constant {Object}
 * @param {String} NEXT
 * @param {String} PREV
 */
const DIRECTION = {
  NEXT: 'next',
  PREV: 'prev',
};

/**
 * @type {Scale}
 */
const progressWidthScale = {
  min: 0,
  max: player.durationBar.clientWidth,
};

/**
 * @type {Scale}
 */
const percentageScale = { min: 0, max: 100 };

/**
 * @type {Scale}
 */
const volumeWidthScale = {
  min: 0,
  max: player.volumeBar.clientWidth,
};

/**
 * @type {Object}
 * @property {Array<string>} all
 * @property {number} indexOfCurrent
 */
const playlist = {
  all: [
    'Boiling_Blood',
    'Eternal_flame',
    'Immutable',
    'Operation_dawnseeker',
    'Pyrite',
    'Radiant',
    'Ready',
    'Renegade',
    'Speed_of_light',
  ],
  indexOfCurrent: 0,
};

// |@ 3. Define functions:
/**
 * @param {String} song
 * @returns {void}
 */
const changeAudioTo = (song) => {
  /**
   * @type {String}
   */
  const pathToDir = `../src/assets/playlist/${song}`;

  audio.source.src = `${pathToDir}/${song}.mp3`;
  audio.cover.src = `${pathToDir}/${song}.jpg`;
  audio.title.innerText = song.replace(/_/g, ' ');
};

/**
 * @returns {void}
 */
const play = () => {
  if (!player.isOn) {
    player.changeStatus();
  }

  audio.source.play();
};

/**
 * @returns {void}
 */
const pause = () => {
  if (player.isOn) {
    player.changeStatus();
  }

  audio.source.pause();
};

/**
 * @param {String} direction
 * @returns {void}
 */
const moveInPlaylistTo = (direction) => {
  switch (direction) {
    case DIRECTION.NEXT:
      if (playlist.indexOfCurrent === playlist.all.length - 1) {
        playlist.indexOfCurrent = 0;
      } else {
        playlist.indexOfCurrent += 1;
      }
      break;

    case DIRECTION.PREV:
      if (playlist.indexOfCurrent === 0) {
        playlist.indexOfCurrent = playlist.all.length - 1;
      } else {
        playlist.indexOfCurrent -= 1;
      }
      break;

    default:
      break;
  }
};

/**
 * @param {String} direction
 * @returns {void}
 */
const skipTo = (direction) => {
  moveInPlaylistTo(direction);

  changeAudioTo(playlist.all[playlist.indexOfCurrent]);
  play();
};

/**
 * @param {Scale} fromRange
 * @param {Scale} toRange
 * @param {number} num
 * @returns {number}
 */
const mapNumBetweenRanges = (fromRange, toRange, num) => {
  /**
   * @type {number}
   */
  const sizeOfToRange = toRange.max - toRange.min;
  /**
   * @type {number}
   */
  const sizeOfFromRange = fromRange.max - fromRange.min;

  return (
    toRange.min + (sizeOfToRange / sizeOfFromRange) * (num - fromRange.min)
  );
};

/**
 * @param {Object} e
 * @param {HTMLAudioElement} e.target
 * @returns {void}
 */
const updateProgress = ({ target: { duration, currentTime } }) => {
  /**
   * @type {Scale}
   */
  const durationScale = {
    min: 0,
    max: duration,
  };

  /**
   * @type {Number}
   */
  const current = mapNumBetweenRanges(
    durationScale,
    percentageScale,
    currentTime,
  );

  document.documentElement.style.setProperty(
    '--strength',
    `${Math.round(current)}%`,
  );
};

/**
 * @param {PointerEvent} e
 * @returns {void}
 */
const setProgress = (e) => {
  /**
   * @type {Scale}
   */
  const durationScale = {
    min: 0,
    max: audio.source.duration,
  };

  /**
   * @type {Number}
   */
  const clickedPostiion = e.offsetX;

  /**
   * @type {Number}
   */
  const currentProgress = mapNumBetweenRanges(
    progressWidthScale,
    durationScale,
    clickedPostiion,
  );

  audio.source.currentTime = currentProgress;
};

/**
 * @param {PointerEvent} e
 * @returns {void}
 */
const setVolume = (e) => {
  /**
   * @type {Number}
   */
  const clickedPostiion = e.offsetX;

  /**
   * @type {Number}
   */
  const currentVolume = mapNumBetweenRanges(
    volumeWidthScale,
    percentageScale,
    clickedPostiion,
  );

  player.volumeBar.value = currentVolume;
  player.changeVolume();
};

// |@ 4. Set default actions and event listeners:
changeAudioTo(playlist.all[playlist.indexOfCurrent]);

player.controls.play.addEventListener('click', () => {
  if (player.isOn) {
    pause();
  } else {
    play();
  }
});

player.controls.prev.addEventListener('click', () => skipTo(DIRECTION.PREV));
player.controls.next.addEventListener('click', () => skipTo(DIRECTION.NEXT));

player.volumeBar.addEventListener('click', setVolume);

audio.source.addEventListener('timeupdate', updateProgress);

player.durationBar.addEventListener('click', setProgress);

audio.source.addEventListener('ended', () => skipTo(DIRECTION.NEXT));
