import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {ActivatedRoute, ParamMap, Router, RouterLink} from '@angular/router';
import {PostDataService} from '../../services/post-data-service';
import {GoBack} from '../../parts/go-back/go-back';
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {FeedList} from '../../parts/feed-list/feed-list';
import {Comment} from '../../parts/comment/comment';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';
import {ImageDetail} from '../../parts/image-detail/image-detail';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.scss'],
  imports: [
    DatePipe,
    GoBack,
    FormsModule,
    FeedList,
    Comment,
    RouterLink,
    ImageDetail
  ],
  providers: [DatePipe]
})
export class PostDetail implements OnInit {
  postId!: number;
  postDetail?: any;

  constructor(
    public route: ActivatedRoute,
    readonly postService: PostDataService,
    protected readonly authService: AuthService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const idParam = params.get('id');
      this.postId = idParam ? +idParam : 0;
      this.postService.getPost(this.postId).then(post => {
        this.postDetail = post;
      });
    });
  }

  // Method to convert URLs in text to clickable links
  getSafeMessage(): SafeHtml {
    if (!this.postDetail?.message) {
      return '';
    }

    // Regular expression to match URLs (including .nl, .com, etc.)
    const urlRegex = /(https?:\/\/[^\s<]+(?:\.nl|\.com|\.org|\.net|\.edu|\.gov|\.co|\.io|\.biz|[^\s<]+))/g;

    // Replace URLs with anchor tags
    const formattedMessage = this.postDetail.message.replace(
      urlRegex,
      (url: string) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Sanitize the HTML to prevent XSS attacks
    return this.sanitizer.bypassSecurityTrustHtml(formattedMessage);
  }
}
