import { CheckCheck, createElement } from 'lucide';
import BaseComponent from '@/components/BaseComponent';
import styles from './RoundStepper.module.scss';

type StepResult = 'done' | 'skipped';

const PREVIOUS_STEP_OFFSET = 2;

class RoundStepper extends BaseComponent<HTMLDivElement> {
  private readonly steps: HTMLElement[];

  private readonly finalStep: HTMLElement;

  private readonly connectors: HTMLElement[];

  private readonly results: (StepResult | null)[];

  constructor(totalSteps: number) {
    super('div', [styles.stepper]);

    this.steps = [];
    this.connectors = [];

    for (let i = 1; i <= totalSteps; i += 1) {
      if (i > 1) {
        const connector = document.createElement('div');
        connector.classList.add(styles.connector);
        this.connectors.push(connector);
        this.element.append(connector);
      }

      const step = document.createElement('div');
      step.classList.add(styles.step, styles.idle);
      step.textContent = String(i);
      this.steps.push(step);
      this.element.append(step);
    }

    const finalConnector = document.createElement('div');
    finalConnector.classList.add(styles.connector);
    this.connectors.push(finalConnector);
    this.element.append(finalConnector);

    const checkIcon = createElement(CheckCheck);
    checkIcon.setAttribute('width', '18');
    checkIcon.setAttribute('height', '18');
    checkIcon.setAttribute('stroke-width', '2');
    this.finalStep = document.createElement('div');
    this.finalStep.classList.add(styles.step, styles.final, styles.idle);
    this.finalStep.append(checkIcon);
    this.element.append(this.finalStep);

    this.results = Array.from({ length: totalSteps }, () => null);
  }

  public setStep(current: number, lastResult?: StepResult): void {
    if (lastResult !== undefined && current >= PREVIOUS_STEP_OFFSET) {
      this.results[current - PREVIOUS_STEP_OFFSET] = lastResult;
    }

    this.steps.forEach((step, index) => {
      step.classList.remove(styles.done, styles.skipped, styles.current, styles.idle);

      if (index < current - 1) {
        const result = this.results[index];
        step.classList.add(result === 'skipped' ? styles.skipped : styles.done);
      } else if (index === current - 1) {
        step.classList.add(styles.current);
      } else {
        step.classList.add(styles.idle);
      }
    });

    this.finalStep.classList.remove(styles.done, styles.idle);
    this.finalStep.classList.add(current > this.steps.length ? styles.done : styles.idle);

    this.updateConnectors(current);
  }

  private updateConnectors(current: number): void {
    this.connectors.forEach((connector, index) => {
      connector.classList.remove(
        styles.connectorDone,
        styles.connectorSkipped,
        styles.connectorCurrent,
        styles.connectorIdle
      );

      const leftIndex = index - 1;
      const rightIndex = index;

      const leftResult = leftIndex >= 0 ? this.results[leftIndex] : null;
      const rightResult = rightIndex < this.results.length ? this.results[rightIndex] : null;

      const leftDone = index < current - 1;
      const leftCurrent = index === current - 1;

      if (!leftDone && !leftCurrent) {
        connector.classList.add(styles.connectorIdle);
      } else if (leftCurrent) {
        connector.classList.add(styles.connectorCurrent);
      } else if (leftResult === 'skipped' || rightResult === 'skipped') {
        connector.classList.add(styles.connectorSkipped);
      } else {
        connector.classList.add(styles.connectorDone);
      }
    });
  }
}

export default RoundStepper;
