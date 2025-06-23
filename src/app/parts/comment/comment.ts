import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PostDataService} from '../../services/post-data-service';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-comment',
  imports: [
    FormsModule
  ],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment implements OnInit{
  message = '';
  postId!: number;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    readonly postService: PostDataService,
    protected readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const idParam = params.get('id');
      this.postId = idParam ? +idParam : 0;
    });
  }

  submitPost() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']).then();
      return;
    }

    if (this.message.trim()) {
      this.postService.addPost(this.message, this.postId).then(() => {
        this.message = '';
        this.postService.getThePosts(this.postId).then()
      });
    }
  }
}
