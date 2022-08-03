import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Input('type') typeProp: 'success' | 'danger' = 'success';
  constructor() {}

  ngOnInit(): void {}

  get alertType(): string {
    const classList = ['alert'];
    classList.push(`alert-${this.typeProp}`);
    return classList.join(' ');
  }
}
