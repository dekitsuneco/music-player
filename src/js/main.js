// @ts-check

// 1. Cache the DOM:
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
 * @param {HTMLElement} container
 * @param {Object} container
 * @param {Controls} controls
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
  isOn: false,
  changeStatus() {
    this.isOn = !this.isOn;
    this.container.classList.toggle('music-player--on');

    /**
     * @type {HTMLElement}
     */
    const toggleButton = this.controls.play.querySelector('i.fas');

    if (this.isOn) {
      toggleButton.classList.remove('fa-play');
      toggleButton.classList.add('fa-pause');
    } else {
      toggleButton.classList.remove('fa-pause');
      toggleButton.classList.add('fa-play');
    }
  },
};

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

// 2. Define constants:
/**
 * @constant {Object}
 * @param {String} NEXT
 * @param {String} PREV
 */
const DIRECTION = {
  NEXT: 'next',
  PREV: 'prev',
};

// TODO
/**
 * @type {Scale}
 */
const widthScale = { min: 0, max: 100 };

/**
 * @type {Scale}
 */
const percentageScale = { min: 0, max: 100 };

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

// 3. Define functions:
/**
 *@todo Define a function to map the range of the bar width to a song duration
 *@todo Define a function to update the progress bar on clicking
 *@todo Define a function to control volume
 */
// updateProgressManually(e): void
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
  audio.title.innerText = song;
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

    audio.source.pause();
  }
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

// 4. Set event listeners:
player.controls.play.addEventListener('click', () => {
  if (player.isOn) {
    pause();
  } else {
    play();
  }
});

player.controls.prev.addEventListener('click', () => skipTo(DIRECTION.PREV));
player.controls.next.addEventListener('click', () => skipTo(DIRECTION.NEXT));

audio.source.addEventListener('timeupdate', updateProgress);

audio.source.addEventListener('ended', () => skipTo(DIRECTION.NEXT));
