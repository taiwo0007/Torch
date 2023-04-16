import {Component, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {Router} from "@angular/router";
import {LoadingService} from "../../../shared/services/loading.service";
import {FormControl, Validators} from "@angular/forms";
import {Insurance} from "../../models/insurance.interface";

interface Animal {
  name: string;
  sound: string;
}

@Component({
  selector: 'become-host',
  templateUrl: './become-host.component.html',
  styleUrls: ['./become-host.component.css']
})
export class BecomeHostComponent implements OnInit{
  errorMessage:string;
  isLoading:boolean = false;
  insuranceControl;
  selectFormControl = new FormControl(undefined, Validators.required);
  insurances: any;

  constructor(private hostService:HostService,
              private route:Router,private loadingService:LoadingService) {

  }

  ngOnInit() {

    this.hostService.fetchAllHostsInsurance().subscribe( data => {
      console.log(data)
      this.insurances = [...data];

      this.insuranceControl = new FormControl<Insurance | null>(null, Validators.required);
    })
  }

  createHost() {
    this.loadingService.isLoadingLine.next(true);
    this.hostService.createHostFromAPI(this.selectFormControl.value).subscribe((data:any) => {
      this.loadingService.isLoadingLine.next(null);

      this.route.navigate(['../add-escooter'], {queryParams: {hostCreated: true, hostId: data}})

    }, error => {
      console.log(error)
      this.loadingService.isLoadingLine.next(null);

      if(error.error)
      {

        this.errorMessage = error.error.message
        this.loadingService.isAlert.next({message:this.errorMessage})

        return;
      }
      else {
        this.errorMessage = error;
        this.loadingService.isAlert.next({message:this.errorMessage})

        return;
      }})

  }
}
