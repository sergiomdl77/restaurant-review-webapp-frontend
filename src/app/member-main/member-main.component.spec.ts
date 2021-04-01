import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMainComponent } from './member-main.component';

describe('MemberMainComponent', () => {
  let component: MemberMainComponent;
  let fixture: ComponentFixture<MemberMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
