import Button from '@/components/ui/Button/Button';
import BaseComponent from '@/components/BaseComponent';

import styles from './PronunciationHint.module.scss';

const SPEAKER_ICON_MARKUP = `
  <svg class="${styles['speakerIcon']}" viewBox="5 5 12 15">
    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
  <div class="${styles['wave']}"></div>
  <div class="${styles['wave']}"></div>
`;

class PronunciationHint extends BaseComponent<HTMLDivElement> {
  private readonly playButton: Button;

  private currentAudio: HTMLAudioElement | null = null;

  private audioSrc = '';

  constructor() {
    super('div', [styles['hint']]);

    this.playButton = new Button('', [styles['playButton']]);
    this.playButton.element.innerHTML = SPEAKER_ICON_MARKUP;

    this.playButton.handleClick(() => {
      this.play();
    });

    this.append(this.playButton);
  }

  public setAudioSource(src: string): void {
    this.audioSrc = src;
  }

  public setVisible(show: boolean): void {
    this.element.classList.toggle(styles['hidden'], !show);
  }

  public stop(): void {
    if (!this.currentAudio) return;

    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
    this.currentAudio = null;

    this.setPlayingState(false);
  }

  private play(): void {
    if (!this.audioSrc) return;

    this.stop();

    this.currentAudio = new Audio(this.audioSrc);
    this.currentAudio.addEventListener('play', this.handleAudioPlay);
    this.currentAudio.addEventListener('ended', this.handleAudioEnded);

    this.currentAudio.play().catch(() => {
      this.setPlayingState(false);
    });
  }

  private handleAudioPlay = (): void => {
    this.setPlayingState(true);
  };

  private handleAudioEnded = (): void => {
    this.setPlayingState(false);
  };

  private setPlayingState(isPlaying: boolean): void {
    this.playButton.element.classList.toggle(styles['isPlaying'], isPlaying);
  }
}

export default PronunciationHint;
