import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any;
  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  submitted = false;
  @Output() closePopupEvent = new EventEmitter<any>();

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService
  ) { }


  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: [, [Validators.required]],
      password: [, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const user: Login = { username: this.loginForm.get('username').value, password: this.loginForm.get('password').value };
    this._loginService.login(user).subscribe((result) => {
      sessionStorage.setItem('user', JSON.stringify(result) );
      this.cancelRequest(result);
    }, (error) => {
      this.isLoggedIn = error.status === 404;
    });
  }

  cancelRequest(user: any): void {
    this.closePop(user);
  }

  registerUser(): void {
    this.closePop(null);
    this._router.navigate(['register']);
  }

  closePop(user: any): any {
    return this.closePopupEvent.emit(user);
  }
}
