import { Lightbulb, Volume2, Image as ImageIcon, type IconNode } from 'lucide';

import type { HintKind } from '@/types/game.ts';
import Button from '@/components/ui/Button/Button.ts';
import BaseComponent from '@/components/BaseComponent';
import { HINT_KINDS } from '@/constants';

import styles from './HintControls.module.scss';

const TOGGLE_ICONS: Record<HintKind, IconNode> = {
  translation: Lightbulb,
  pronunciation: Volume2,
  image: ImageIcon,
};

const TOGGLE_LABELS: Record<HintKind, string> = {
  translation: 'Hint',
  pronunciation: 'Audio hint',
  image: 'Image hint',
};

class HintControls extends BaseComponent<HTMLDivElement> {
  private readonly toggleButtons: Record<HintKind, Button>;

  constructor(initialHintStates: Record<HintKind, boolean>) {
    super('div', [styles.controls]);

    this.toggleButtons = {
      translation: HintControls.createToggleButton(HINT_KINDS.TRANSLATION, initialHintStates.translation),
      pronunciation: HintControls.createToggleButton(HINT_KINDS.PRONUNCIATION, initialHintStates.pronunciation),
      image: HintControls.createToggleButton(HINT_KINDS.IMAGE, initialHintStates.image),
    };

    this.append(this.toggleButtons.translation, this.toggleButtons.pronunciation, this.toggleButtons.image);
  }

  private static createToggleButton(kind: HintKind, initialState: boolean): Button {
    return new Button({
      icon: TOGGLE_ICONS[kind],
      active: initialState,
      variant: 'secondary',
      ariaLabel: TOGGLE_LABELS[kind],
      additionalClasses: [styles.toggleButton],
    });
  }

  public getToggleButton(kind: HintKind): Button {
    return this.toggleButtons[kind];
  }

  public setToggleState(kind: HintKind, isEnabled: boolean): void {
    this.toggleButtons[kind].setActive(isEnabled);
  }
}

export default HintControls;
