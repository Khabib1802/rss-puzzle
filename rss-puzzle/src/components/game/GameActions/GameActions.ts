import Button from '@/components/ui/Button/Button.ts';
import BaseComponent from '@/components/BaseComponent';

import { ArrowRight, SquareCheckBig, X } from 'lucide';
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

    this.append(this.autoCompleteButton, this.checkButton, this.continueButton);
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
