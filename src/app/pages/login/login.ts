import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  UUID = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const response = await fetch('https://sociaal.hiddebalestra.nl/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UUID: this.UUID,
          password: this.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Serverfout: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('jwt', data.token);
        this.authService.scheduleAutoLogout();
        this.router.navigate(['/']).then();
      } else {
        console.error('Geen token ontvangen:', data);
      }
    } catch (error) {
      console.error('Login fout:', error);
    }
  }
}
