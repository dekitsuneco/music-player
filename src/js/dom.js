// @ts-check

/**
 * @typedef {Object} Controls
 * @property {HTMLElement} prev
 * @property {HTMLElement} play
 * @property {HTMLElement} next
 */

/**
 * @type {Object}
 * @param {HTMLAudioElement} source
 * @param {HTMLElement} source
 * @param {HTMLImageElement} source
 */
export const audio = {
  source: document.querySelector('.music-player__audio'),
  title: document.querySelector('.audio-meta__title'),
  cover: document.querySelector('.audio-cover__disk img'),
};

/**
 * @type {Object} player
 * @param {Boolean} isOn
 * @param {HTMLElement} container
 * @param {Object} container
 * @param {Controls} controls
 * @param {HTMLElement} toggleButtonIcon
 * @param {HTMLElement} durationBar
 * @param {HTMLMeterElement} volumeBar
 * @param {Function} changeVolume
 */
export const player = {
  isOn: false,
  container: document.querySelector('.music-player'),
  controls: {
    prev: document.querySelector('.controls__previous'),
    play: document.querySelector('.controls__play'),
    next: document.querySelector('.controls__next'),
  },
  toggleButtonIcon: document.querySelector('.controls__play i.fas'),
  durationBar: document.querySelector('.audio-meta__progress-bar'),
  volumeBar: document.querySelector('.music-player__audio-volume'),
  changeVolume() {
    audio.source.volume = this.volumeBar.value / 100;
  },
};
