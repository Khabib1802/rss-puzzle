import styles from './Header.module.scss';

import BaseComponent from '../BaseComponent.ts';
import Button from '../Button/Button.ts';
import Select, { type SelectOption } from '../Select/Select.ts';
import HintControls from '../HintControls/HintControls.ts';
import gameService from '../../services/gameService.ts';
import { removeUser } from '../../services/userService.ts';
import { LEVELS_COUNT } from '../../constants.ts';
import type { HintKind } from '../../types/game.ts';

class Header extends BaseComponent<HTMLDivElement> {
  public readonly hintControls: HintControls;

  private readonly logoutButton: Button;

  private readonly levelSelect: Select;

  private readonly roundSelect: Select;

  private onSelectionChangeCallback: (() => void) | null = null;

  constructor(initialHintStates: Record<HintKind, boolean>) {
    super('div', [styles['header']]);

    this.logoutButton = new Button('Logout', [styles['logout']]);
    this.levelSelect = new Select(Header.buildLevelOptions(), [styles['select']]);
    this.roundSelect = new Select([], [styles['select']]);
    this.hintControls = new HintControls(initialHintStates);

    this.levelSelect.setValue(String(gameService.gameState.level));

    this.setupEvents();
    this.append(this.logoutButton, this.levelSelect, this.roundSelect, this.hintControls);

    this.refreshRoundOptions().catch((error: unknown) => {
      throw new Error(`Failed to load rounds list. Reason: ${String(error)}`);
    });
  }

  public onSelectionChange(callback: () => void): void {
    this.onSelectionChangeCallback = callback;
  }

  private static buildLevelOptions(): SelectOption[] {
    return Array.from({ length: LEVELS_COUNT }, (_, index) => {
      const level = index + 1;
      return { value: String(level), label: `Level ${String(level)}` };
    });
  }

  private static buildRoundOptions(roundsCount: number): SelectOption[] {
    return Array.from({ length: roundsCount }, (_, index) => ({
      value: String(index),
      label: `Round ${String(index + 1)}`,
    }));
  }

  private async refreshRoundOptions(): Promise<void> {
    this.roundSelect.setDisabled(true);

    const roundsCount = await gameService.getRoundsCount(gameService.gameState.level);

    this.roundSelect.setOptions(Header.buildRoundOptions(roundsCount));
    this.roundSelect.setValue(String(gameService.gameState.roundIndex));
    this.roundSelect.setDisabled(false);
  }

  private setupEvents(): void {
    this.logoutButton.handleClick(() => {
      removeUser();
      gameService.resetHintSettings();
      window.location.hash = '/entry';
    });

    this.levelSelect.onChange((value) => {
      gameService.setLevel(Number(value));
      this.notifySelectionChange();

      this.refreshRoundOptions().catch((error: unknown) => {
        throw new Error(`Failed to load rounds list. Reason: ${String(error)}`);
      });
    });

    this.roundSelect.onChange((value) => {
      gameService.setRound(Number(value));
      this.notifySelectionChange();
    });
  }

  private notifySelectionChange(): void {
    this.onSelectionChangeCallback?.();
  }
}

export default Header;
