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
const audioPanel = document.querySelector('.music-player__audio');

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
 *@todo Define a song list as an array of their titles
 */
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
 * @type {Array<string>}
 */
const songs = ['Pyrite', 'Pinesoot'];

console.assert(songs instanceof Array, 'Song list is not array');
console.assert(
  songs.every((song) => typeof song === 'string'),
  'Song list is not array of strings',
);

// 3. Define functions:
/**
 *@todo Define a function for song loading (update song src, cover, title)
 *@todo Define a function to play song
 *@todo Define a function to pause song
 *@todo Define a function to map the range of a song duration to a scale of 100
 *@todo Define a function to map the range of the bar width to a song duration
 *@todo Define a function to update the progress bar
 *@todo Define a function to update the progress bar on clicking
 */
// changeCurrentSongTo(song): void
// play(song): void
// pause(song): void
// toPreviosSong(): void
// toNextSong(): void
// updateProgress(e): void
// updateProgressManually(e): void
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
/**
 *@todo Set an event listener on playbtn (toggle player class, and call play/pause song function)
 *@todo Set an event listener on nextbtn to change the song
 *@todo Set an event listener on prevbtn to change the song
 */
