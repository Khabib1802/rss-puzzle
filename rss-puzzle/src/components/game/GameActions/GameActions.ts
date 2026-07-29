import Button from '@/components/ui/Button/Button.ts';
import BaseComponent from '@/components/BaseComponent';

import { ArrowRight, SquareCheckBig, X } from 'lucide';
import styles from './GameActions.module.scss';

const CHECK_SUCCESS_DURATION_MS = 450;

class GameActions extends BaseComponent<HTMLDivElement> {
  public readonly checkButton: Button;

  public readonly autoCompleteButton: Button;

  public readonly continueButton: Button;

  private readonly preCheckGroup: BaseComponent<HTMLDivElement>;

  private readonly postCheckGroup: BaseComponent<HTMLDivElement>;

  constructor() {
    super('div', [styles.actions]);

    this.autoCompleteButton = new Button({
      text: 'Skip',
      variant: 'danger',
      icon: X,
      iconPosition: 'right',
    });
    this.checkButton = new Button({
      text: 'Check',
      variant: 'success',
      icon: SquareCheckBig,
      iconPosition: 'right',
    });
    this.continueButton = new Button({
      text: 'Continue',
      variant: 'primary',
      icon: ArrowRight,
      iconPosition: 'right',
    });

    this.preCheckGroup = new BaseComponent('div', [styles.group]);
    this.preCheckGroup.append(this.autoCompleteButton, this.checkButton);

    this.postCheckGroup = new BaseComponent('div', [styles.group, styles.hidden]);
    this.postCheckGroup.append(this.continueButton);

    this.append(this.preCheckGroup, this.postCheckGroup);
  }

  public setCheckDisabled(state: boolean): void {
    this.checkButton.setDisabled(state);
  }

  public setChecked(isChecked: boolean): void {
    this.preCheckGroup.element.classList.toggle(styles.hidden, isChecked);
    this.postCheckGroup.element.classList.toggle(styles.hidden, !isChecked);
  }

  public hideAll(): void {
    this.preCheckGroup.element.classList.add(styles.hidden);
    this.postCheckGroup.element.classList.add(styles.hidden);
  }

  public playCheckSuccess(onComplete: () => void): void {
    this.checkButton.element.classList.add(styles.checkSuccess);

    window.setTimeout(() => {
      this.checkButton.element.classList.remove(styles.checkSuccess);
      onComplete();
    }, CHECK_SUCCESS_DURATION_MS);
  }
}

export default GameActions;
