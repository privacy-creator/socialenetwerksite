import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {FeedList} from '../../parts/feed-list/feed-list';
import {NgClass} from '@angular/common';
import {FollowRequests} from './follow-requests/follow-requests';
import {FormsModule} from '@angular/forms';
import {CaptchaService} from '../../services/captcha-service';

@Component({
  selector: 'app-profile',
  imports: [
    FeedList,
    NgClass,
    FollowRequests,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit{
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    protected readonly captchaService: CaptchaService,
  ) {}

  profile: any;
  isFollowing: boolean = false;
  followStatus: string = '';

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('id');
    const userId = profileId ?? String(this.authService.getUserID());
    this.loadProfile(userId);
    this.checkFollowing(userId);
    this.captchaService.generateCaptcha();
  }

  loadProfile(userId: string | null): void {
    fetch(`https://sociaal.hiddebalestra.nl/get_profile.php?id=${userId}`)
      .then(response => response.json())
      .then(data => {
        this.profile = data;
      })
      .catch(error => console.error('Fout bij ophalen profiel:', error));
  }

  checkFollowing(followedId: string | null): void {
    const followerId = this.authService.getUserID();

    fetch('https://sociaal.hiddebalestra.nl/is_following.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        follower_id: followerId,
        followed_id: followedId
      })
    })
      .then(res => res.json())
      .then(data => {
        this.isFollowing = data.following === true;
      })
      .catch(err => console.error('Fout bij checkFollowing:', err));
  }

  toggleFollow(): void {
    const url = this.isFollowing ? 'https://sociaal.hiddebalestra.nl/unfollow_user.php' : 'https://sociaal.hiddebalestra.nl/follow_user.php';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        follower_id: this.authService.getUserID(),
        followed_id: this.profile.id
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'followed') {
          this.isFollowing = true;
          this.profile.followers += 1
        } else if (res.status === 'request-sent') {
          this.followStatus = 'Volgverzoek verzonden. Wacht op goedkeuring.';
        } else if (res.status === 'already-requested') {
          this.followStatus = 'Volgverzoek is al in behandeling.';
        } else if (res.status === 'unfollowed') {
          this.profile.followers -= 1
          this.isFollowing = false;
        }
      })
      .catch(() => this.followStatus = 'Fout bij volgen/verzoek.');
  }

  updateProfile(): void {
    if (this.captchaService.userCaptchaInput !== this.captchaService.captchaAnswer) {
      alert('CAPTCHA. Forbidden for Robot Jetten.');
      this.captchaService.generateCaptcha();
      return;
    }

    // Add https:// if not present
    if (this.profile.website && !this.profile.website.startsWith('https://')) {
      this.profile.website = 'https://' + this.profile.website;
    }

    // Validate the URL format
    if (!this.isValidUrl(this.profile.website)) {
      this.followStatus = 'Ongeldige URL.';
      return;
    }

    fetch('https://sociaal.hiddebalestra.nl/update_profile.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID: this.authService.getUserID(),
        statusMessage: this.profile.statusMessage,
        website: this.profile.website,
        private: this.profile.private ? 1 : 0,
        captchaInput: this.captchaService.userCaptchaInput,
        captchaAnswer: this.captchaService.captchaAnswer
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.followStatus = 'Profiel bijgewerkt.';
          this.captchaService.generateCaptcha();
          this.captchaService.userCaptchaInput = "";
        } else {
          this.followStatus = 'Fout bij bijwerken profiel.';
        }
      })
      .catch(() => {
        this.followStatus = 'Fout bij bijwerken profiel.';
      });
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && !!parsed.hostname;
    } catch {
      return false;
    }
  }

}
