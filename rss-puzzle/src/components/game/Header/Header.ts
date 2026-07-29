import gameService from '@/services/gameService.ts';
import { removeUser } from '@/services/userService.ts';
import type { HintKind } from '@/types/game.ts';
import Button from '@/components/ui/Button/Button.ts';
import Select, { type SelectOption } from '@/components/ui/Select/Select.ts';
import BaseComponent from '@/components/BaseComponent';
import { LEVELS_COUNT } from '@/constants';
import statisticsService from '@/services/statisticsService';
import { Home, LogOut } from 'lucide';
import HintControls from '../hints/HintControls/HintControls';
import HintPanel from '../hints/HintPanel/HintPanel';
import RoundStepper from '../RoundStepper/RoundStepper';

import styles from './Header.module.scss';

class Header extends BaseComponent<HTMLDivElement> {
  public readonly hintControls: HintControls;

  public readonly hintPanel: HintPanel;

  public roundStepper: RoundStepper | null = null;

  private readonly homeButton: Button;

  private readonly logoutButton: Button;

  private readonly levelSelect: Select;

  private readonly roundSelect: Select;

  private readonly progressRow: BaseComponent<HTMLDivElement>;

  private onSelectionChangeCallback: (() => void) | null = null;

  constructor(initialHintStates: Record<HintKind, boolean>) {
    super('div', [styles.header]);

    this.homeButton = new Button({
      variant: 'secondary',
      size: 'sm',
      icon: Home,
      ariaLabel: 'Go to start page',
    });
    this.logoutButton = new Button({
      variant: 'secondary',
      size: 'sm',
      icon: LogOut,
      ariaLabel: 'Log out',
    });
    this.levelSelect = new Select(Header.buildLevelOptions(), [styles.select]);
    this.roundSelect = new Select([], [styles.select]);
    this.hintControls = new HintControls(initialHintStates);
    this.hintPanel = new HintPanel();

    this.levelSelect.setValue(String(gameService.gameState.level));

    const navRow = new BaseComponent<HTMLDivElement>('div', [styles.navRow]);
    navRow.append(this.buildSelectGroup(), this.buildNavActions());

    this.progressRow = new BaseComponent('div', [styles.progressRow]);

    const hintsRow = new BaseComponent<HTMLDivElement>('div', [styles.hintsRow]);
    hintsRow.append(this.hintControls, this.hintPanel);

    this.setupEvents();
    this.append(navRow, this.progressRow, hintsRow);

    this.refreshRoundOptions().catch((error: unknown) => {
      throw new Error(`Failed to load rounds list. Reason: ${String(error)}`);
    });

    statisticsService.subscribe(() => {
      this.levelSelect.setOptions(Header.buildLevelOptions());
      this.roundSelect.setOptions(
        Header.buildRoundOptions(this.roundSelect.getOptionsCount(), gameService.gameState.level)
      );
    });
  }

  public setRoundSteps(totalSteps: number): void {
    this.roundStepper?.element.remove();
    this.roundStepper = new RoundStepper(totalSteps);
    this.progressRow.append(this.roundStepper);
  }

  public onSelectionChange(callback: () => void): void {
    this.onSelectionChangeCallback = callback;
  }

  private buildSelectGroup(): BaseComponent<HTMLDivElement> {
    const levelField = new BaseComponent<HTMLDivElement>('div', [styles.field]);
    const levelLabel = document.createElement('span');
    levelLabel.classList.add(styles.fieldLabel);
    levelLabel.textContent = 'Level';
    levelField.append(levelLabel, this.levelSelect);

    const roundField = new BaseComponent<HTMLDivElement>('div', [styles.field]);
    const roundLabel = document.createElement('span');
    roundLabel.classList.add(styles.fieldLabel);
    roundLabel.textContent = 'Round';
    roundField.append(roundLabel, this.roundSelect);

    const divider = document.createElement('div');
    divider.classList.add(styles.fieldDivider);

    const group = new BaseComponent<HTMLDivElement>('div', [styles.selectGroup]);
    group.append(levelField, divider, roundField);
    return group;
  }

  private buildNavActions(): BaseComponent<HTMLDivElement> {
    const navActions = new BaseComponent<HTMLDivElement>('div', [styles.navActions]);
    navActions.append(this.homeButton, this.logoutButton);
    return navActions;
  }

  private static buildLevelOptions(): SelectOption[] {
    return Array.from({ length: LEVELS_COUNT }, (_, index) => {
      const level = index + 1;
      return {
        value: String(level),
        label: `Level ${String(level)}`,
        isCompleted: statisticsService.isLevelCompleted(level),
      };
    });
  }

  private static buildRoundOptions(roundsCount: number, level: number): SelectOption[] {
    return Array.from({ length: roundsCount }, (_, index) => ({
      value: String(index),
      label: `Round ${String(index + 1)}`,
      isCompleted: statisticsService.isRoundCompleted(level, index),
    }));
  }

  private async refreshRoundOptions(): Promise<void> {
    this.roundSelect.setDisabled(true);

    const roundsCount = await gameService.getRoundsCount(gameService.gameState.level);

    this.roundSelect.setOptions(Header.buildRoundOptions(roundsCount, gameService.gameState.level));
    this.roundSelect.setValue(String(gameService.gameState.roundIndex));
    this.roundSelect.setDisabled(false);
  }

  private setupEvents(): void {
    this.homeButton.handleClick(() => {
      window.location.hash = '/';
    });

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
