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
 * @type {HTMLElement}
 */
const player = document.querySelector('.music-player');

/**
 * @type {Controls}
 */
const controls = {
  prev: document.querySelector('.controls__previous'),
  play: document.querySelector('.controls__play'),
  next: document.querySelector('.controls__next'),
};

/**
 * @type {HTMLAudioElement}
 */
const audio = document.querySelector('.music-player__audio');

/**
 * @type {HTMLElement}
 */
const progressBar = document.querySelector('.audio-meta__progress-bar');

/**
 * @type {HTMLElement}
 */
const songName = document.querySelector('.audio-meta__title');

/**
 * @type {HTMLImageElement}
 */
const songCover = document.querySelector('.audio-cover__disk img');

// 2. Define constants:
/**
 * @type {Progress}
 */
const progress = {
  min: 0,
  current: 0,
  max: 100,
};

// TODO
/**
 * @type {Scale}
 */
const widthScale = { min: 0, max: 100 };

// TODO
/**
 * @type {Scale}
 */
const durationScale = { min: 0, max: 60 };

/**
 * @type {Object}
 * @property {Array<string>} list
 * @property {number} indexOfCurrent
 */
const playlist = {
  all: ['Pinesoot', 'Pyrite'],
  indexOfCurrent: 0,
};

console.assert(playlist?.all instanceof Array, 'Song list is not array');
console.assert(
  playlist?.all.every((song) => typeof song === 'string'),
  'Song list is not array of strings',
);

// 3. Define functions:
/**
 *@todo Define a function to map the range of a song duration to a scale of 100
 *@todo Define a function to map the range of the bar width to a song duration
 *@todo Define a function to update the progress bar
 *@todo Define a function to update the progress bar on clicking
 */
// updateProgress(e): void
// updateProgressManually(e): void
/**
 *
 * @param {String} song
 * @returns {void}
 */
const changeCurrentSongTo = (song) => {
  const pathToDir = `../src/assets/playlist/${song}`;

  audio.src = `${pathToDir}/${song}.mp3`;
  songCover.src = `${pathToDir}/${song}.jpg`;
  songName.innerText = song;
};

/**
 * @param {String} status
 * @returns {void}
 */
const changePlayControlStatusTo = (status) => {
  /**
   * @type {Boolean}
   */
  let isPlayerOn;

  switch (status) {
    case 'play':
      if (!player.classList.contains('music-player--on')) {
        player.classList.add('music-player--on');
      }

      isPlayerOn = true;
      break;

    case 'pause':
      if (player.classList.contains('music-player--on')) {
        player.classList.remove('music-player--on');
      }

      isPlayerOn = false;
      break;

    default:
      break;
  }

  if (isPlayerOn) {
    controls.play.querySelector('i.fas').classList.remove('fa-play');
    controls.play.querySelector('i.fas').classList.add('fa-pause');
  } else {
    controls.play.querySelector('i.fas').classList.remove('fa-pause');
    controls.play.querySelector('i.fas').classList.add('fa-play');
  }
};

/**
 * @returns {void}
 */
const play = () => {
  changePlayControlStatusTo('play');

  audio.play();
};

/**
 * @returns {void}
 */
const pause = () => {
  changePlayControlStatusTo('pause');

  audio.pause();
};

/**
 * @param {String} direction
 * @returns {void}
 */
const moveIndexOfCurrentTo = (direction) => {
  switch (direction) {
    case 'forward':
      if (playlist.indexOfCurrent === playlist.all.length - 1) {
        playlist.indexOfCurrent = 0;
      } else {
        playlist.indexOfCurrent++;
      }
      break;

    case 'back':
      if (playlist.indexOfCurrent === 0) {
        playlist.indexOfCurrent = playlist.all.length - 1;
      } else {
        playlist.indexOfCurrent--;
      }
      break;

    default:
      break;
  }
};

/**
 * @returns {void}
 */
const toPrevSong = () => {
  moveIndexOfCurrentTo('back');

  changeCurrentSongTo(playlist.all[playlist.indexOfCurrent]);
  play();
};

/**
 * @returns {void}
 */
const toNextSong = () => {
  moveIndexOfCurrentTo('forward');

  changeCurrentSongTo(playlist.all[playlist.indexOfCurrent]);
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
console.assert(
  typeof mapNumBetweenRanges(widthScale, durationScale, 30) === 'number',
  'Return value of range mapping function is not array',
);

// 4. Set event listeners:
controls.play.addEventListener('click', () => {
  /**
   * @type {Boolean}
   */
  const isPlayerOn = player.classList.contains('music-player--on');

  if (isPlayerOn) {
    pause();
  } else {
    play();
  }
});

controls.prev.addEventListener('click', toPrevSong);
controls.next.addEventListener('click', toNextSong);
