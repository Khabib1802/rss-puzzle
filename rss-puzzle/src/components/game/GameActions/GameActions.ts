import styles from './GameActions.module.scss';

import BaseComponent from '../../BaseComponent.ts';
import Button from '../../ui/Button/Button.ts';

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
    super('div', [styles['actions']]);

    this.checkButton = new Button('Check', [styles['checkButton']]);
    this.autoCompleteButton = new Button('Auto-Complete', [styles['autoCompleteButton']]);
    this.continueButton = new Button('Continue', [styles['continueButton'], styles['hidden']]);

    this.append(this.checkButton, this.autoCompleteButton, this.continueButton);
  }

  public setCheckDisabled(state: boolean): void {
    this.checkButton.setDisabled(state);
  }

  public setVisibility({ check, continue: showContinue, autoComplete }: GameActionsVisibilityState): void {
    this.checkButton.element.classList.toggle(styles['hidden'], !check);
    this.continueButton.element.classList.toggle(styles['hidden'], !showContinue);
    this.autoCompleteButton.element.classList.toggle(styles['hidden'], !autoComplete);
  }
}

export default GameActions;
