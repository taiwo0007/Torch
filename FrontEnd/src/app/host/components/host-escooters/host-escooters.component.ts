import {Component, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../user/models/user.model";
import {UserService} from "../../../user/services/user.service";
import {AuthService} from "../../../auth/services/auth.service";
import {
  VerificationDialogComponent
} from "../../../shared/components/verification-dialog/verification-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AdModalComponent} from "../ad-modal/ad-modal.component";
import {CreateAdRequestPayload} from "../../payload/create-ad-request.payload";
import {catchError, exhaustMap, mergeMap, of, switchMap} from "rxjs";
import {data} from "autoprefixer";
import {ToastrService} from "ngx-toastr";
import {Host} from "../../models/host.interface";

@Component({
  selector: 'app-host-escooters',
  templateUrl: './host-escooters.component.html',
  styleUrls: ['./host-escooters.component.css']
})
export class HostEscootersComponent implements OnInit{
  hostEscooters:Escooter[];
  addSuccess:boolean = false;
  hostID:number;
  isScooterOwner:boolean = false;
  totalAdDays: number = 0;
  createAdRequest:CreateAdRequestPayload;

  constructor(private hostService: HostService, private route:ActivatedRoute,
              private authService:AuthService, private dialog:MatDialog,
              private toastr:ToastrService) {
  }

  ngOnInit() {
    this.checkHostID();
    this.checkSuccessUrl();
    this.getHostDetails()

  }

  getHostEscooters(){
    this.hostService.fetchHostEscooters(this.hostID).subscribe(data => {
      console.log(data)
      this.hostEscooters = data

    })
  }

  getHostDetails(){
    console.log("id")
    console.log(this.hostID)
    this.hostService.getHostById(this.hostID).subscribe((hostData:Host) => {
      console.log(hostData)

      this.totalAdDays = hostData.totalAdDays;
    })
  }

  openDialog() {

  }

  checkHostID(){
    this.route.params.subscribe(params => {
      this.hostID = params['id'];
      this.checkScooterOwner();
      this.getHostEscooters();
    })
  }

  checkScooterOwner(){
    this.authService.user.subscribe(thisUser => {
      console.log(thisUser)



      if(thisUser._hostID == this.hostID){
        this.isScooterOwner = true;
      }
    })
  }


  checkSuccessUrl(){

    this.route.queryParams.subscribe(params => {
      this.addSuccess = params['success'];
    })
  }

  onAdClick(escooter:Escooter) {
    const dialogRef = this.dialog.open(AdModalComponent, {
      data: {escooter:escooter, totalAdDays:this.totalAdDays},
      height: 'auto',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })

    //submition and handling of adform
    //upon user choice entered call an api and display appropriate toaster meessage
    dialogRef.componentInstance.userChoice.pipe(catchError((error:HttpErrorResponse) =>{

      console.error(error.error.message)
      return of("error");
    }),
        switchMap((data:any) => {
          this.createAdRequest = {
            adDays:data.adDays,
            adDate:data.adDate,
            escooterId:data.escooterId,
            hostId:data.hostId
          };
          return this.hostService.createAd(this.createAdRequest)
        }))
        .subscribe(data => {
          this.toastr.success(  'Ad Campaign Created', '', {
            positionClass: 'toast-top-center'
          });
          this.checkHostID()
          this.getHostDetails()
          dialogRef.close();
          }, error => {

          if(error.error.message){
            this.toastr.error(  'Ad Campaign Not Created', error.error.message, {
              positionClass: 'toast-top-center'
            });
          }
          else {
            this.toastr.error(  'Ad Campaign Not Created', 'An Unexpected Error Occured', {
              positionClass: 'toast-top-center'
            });
          }

          dialogRef.close();
        })
  }
}
