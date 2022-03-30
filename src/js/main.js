/* eslint-disable import/extensions */
// @ts-check

// |@ 1. Cache the DOM:
import { audio, player } from './dom.js';
import mapNumBetweenRanges from './helpers/mapRange.js';

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
 * @type {import('./helpers/mapRange.js').Scale}
 */
const progressWidthScale = {
  min: 0,
  max: player.durationBar.clientWidth,
};

/**
 * @type {import('./helpers/mapRange.js').Scale}
 */
const percentageScale = { min: 0, max: 100 };

/**
 * @type {import('./helpers/mapRange.js').Scale}
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
  const pathToDir = ['.', 'src', 'assets', 'playlist', song].join('/');

  /**
   * @type {Promise}
   */
  const loadAudio = new Promise((resolve) => {
    audio.source.src = `${pathToDir}/${song}.mp3`;
    audio.source.oncanplay = () => {
      resolve();
    };
  });

  /**
   * @type {Promise}
   */
  const loadImage = new Promise((resolve) => {
    audio.cover.src = `${pathToDir}/${song}.jpg`;
    audio.cover.onload = () => {
      resolve();
    };
  });

  /**
   * @type {Promise}
   */
  Promise.all([loadAudio, loadImage]).then(() => {
    audio.title.innerText = song.replace(/_/g, ' ');
  });
};

/**
 * @returns {void}
 */
const play = () => {
  audio.source.play()
    .catch((err) => {
      if (!err.message.includes('The play() request was interrupted by a new load request')) {
        audio.source.pause();
      }
    });
};

/**
 * @returns {void}
 */
const pause = () => {
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
 * @param {Object} e
 * @param {HTMLAudioElement} e.target
 * @returns {void}
 */
const updateProgress = ({ target: { duration, currentTime } }) => {
  requestAnimationFrame(() => {
    /**
     * @type {import('./helpers/mapRange.js').Scale}
     */
    const durationScale = {
      min: 0,
      max: duration,
    };

    /**
     * @type {Number}
     */
    const current = mapNumBetweenRanges(durationScale, percentageScale, currentTime) || 0;

    document.documentElement.style.setProperty(
      '--progress',
      `${Math.round(current)}%`,
    );
  });
};

/**
 * @param {PointerEvent} e
 * @returns {void}
 */
const setProgress = (e) => {
  requestAnimationFrame(() => {
    /**
     * @type {import('./helpers/mapRange.js').Scale}
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
  });
};

/**
 * @param {PointerEvent} e
 * @returns {void}
 */
const setVolume = (e) => {
  requestAnimationFrame(() => {
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
  });
};

// |@ 4. Set default actions and event listeners:
changeAudioTo(playlist.all[playlist.indexOfCurrent]);

audio.source.onplaying = () => {
  player.isOn = !audio.source.paused;

  if (player.isOn) {
    player.container.classList.add('music-player--on');

    player.toggleButtonIcon.classList.remove('fa-play');
    player.toggleButtonIcon.classList.add('fa-pause');
  }
};

audio.source.onpause = () => {
  player.isOn = !audio.source.paused;

  if (!player.isOn) {
    player.container.classList.remove('music-player--on');

    player.toggleButtonIcon.classList.remove('fa-pause');
    player.toggleButtonIcon.classList.add('fa-play');
  }
};

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
