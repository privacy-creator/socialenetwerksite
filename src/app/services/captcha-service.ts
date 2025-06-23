import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  captchaQuestion = '';
  captchaAnswer = '';
  userCaptchaInput = '';

  constructor() { }

  generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    this.captchaQuestion = `What is ${a} + ${b}?`;
    this.captchaAnswer = (a + b).toString();
  }
}
