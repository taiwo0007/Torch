import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-start-trip-form',
  templateUrl: './start-trip-form.component.html',
  styleUrls: ['./start-trip-form.component.css']
})
export class StartTripFormComponent implements OnInit {
  isAuthenticated = false;
  @Input() cost;
  @Input() escooterId;

  constructor(private authService: AuthService,
              private router:Router) { }

  ngOnInit(): void {

    this.authService.user.subscribe((data:boolean) => {

      this.isAuthenticated = data;
    })

  }

    onSubmit(StartTipForm: NgForm) {

        this.router.navigate(['../escooter-booking',this.escooterId])

    }
}
