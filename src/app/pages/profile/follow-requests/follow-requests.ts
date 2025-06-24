import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-follow-requests',
  imports: [],
  templateUrl: './follow-requests.html',
  styleUrl: './follow-requests.scss'
})
export class FollowRequests implements OnInit {
  requests: any[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    fetch(`https://sociaal.hiddebalestra.nl/get_follow_requests.php?userID=${this.authService.getUserID()}`)
      .then(res => res.json())
      .then(data => this.requests = data);
  }

  approve(requesterId: number) {
    fetch('https://sociaal.hiddebalestra.nl/approve_follow.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requester_id: requesterId,
        requested_id: Number(this.authService.getUserID())
      })
    })
      .then(() => {
        this.requests = this.requests.filter((r: any) => r.requester_id !== requesterId);
      });
  }
}
