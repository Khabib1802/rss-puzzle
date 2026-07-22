import styles from './PronunciationHint.module.scss';

import BaseComponent from '../BaseComponent';
import Button from '../Button/Button';

class PronunciationHint extends BaseComponent<HTMLDivElement> {
  private readonly playButton: Button;

  private currentAudio: HTMLAudioElement | null = null;

  private audioSrc = '';

  constructor() {
    super('div', [styles['hint']]);

    this.playButton = new Button('🔊', [styles['playButton']]);
    this.playButton.handleClick(() => {
      this.play();
    });

    this.append(this.playButton);
  }

  public setAudioSource(src: string): void {
    this.audioSrc = src;
  }

  public stop(): void {
    if (!this.currentAudio) return;

    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
    this.currentAudio = null;
  }

  private play(): void {
    if (!this.audioSrc) return;

    this.stop();

    this.currentAudio = new Audio(this.audioSrc);
    this.currentAudio.play().catch(() => {});
  }
}

export default PronunciationHint;
