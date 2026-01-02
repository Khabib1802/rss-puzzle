import styles from './Entry.module.scss';

import Button from '../../components/Button/Button.ts';
import Input from '../../components/Input/Input.ts';
import type { Page } from '../../types/interfaces.ts';

class Entry implements Page {
  private wrapper: HTMLDivElement;

  private nameInput: Input;

  private surnameInput: Input;

  private button: Button;

  private handleClick: () => void;

  constructor(handleClick: () => void) {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(styles.wrapper);
    this.nameInput = new Input({ label: 'Enter Your First Name', required: true, placeholder: 'name', minLength: 3 });
    this.surnameInput = new Input({
      label: 'Enter Your Surname',
      required: true,
      placeholder: 'surname',
      minLength: 4,
    });
    this.button = new Button('Login', ['login']);
    this.handleClick = handleClick;
    this.setupEvents();
    this.render();
  }

  private setupEvents() {
    this.button.setDisabled(true);

    const validateInputs = () => {
      if (this.nameInput.isValid() && this.surnameInput.isValid()) {
        this.button.setDisabled(false);
      } else {
        this.button.setDisabled(true);
      }
    };

    this.nameInput.handleInput(validateInputs);
    this.surnameInput.handleInput(validateInputs);

    this.button.handleClick(() => {
      this.handleClick();
    });
  }

  private render() {
    this.wrapper.append(this.nameInput.getElement(), this.surnameInput.getElement(), this.button.getElement());
  }

  public getElement() {
    return this.wrapper;
  }
}

export default Entry;
