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
export const player = {
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
