import { CheckCheck, createElement } from 'lucide';
import BaseComponent from '@/components/BaseComponent';
import styles from './RoundStepper.module.scss';

class RoundStepper extends BaseComponent<HTMLDivElement> {
  private readonly steps: HTMLElement[];

  private readonly finalStep: HTMLElement;

  private readonly connectors: HTMLElement[];

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
  }

  public setStep(current: number): void {
    this.steps.forEach((step, index) => {
      step.classList.remove(styles.done, styles.current, styles.idle);

      if (index < current - 1) {
        step.classList.add(styles.done);
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
      connector.classList.remove(styles.connectorDone, styles.connectorCurrent, styles.connectorIdle);

      const leftIsDone = index < current - 1;
      const leftIsCurrent = index === current - 1;
      const rightIsDone = index < current - 1;

      if (leftIsDone && rightIsDone) {
        connector.classList.add(styles.connectorDone);
      } else if (leftIsCurrent || (leftIsDone && !rightIsDone)) {
        connector.classList.add(styles.connectorCurrent);
      } else {
        connector.classList.add(styles.connectorIdle);
      }
    });
  }
}

export default RoundStepper;
