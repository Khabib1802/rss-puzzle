import type { User } from '../types/user';

class localStorageService {
  public static saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public static removeUser(): void {
    localStorage.removeItem('user');
  }

  public static getUser(): string | null {
    return localStorage.getItem('user');
  }

  public static hasUser() {
    return this.getUser() !== null;
  }
}

export default localStorageService;
