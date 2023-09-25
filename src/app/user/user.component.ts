import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  email: string = '';
  password: string = '';
  constructor(private router: Router) {}
  /*
  formAccess = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', [Validators.required]),
    password: new FormControl(''),
  });*/
  /*
  accessSystem(form: any) {
    console.log(form);
    //    this.router.navigateByUrl('login/register');
  }*/
  signup() {
    this.router.navigate(['signup']);
  }

  login() {
    //todo
    alert('bienvenido ' + this.email);

    //error:
    this.password = '';
    document.getElementById('txtemail')?.focus();
  }
}
