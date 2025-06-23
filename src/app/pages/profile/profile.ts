import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {FeedList} from '../../parts/feed-list/feed-list';

@Component({
  selector: 'app-profile',
  imports: [
    FeedList
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit{
  profile: any;

  constructor(
    public route: ActivatedRoute,
    protected readonly authService: AuthService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.profile = await this.authService.getProfile(parseInt(this.authService.getUserID()));
    } else {
      this.profile = await this.authService.getProfile(id);
    }
  }
}
