import {Component, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";
import {AdModalComponent} from "../ad-modal/ad-modal.component";
import {CreateAdRequestPayload} from "../../payload/create-ad-request.payload";
import {catchError, of, switchMap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Host} from "../../models/host.interface";
import {LoadingService} from "../../../shared/services/loading.service";
import {EscooterService} from "../../../escooter/services/escooter.service";
import {
    DeleteScooterDialogComponent
} from "../../../shared/components/delete-scooter-dialog/delete-scooter-dialog.component";
import {DialogService} from "../../../shared/services/dialog.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-host-escooters',
    templateUrl: './host-escooters.component.html',
    styleUrls: ['./host-escooters.component.css']
})
export class HostEscootersComponent implements OnInit {
    hostEscooters: Escooter[];
    addSuccess: boolean = false;
    hostID: number;
    isScooterOwner: boolean = false;
    isLoading: boolean = false;
    totalAdDays: number = 0;
    createAdRequest: CreateAdRequestPayload;
    isImgRemove: boolean = false;

    constructor(private hostService: HostService, private route: ActivatedRoute,
                private authService: AuthService, private dialog: MatDialog,
                private toastr: ToastrService, private loadingService: LoadingService,
                private escooterService: EscooterService,
                private dialogService: DialogService,
                private router: Router) {
    }

    ngOnInit() {
        this.isLoading = true

        this.checkHostID();
        this.checkSuccessUrl();
        this.getHostDetails()


    }

    getHostEscooters() {
        this.hostService.fetchHostEscooters(this.hostID)
            .subscribe(data => {
                    console.log(data)
                    // this.isLoading = false

                  this.hostEscooters = data
                this.isLoading =false;

                },
                () => {
                    this.router.navigate(['/error'])
                    this.isLoading =false;


                }, ()=>{
                  this.loadingService.isLoadingLine.next(false);
                    this.isLoading =false;


                })
    }

    getHostDetails() {

        this.hostService.getHostById(this.hostID).subscribe((hostData: Host) => {
            console.log(hostData)
            this.loadingService.isLoading.next(false);
            this.totalAdDays = hostData.totalAdDays;

        })


    }

    openDialog() {

    }

    checkHostID() {
        this.route.params.subscribe(params => {
            this.hostID = params['id'];
            this.checkScooterOwner();
            this.isLoading = true;
            this.getHostEscooters();

        })
    }

    checkScooterOwner() {
        this.authService.user.subscribe(thisUser => {



            if (thisUser._hostID == this.hostID) {
                this.isScooterOwner = true;
            }

        })
    }


    checkSuccessUrl() {

        this.route.queryParams.subscribe(params => {
            if (params['success']) {
                this.loadingService.isSuccess.next({message: 'Electric scooter added successfully'});
            }

        })
    }

    onAdClick(escooter: Escooter) {
        const dialogRef = this.dialog.open(AdModalComponent, {
            data: {escooter: escooter, totalAdDays: this.totalAdDays},
            height: 'auto',
            width: '600px',

        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
        })

        //submit and handling of ad form
        //upon user choice entered call an api and display appropriate toaster message
        dialogRef.componentInstance.userChoice.pipe(catchError((error: HttpErrorResponse) => {

                console.error(error.error.message)
                this.loadingService.isLoading.next(false);

                return of("error");
            }),
            switchMap((data: any) => {
                this.createAdRequest = {
                    adDays: data.adDays,
                    adDate: data.adDate,
                    escooterId: data.escooterId,
                    hostId: data.hostId
                };
                return this.hostService.createAd(this.createAdRequest)
            }))
            .subscribe(data => {
                this.loadingService.isSuccess.next({message: 'Successfully created ad campaign!'});
                this.loadingService.isLoadingLine.next(true);
                this.getHostEscooters()
                dialogRef.close();
            }, error => {

                if (error.error.message) {
                    this.loadingService.isError.next({message: 'Unsuccessful: ' + error.error.message});
                } else {
                    this.loadingService.isError.next({message: 'Opps! An Unexpected Error Occurred'});

                }

                dialogRef.close();
            })
    }

    setupDeleteCheck(id: number) {


        this.dialogService.confirmDeleteScooter.pipe((data: any) => {
            console.log("1")
            this.loadingService.isLoadingLine.next(true);

            //once the api returns scooter, we display success message
            return this.escooterService.deleteEscooter(id)
        }).subscribe(data => {

                this.loadingService.isSuccess.next({message: "E-Scooter deleted successfully"})

                this.getHostEscooters();

            },
            () => {
                this.loadingService.isLoadingLine.next(false);

            })

    }


    onDeleteClick(id: number) {

        const dialogRef = this.dialog.open(DeleteScooterDialogComponent, {
            height: '200px',
            width: '700px',

        });

        dialogRef.componentInstance.userChoice.subscribe(data => {
            this.loadingService.isLoadingLine.next(true);
            this.setupDeleteCheck(id);

        })

        dialogRef.afterClosed().subscribe(result => {
        });


    }

    toggleShow() {
        this.isImgRemove = !this.isImgRemove;

    }
}
