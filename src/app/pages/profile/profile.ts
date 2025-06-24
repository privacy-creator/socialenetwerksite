import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {FeedList} from '../../parts/feed-list/feed-list';
import {NgClass} from '@angular/common';
import {FollowRequests} from './follow-requests/follow-requests';

@Component({
  selector: 'app-profile',
  imports: [
    FeedList,
    NgClass,
    FollowRequests
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit{
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  profile: any;
  isFollowing: boolean = false;
  followStatus: string = '';

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('id');
    const userId = profileId ?? String(this.authService.getUserID());
    this.loadProfile(userId);
    this.checkFollowing(userId);
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
    // fetch(url, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     follower_id: this.authService.getUserID(),
    //     followed_id: this.profile.id
    //   })
    // })
    //   .then(() => {
    //     this.isFollowing = !this.isFollowing;
    //   })
    //   .catch(err => console.error('Fout bij volgen/ontvolgen:', err));
  }
}
