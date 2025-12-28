import '../styles/global.scss';

export default class App {
  private body: HTMLElement;

  private main: HTMLElement;

  constructor() {
    this.body = document.body;
    this.main = document.createElement('main');

    this.body.append(this.main);
  }

  public start(): void {
    this.renderPage();
  }

  private renderPage(): void {
    console.log(this.main);
  }
}
