import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {PostDataService} from '../../services/post-data-service';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-post.html',
  styleUrl: './new-post.scss',
})
export class NewPost {
  message = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    protected readonly authService: AuthService,
    private postService: PostDataService,
    private router: Router
  ) {}

  submitPost() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']).then();
      return;
    }

    if (this.message.trim()) {
      this.postService.addPost(this.message, -1, this.imagePreview).then(() => {
        this.router.navigate(['/']).then();
      });
    }
  }

  addLink() {
    this.message += 'https://';
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
}
