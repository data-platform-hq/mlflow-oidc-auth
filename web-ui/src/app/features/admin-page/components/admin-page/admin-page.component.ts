import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ml-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
  }

  foo(event: MatTabChangeEvent) {
    const mapping: { [key: number]: string } = {
      0: '/admin/user-permissions',
      1: '/admin/experiments-permissions',
      2: '/admin/models-permissions',
    }
    const route = mapping[event.index];
    if (route) {
      void this.router.navigate([route], { relativeTo: this.route });
    }
  }
}
