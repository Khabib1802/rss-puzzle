import Button from '../../components/Button/Button.ts';
import Input from '../../components/Input/Input.ts';
import type { Page } from '../../types/interfaces.ts';
import localStorageService from '../../services/localStorageService.ts';

class Entry implements Page {
  private wrapper: HTMLDivElement;

  private title: HTMLHeadingElement;

  private inputWrapper: HTMLDivElement;

  private nameInput: Input;

  private surnameInput: Input;

  private loginBtn: Button;

  private handleLoginBtn: () => void;

  constructor(handleLoginBtn: () => void) {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('wrapper');

    this.title = document.createElement('h2');
    this.title.textContent = 'RSS Puzzle';

    this.inputWrapper = document.createElement('div');

    this.nameInput = new Input({
      label: 'Enter Your First Name',
      required: true,
      placeholder: 'John',
      minLength: 3,
    });
    this.surnameInput = new Input({
      label: 'Enter Your Surname',
      required: true,
      placeholder: 'Doe',
      minLength: 4,
    });

    this.inputWrapper.append(this.nameInput.getElement(), this.surnameInput.getElement());

    this.loginBtn = new Button('Login', ['login']);
    this.handleLoginBtn = handleLoginBtn;
    this.setupEvents();
    this.render();
  }

  private setupEvents() {
    this.loginBtn.setDisabled(true);

    const validateInputs = () => {
      if (this.nameInput.isValid() && this.surnameInput.isValid()) {
        this.loginBtn.setDisabled(false);
      } else {
        this.loginBtn.setDisabled(true);
      }
    };

    this.nameInput.handleInput(validateInputs);
    this.surnameInput.handleInput(validateInputs);

    this.loginBtn.handleClick(() => {
      localStorageService.saveUser({
        firstName: this.nameInput.getValue(),
        surname: this.surnameInput.getValue(),
      });
      this.handleLoginBtn();
    });
  }

  private render() {
    this.wrapper.append(this.title, this.inputWrapper, this.loginBtn.getElement());
  }

  public getElement() {
    return this.wrapper;
  }
}

export default Entry;
