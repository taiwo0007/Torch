import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserData} from "../../models/user-data.Model";

@Component({
  selector: 'app-profile-form-card',
  templateUrl: './profile-form-card.component.html',
  styleUrls: ['./profile-form-card.component.css']
})
export class ProfileFormCardComponent implements OnInit {

  @Input() InitialUserDetails?: UserData;

  constructor() { }

  ngOnInit(): void {
  }

}
