import BaseComponent from '@/components/BaseComponent.ts';
import { checkUserWordOrder, isSentenceCorrect, splitIntoWords } from '@/utils/sentenceUtils.ts';
import gameService from '@/services/gameService.ts';
import GameActions from '@/components/game/GameActions/GameActions.ts';
import HintPanel from '@/components/game/hints/HintPanel/HintPanel.ts';
import Header from '@/components/game/Header/Header.ts';
import SentenceBoard from '@/components/game/SentenceBoard/SentenceBoard.ts';
import { HINT_KINDS } from '@/constants.ts';
import type { HintKind, LastCompletedRound } from '@/types/game.ts';
import type { RoundGeometry } from '@/utils/puzzleGeometry.ts';
import statisticsService from '@/services/statisticsService';
import computeRoundGeometry from '@/services/puzzleGeometryMeasurer.ts';
import PuzzleBoardController from '@/components/game/PuzzleBoardController/PuzzleBoardController';
import ResumeBanner from '@/components/game/ResumeBanner/ResumeBanner';
import RoundCompletePanel from '@/components/game/RoundCompletePanel/RoundCompletePanel';

import styles from './GamePage.module.scss';

const ALL_HINT_KINDS = Object.values(HINT_KINDS);

class GamePage extends BaseComponent<HTMLDivElement> {
  private hintPanel: HintPanel;

  private header: Header;

  private mainBlock: BaseComponent<HTMLDivElement>;

  private sentenceBoard: SentenceBoard;

  private gameActions: GameActions;

  private puzzleBoardController: PuzzleBoardController;

  private correctSentence = '';

  private currentRoundGeometry: RoundGeometry | null = null;

  private resumedFrom: LastCompletedRound | null = null;

  private resumeBanner: ResumeBanner | null = null;

  private roundCompletePanel: RoundCompletePanel | null = null;

  constructor() {
    super('div', ['wrapper']);

    this.mainBlock = new BaseComponent('div', [styles.mainBlock]);
    this.sentenceBoard = new SentenceBoard();
    this.puzzleBoardController = new PuzzleBoardController(this.sentenceBoard, () => {
      this.renderCheckButtonState();
    });

    this.applyResumePosition();

    this.header = new Header({
      translation: gameService.settings.translation,
      pronunciation: gameService.settings.pronunciation,
      image: gameService.settings.image,
    });
    this.hintPanel = new HintPanel();

    if (this.resumedFrom) {
      this.resumeBanner = new ResumeBanner(this.resumedFrom.level, this.resumedFrom.roundIndex + 1);
    }

    this.mainBlock.append(this.sentenceBoard.element);
    this.gameActions = new GameActions();

    this.setupEvents();

    const children: (BaseComponent | HTMLElement)[] = this.resumeBanner ? [this.resumeBanner] : [];
    this.append(...children, this.header, this.hintPanel, this.mainBlock, this.gameActions);

    this.init().catch((error: unknown) => {
      throw new Error(`Critical error during game initialization. Reason: ${String(error)}`);
    });
  }

  private applyResumePosition(): void {
    const resumePosition = statisticsService.getResumePosition();
    if (!resumePosition) return;

    gameService.setLevel(resumePosition.level);
    gameService.setRound(resumePosition.roundIndex);
    this.resumedFrom = resumePosition;
  }

  private async init() {
    await gameService.loadCurrentLevel();
    await this.startNewRound();
  }

  private async startNewRound(): Promise<void> {
    this.puzzleBoardController.resetRound();
    gameService.resetRoundResults();
    this.sentenceBoard.clearPicture();
    this.currentRoundGeometry = await this.computeGeometryForCurrentRound();
    this.sentenceBoard.setBoardWidth(this.currentRoundGeometry.boardWidth);
    const pictureHeight = this.currentRoundGeometry.rowHeight * gameService.getSentenceCountInCurrentRound();
    this.sentenceBoard.reservePictureHeight(pictureHeight);

    this.clearContainers();
    this.renderNextSentence();
  }

  private handleSelectionChange(): void {
    this.init().catch((error: unknown) => {
      throw new Error(`Failed to restart the game with new level/round. Reason: ${String(error)}`);
    });
  }

  private advanceToNextSentence(): void {
    this.puzzleBoardController.freezeResultRow();
    this.sentenceBoard.freezeCurrentResultRow();
    this.clearContainers();
    this.renderNextSentence();
  }

  private renderNextSentence(): void {
    this.hintPanel.stopAudio();
    gameService.setChecked(false);
    this.correctSentence = gameService.getCurrentSentence();

    const currentTranslation = gameService.getCurrentSentenceTranslation();
    this.renderHint(currentTranslation);
    this.hintPanel.setAudioSource(gameService.getCurrentSentenceAudio());

    const words = splitIntoWords(this.correctSentence);
    this.renderSourcePuzzles(words);

    this.renderState();
  }

  private renderHint(currentTranslation: string): void {
    this.hintPanel.setTranslation(currentTranslation);
  }

  private renderState(): void {
    this.renderActionsState();
    ALL_HINT_KINDS.forEach((kind) => {
      this.renderHintKindVisibility(kind);
    });
    this.renderCheckButtonState();
  }

  private renderActionsState(): void {
    const isSentenceChecked = gameService.gameState.isChecked;

    this.gameActions.setVisibility({
      check: !isSentenceChecked,
      continue: isSentenceChecked,
      autoComplete: !isSentenceChecked,
    });
  }

  private renderSourcePuzzles(words: string[]): void {
    if (!this.currentRoundGeometry) {
      throw new Error('Round geometry is not computed yet');
    }

    this.puzzleBoardController.initSentence(words, this.currentRoundGeometry);
  }

  private async computeGeometryForCurrentRound(): Promise<RoundGeometry> {
    const sentences = gameService.getSentencesInCurrentRound().map((sentence) => splitIntoWords(sentence));
    const referenceWidth = this.sentenceBoard.getReferenceWidth();
    const maxAllowedWidth = this.sentenceBoard.getMaxAllowedWidth();
    const { width: imageWidth, height: imageHeight } = await gameService.getCurrentImageDimensions();

    return computeRoundGeometry(sentences, referenceWidth, maxAllowedWidth, imageHeight / imageWidth);
  }

  private setupEvents() {
    ALL_HINT_KINDS.forEach((kind) => {
      this.header.hintControls.getToggleButton(kind).handleClick(() => {
        const isEnabled = gameService.toggleHint(kind);
        this.header.hintControls.setToggleLabel(kind, isEnabled);

        this.renderHintKindVisibility(kind);
      });
    });

    this.header.onSelectionChange(() => {
      this.handleSelectionChange();
    });

    this.gameActions.continueButton.handleClick(() => {
      this.handleNextStep();
    });

    this.gameActions.checkButton.handleClick(() => {
      this.checkResultSentence();
      this.highlightWords();
    });

    this.gameActions.autoCompleteButton.handleClick(() => {
      this.handleAutoComplete();
    });
  }

  private highlightWords() {
    const userWords = this.puzzleBoardController.getResultWords();
    const correctWords = this.correctSentence.split(' ');

    const wordHighlightMask = checkUserWordOrder(userWords, correctWords);

    this.puzzleBoardController.highlightErrors(wordHighlightMask);
  }

  private checkResultSentence(): void {
    const resultSentence = this.puzzleBoardController.getResultSentence();

    if (isSentenceCorrect(resultSentence, this.correctSentence)) {
      gameService.setChecked(true);
      gameService.recordSentenceResult(this.correctSentence, true);
      this.renderState();
    }
  }

  private renderHintKindVisibility(kind: HintKind): void {
    if (kind === HINT_KINDS.IMAGE) {
      this.renderImageHintVisibility();
      return;
    }

    this.hintPanel.setHintVisible(kind, gameService.shouldRevealHint(kind));
  }

  private renderImageHintVisibility(): void {
    const shouldBeVisible = gameService.shouldRevealHint('image');

    this.puzzleBoardController.setImageVisible(shouldBeVisible);
  }

  private renderCheckButtonState() {
    this.gameActions.setCheckDisabled(!this.puzzleBoardController.isSourceEmpty());
  }

  private handleAutoComplete(): void {
    if (gameService.gameState.isChecked) return;

    const correctWords = splitIntoWords(this.correctSentence);

    this.puzzleBoardController.autoComplete(correctWords);

    gameService.setChecked(true);
    gameService.recordSentenceResult(this.correctSentence, false);
    this.renderState();
  }

  private handleNextStep() {
    const isRoundEnd = gameService.isLastSentenceInRound();

    if (isRoundEnd) {
      this.handleRoundEnd();
      return;
    }

    const hasNextStep = gameService.nextStep();

    if (!hasNextStep) {
      window.location.hash = '/';
      return;
    }

    this.advanceToNextSentence();
  }

  private handleRoundEnd(): void {
    const { level, roundIndex } = gameService.gameState;
    const roundsCount = gameService.currentLevelData?.roundsCount ?? 0;
    const imageInfo = gameService.getCurrentImageInfo();

    statisticsService.markRoundCompleted(level, roundIndex, roundsCount);

    const hasNextStep = gameService.nextStep();
    gameService.setRoundHasNextStep(hasNextStep);

    this.gameActions.setVisibility({ check: false, continue: false, autoComplete: false });
    this.puzzleBoardController.revealRoundImage();
    this.showRoundCompletePanel(imageInfo, hasNextStep);
  }

  private showRoundCompletePanel(
    imageInfo: { name: string; author: string; year: string },
    hasNextStep: boolean
  ): void {
    const actionLabel = hasNextStep ? 'Next round' : 'Home';
    this.roundCompletePanel = new RoundCompletePanel(imageInfo, actionLabel);

    this.roundCompletePanel.resultsButton.handleClick(() => {
      window.location.hash = '/statistics';
    });

    this.roundCompletePanel.actionButton.handleClick(() => {
      this.roundCompletePanel?.element.remove();
      this.roundCompletePanel = null;

      if (hasNextStep) {
        this.startNewRound().catch((error: unknown) => {
          throw new Error(`Failed to start a new round. Reason: ${String(error)}`);
        });
      } else {
        window.location.hash = '/';
      }
    });

    this.append(this.roundCompletePanel);
  }

  private clearContainers() {
    this.puzzleBoardController.clear();
  }
}

export default GamePage;
