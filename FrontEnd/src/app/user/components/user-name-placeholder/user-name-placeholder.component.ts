import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {BasicUserResponsePayload} from "../../models/basic-user-response.payload";
import {Subscription} from "rxjs";

@Component({
  selector: 'user-name-placeholder',
  templateUrl: './user-name-placeholder.component.html',
  styleUrls: ['./user-name-placeholder.component.css']
})
export class UserNamePlaceholderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userId:any;
  fullname:string;
  fetchUserSub:Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {


  }

  ngAfterViewInit() {
      this.getUserDetails()
  }

  ngOnDestroy() {
      this.fetchUserSub.unsubscribe();
  }

  getUserDetails(){

    console.log(this.userId)
    this.fetchUserSub = this.userService.fetchBasicUser(this.userId).subscribe((data:BasicUserResponsePayload) => {
        console.log(data)
        this.fullname = data.firstName + ' ' +data.lastName
    })
}


}
