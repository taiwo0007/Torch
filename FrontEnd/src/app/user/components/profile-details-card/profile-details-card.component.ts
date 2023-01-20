import {Component, Input, OnInit} from '@angular/core';
import {UserData} from "../../models/user-data.model";

@Component({
  selector: 'app-profile-details-card',
  templateUrl: './profile-details-card.component.html',
  styleUrls: ['./profile-details-card.component.css']
})
export class ProfileDetailsCardComponent implements OnInit {

  @Input() userDetails?: UserData;

  constructor() { }

  ngOnInit(): void {
  }

}
