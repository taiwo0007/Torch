import {Component, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {Router} from "@angular/router";

@Component({
  selector: 'become-host',
  templateUrl: './become-host.component.html',
  styleUrls: ['./become-host.component.css']
})
export class BecomeHostComponent implements OnInit{
  errorMessage:string;
  isLoading:boolean = false;

  constructor(private hostService:HostService,
              private route:Router) {

  }

  ngOnInit() {
  }

  createHost() {
    this.hostService.createHostFromAPI().subscribe((data:any) => {

      this.route.navigate(['../add-escooter'], {queryParams: {hostCreated: true, hostId: data}})

    }, error => {
      console.log(error)

      if(error.error)
      {
        this.errorMessage = error.error.message
        return;
      }
      else {
        this.errorMessage = error;
        return;
      }})

  }
}
