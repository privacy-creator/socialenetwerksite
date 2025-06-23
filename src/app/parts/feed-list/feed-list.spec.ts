import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedList } from './feed-list';

describe('FeedList', () => {
  let component: FeedList;
  let fixture: ComponentFixture<FeedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
