interface Page {
  getElement(): HTMLElement;
}

interface User {
  firstName: string;
  surname: string;
}

export type { Page, User };
