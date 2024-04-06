import { Component, OnInit } from '@angular/core';
import { AuthService, DataService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mlflow-oidc-auth-front';

  name: string = '';

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getCurrentUser()
      .subscribe((userInfo) => {
        this.authService.setUserInfo(userInfo);
        this.name = userInfo.display_name;
      });
  }
}
