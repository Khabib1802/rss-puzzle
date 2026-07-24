import Button from '@/components/ui/Button/Button.ts';
import Input from '@/components/ui/Input/Input.ts';
import BaseComponent from '@/components/BaseComponent.ts';
import { saveUser } from '@/services/userService.ts';

class EntryPage extends BaseComponent<HTMLDivElement> {
  private title: BaseComponent<HTMLHeadingElement>;

  private inputWrapper: BaseComponent<HTMLDivElement>;

  private nameInput: Input;

  private surnameInput: Input;

  private loginButton: Button;

  constructor() {
    super('div', ['wrapper']);

    this.title = new BaseComponent('h1', ['title']);
    this.title.element.textContent = 'RSS Puzzle';

    this.inputWrapper = new BaseComponent('div');

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

    this.inputWrapper.append(this.nameInput, this.surnameInput);

    this.loginButton = new Button('Login', ['login']);

    this.setupEvents();

    this.append(this.title, this.inputWrapper, this.loginButton);
  }

  private setupEvents() {
    this.loginButton.setDisabled(true);

    const validateInputs = () => {
      if (this.nameInput.isValid() && this.surnameInput.isValid()) {
        this.loginButton.setDisabled(false);
      } else {
        this.loginButton.setDisabled(true);
      }
    };

    this.nameInput.handleInput(validateInputs);
    this.surnameInput.handleInput(validateInputs);

    this.loginButton.handleClick(() => {
      saveUser({
        firstName: this.nameInput.getValue(),
        surname: this.surnameInput.getValue(),
      });

      window.location.hash = '/';
    });
  }
}

export default EntryPage;
