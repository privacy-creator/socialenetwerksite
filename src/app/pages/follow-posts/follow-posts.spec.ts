import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPosts } from './follow-posts';

describe('FollowPosts', () => {
  let component: FollowPosts;
  let fixture: ComponentFixture<FollowPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
