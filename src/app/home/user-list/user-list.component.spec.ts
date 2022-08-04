import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserListResponse } from '../types/user-list-response';

const userList: UserListResponse = {
  content: [
    {
      id: 1,
      username: 'user1',
      email: 'user1@email.com',
    },

    {
      id: 2,
      username: 'user2',
      email: 'user2@email.com',
    },
    {
      id: 3,
      username: 'user3',
      email: 'user3@email.com',
    },
  ],
  page: 0,
  size: 3,
  totalPages: 6,
};
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    httpController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get the user list from the server', () => {
    const req = httpController.expectOne('/api/1.0/users');
    req.flush(userList);
    fixture.detectChanges();
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });
});
