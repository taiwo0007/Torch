import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user.model";
import {UserData} from "../../models/user-data.model";
import {NgForm} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-profile-form-card',
  templateUrl: './profile-form-card.component.html',
  styleUrls: ['./profile-form-card.component.css']
})
export class ProfileFormCardComponent implements OnInit, AfterViewInit {

  @ViewChild('UserDetailsForm', { static: false }) UserDetailsForm: NgForm;
  @Input() InitialUserDetails?: UserData;

  constructor(private userService: UserService,
              private loadingService:LoadingService) { }

  ngOnInit(): void {



  }

  ngAfterViewInit() {


  }

  onSubmit(UserDetailsForm: NgForm) {
        this.userService.fetchUserDetails().subscribe(data => {
          console.log(data)

        },() => {

        })

    }
}
