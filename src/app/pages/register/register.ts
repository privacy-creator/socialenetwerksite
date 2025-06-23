import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CaptchaService} from '../../services/captcha-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  username = '';
  password = '';

  constructor(protected readonly captchaService: CaptchaService, private router: Router) {}

  ngOnInit() {
    this.captchaService.generateCaptcha();
  }

  async register() {
    if (this.captchaService.userCaptchaInput !== this.captchaService.captchaAnswer) {
      alert('CAPTCHA. Forbidden for Robot Jetten.');
      this.captchaService.generateCaptcha();
      return;
    }
    if (this.username.trim() === '' && this.password.trim() === '') {
      alert('Username and/or password must be filled in. Please try again.');
    }

    try {
      const response = await fetch('https://sociaal.hiddebalestra.nl/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          captchaInput: this.captchaService.userCaptchaInput,
          captchaAnswer: this.captchaService.captchaAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registratie mislukt');
      }

      this.captchaService.generateCaptcha();
      this.router.navigate(['/login']).then();
    } catch (error) {
      if (error instanceof Error) {
        alert('Fout: ' + error.message);
      } else {
        alert('Er is een onbekende fout opgetreden.');
      }
    }
  }
}
