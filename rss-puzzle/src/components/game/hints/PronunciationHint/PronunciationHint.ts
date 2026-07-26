import { Volume2 } from 'lucide';
import Button from '@/components/ui/Button/Button';
import BaseComponent from '@/components/BaseComponent';

import styles from './PronunciationHint.module.scss';

export type PronunciationHintSize = 'sm' | 'md';

export interface PronunciationHintProps {
  size?: PronunciationHintSize;
}

class PronunciationHint extends BaseComponent<HTMLDivElement> {
  private readonly playButton: Button;

  private currentAudio: HTMLAudioElement | null = null;

  private audioSrc = '';

  constructor(props: PronunciationHintProps = {}) {
    super('div', [styles.hint]);

    const size = props.size ?? 'md';

    this.playButton = new Button({
      variant: 'secondary',
      icon: Volume2,
      ariaLabel: 'Play pronunciation',
      additionalClasses: [styles.playButton, styles[size]],
    });

    const wave1 = document.createElement('div');
    wave1.classList.add(styles.wave);
    const wave2 = document.createElement('div');
    wave2.classList.add(styles.wave);
    this.playButton.element.append(wave1, wave2);

    this.playButton.handleClick(() => {
      this.play();
    });

    this.append(this.playButton);
  }

  public setAudioSource(src: string): void {
    this.audioSrc = src;
  }

  public setVisible(show: boolean): void {
    this.element.classList.toggle(styles.hidden, !show);
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
    this.playButton.element.classList.toggle(styles.isPlaying, isPlaying);
  }
}

export default PronunciationHint;
