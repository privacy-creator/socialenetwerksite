import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private logoutTimeout: any;

  constructor() {
    this.scheduleAutoLogout();
  }

  private isTokenValid(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && currentTime < payload.exp;
    } catch (e) {
      return false;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token && this.isTokenValid(token);
  }

  logout(): void {
    localStorage.removeItem('jwt');
    clearTimeout(this.logoutTimeout);
    location.reload();
  }

  private parseToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (e) {
      return null;
    }
  }

  getUsername(): string {
    const token = localStorage.getItem('jwt');
    const payload = token ? this.parseToken(token) : null;
    return payload?.username ?? null;
  }

  getUserID(): string {
    const token = localStorage.getItem('jwt');
    const payload = token ? this.parseToken(token) : null;
    return payload?.user_id ?? null;
  }

  scheduleAutoLogout(): void {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const exp = payload.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = (exp - currentTime) * 1000;

      if (timeUntilExpiry > 0) {
        this.logoutTimeout = setTimeout(() => this.logout(), timeUntilExpiry);
      } else {
        this.logout();
      }
    } catch (e) {
      this.logout();
    }
  }

  getProfile(id: number): Promise<any> {
    return fetch(`https://sociaal.hiddebalestra.nl/get_profile.php?id=${id}`)
      .then(res => res.json());
  }
}
