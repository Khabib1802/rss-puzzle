import type { HintKind } from '@/types/game.ts';
import Button from '@/components/ui/Button/Button.ts';
import BaseComponent from '@/components/BaseComponent';
import { HINT_KINDS } from '@/constants';

import styles from './HintControls.module.scss';

const TOGGLE_LABELS: Record<HintKind, string> = {
  translation: 'Hint',
  pronunciation: 'Audio hint',
  image: 'Image hint',
};

class HintControls extends BaseComponent<HTMLDivElement> {
  private readonly toggleButtons: Record<HintKind, Button>;

  constructor(initialHintStates: Record<HintKind, boolean>) {
    super('div', [styles['controls']]);

    this.toggleButtons = {
      translation: HintControls.createToggleButton(HINT_KINDS.TRANSLATION, initialHintStates.translation),
      pronunciation: HintControls.createToggleButton(HINT_KINDS.PRONUNCIATION, initialHintStates.pronunciation),
      image: HintControls.createToggleButton(HINT_KINDS.IMAGE, initialHintStates.image),
    };

    this.append(this.toggleButtons.translation, this.toggleButtons.pronunciation, this.toggleButtons.image);
  }

  private static createToggleButton(kind: HintKind, initialState: boolean): Button {
    return new Button(HintControls.getToggleLabel(kind, initialState), [styles['toggleButton']]);
  }

  private static getToggleLabel(kind: HintKind, isEnabled: boolean): string {
    return `${TOGGLE_LABELS[kind]}: ${isEnabled ? 'ON' : 'OFF'}`;
  }

  public getToggleButton(kind: HintKind): Button {
    return this.toggleButtons[kind];
  }

  public setToggleLabel(kind: HintKind, isEnabled: boolean): void {
    this.toggleButtons[kind].setText(HintControls.getToggleLabel(kind, isEnabled));
  }
}

export default HintControls;
