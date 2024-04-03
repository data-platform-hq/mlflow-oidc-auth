import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ml-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() name: string = '';

  constructor() { }

  ngOnInit(): void {
  }
}
