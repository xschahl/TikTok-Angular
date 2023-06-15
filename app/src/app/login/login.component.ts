import { AfterViewInit, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpService } from '../http/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  public email: FormControl = new FormControl('', [Validators.required]);
  public password: FormControl = new FormControl('', [Validators.required]);
  public repassword: FormControl = new FormControl('', [Validators.required]);

  constructor(private http: HttpService, private router: Router) {}

  ngAfterViewInit(): void {
    if (this.http.isLoggedIn)
      this.router.navigate(["home"]);
  }

  signIn() {
    this.http.login(this.email.value, this.password.value);
  }

  signUp() {
    this.http.register(this.email.value, this.password.value);
  }
}
