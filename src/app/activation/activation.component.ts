import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../sign-up/services/user.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
})
export class ActivationComponent implements OnInit {
  activationStatus?: 'success' | 'failure' | 'in-progress';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.activationStatus = 'in-progress';
      this.userService.activate(params['token']).subscribe({
        next: () => {
          this.activationStatus = 'success';
        },
        error: () => {
          this.activationStatus = 'failure';
        },
      });
    });
  }
}
