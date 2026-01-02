import type { User } from '../types/interfaces.ts';

class localStorageService {
  public static saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export default localStorageService;
