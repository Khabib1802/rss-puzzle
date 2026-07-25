import Button from '@/components/ui/Button/Button.ts';
import BaseComponent from '@/components/BaseComponent';

import styles from './GameActions.module.scss';

interface GameActionsVisibilityState {
  check: boolean;
  continue: boolean;
  autoComplete: boolean;
}

class GameActions extends BaseComponent<HTMLDivElement> {
  public readonly checkButton: Button;

  public readonly autoCompleteButton: Button;

  public readonly continueButton: Button;

  constructor() {
    super('div', [styles.actions]);

    this.checkButton = new Button({ text: 'Check', additionalClasses: [styles.checkButton] });
    this.autoCompleteButton = new Button({ text: 'Auto-Complete', additionalClasses: [styles.autoCompleteButton] });
    this.continueButton = new Button({ text: 'Continue', additionalClasses: [styles.continueButton, styles.hidden] });

    this.append(this.checkButton, this.autoCompleteButton, this.continueButton);
  }

  public setCheckDisabled(state: boolean): void {
    this.checkButton.setDisabled(state);
  }

  public setVisibility({ check, continue: showContinue, autoComplete }: GameActionsVisibilityState): void {
    this.checkButton.element.classList.toggle(styles.hidden, !check);
    this.continueButton.element.classList.toggle(styles.hidden, !showContinue);
    this.autoCompleteButton.element.classList.toggle(styles.hidden, !autoComplete);
  }
}

export default GameActions;
