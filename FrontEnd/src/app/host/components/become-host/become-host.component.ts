import {Component, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {Router} from "@angular/router";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'become-host',
  templateUrl: './become-host.component.html',
  styleUrls: ['./become-host.component.css']
})
export class BecomeHostComponent implements OnInit{
  errorMessage:string;
  isLoading:boolean = false;

  constructor(private hostService:HostService,
              private route:Router,private loadingService:LoadingService) {

  }

  ngOnInit() {
  }

  createHost() {
    this.loadingService.isLoading.next(true);
    this.hostService.createHostFromAPI().subscribe((data:any) => {
      this.loadingService.isLoading.next(null);

      this.route.navigate(['../add-escooter'], {queryParams: {hostCreated: true, hostId: data}})

    }, error => {
      console.log(error)
      this.loadingService.isLoading.next(null);

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
