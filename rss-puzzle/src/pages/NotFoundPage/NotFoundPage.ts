import BaseComponent from '@/components/BaseComponent';
import Button from '@/components/ui/Button/Button';
import { ArrowLeft } from 'lucide';

class NotFoundPage extends BaseComponent<HTMLDivElement> {
  private title: BaseComponent<HTMLHeadingElement>;

  private text: BaseComponent<HTMLParagraphElement>;

  private button: Button;

  constructor() {
    super('div', ['wrapper']);
    this.title = new BaseComponent('h1');
    this.title.element.textContent = '404: Not Found';

    this.text = new BaseComponent('p');
    this.text.element.textContent = "Oops! It looks like you're lost";

    this.button = new Button({ text: 'Back', variant: 'primary', icon: ArrowLeft });
    this.button.handleClick(() => {
      window.location.hash = '/';
    });

    this.append(this.title, this.text, this.button);
  }
}

export default NotFoundPage;
