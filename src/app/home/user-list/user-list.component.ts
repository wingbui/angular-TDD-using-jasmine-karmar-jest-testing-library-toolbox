import { Component, OnInit } from '@angular/core';
import { UserService } from '../../sign-up/services/user.service';
import { UserListResponse } from '../types/user-list-response';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  userList: UserListResponse = { content: [], page: 0, size: 3, totalPages: 0 };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.userList = data as UserListResponse;
    });
  }
}
