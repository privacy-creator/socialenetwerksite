import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-image-detail',
  imports: [],
  templateUrl: './image-detail.html',
  styleUrl: './image-detail.scss'
})
export class ImageDetail {
  @Input() imageUrl: string | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
