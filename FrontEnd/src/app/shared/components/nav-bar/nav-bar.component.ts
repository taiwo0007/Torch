import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BsDropdownDirective} from 'ngx-bootstrap/dropdown';
import {UserService} from "../../../user/services/user.service";
import {UserData} from "../../../user/models/user-data.model";
import {LoadingService} from "../../services/loading.service";
import {SubscriptionModalComponent} from "../../../user/components/subscription-modal/subscription-modal.component";
import {environment} from "../../../../environments/environment";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    animations: [
        trigger('showHided', [
            state('show', style({
                opacity: 1,
                transform: 'translateY(0)'
            })),
            state('hide', style({
                opacity: .3,
                transform: 'translateY(-15px)'
            })),
            transition('show => hide', animate('200ms ease-in-out')),
            transition('hide => show', animate('200ms ease-in-out')),

        ])
    ]
})
export class NavBarComponent implements OnInit, OnDestroy {
    @ViewChild(BsDropdownDirective, {static: false}) dropdown: BsDropdownDirective;
    isAuthenticated = false;
    isSuccessLogOut = false;

    isHost: boolean;

    isVerified: boolean = false;
    isLoading = false;
    isError:boolean;
    isNotice:boolean;
     isSuccess:boolean;
    isAlert:boolean;
    hostID: number;
    profileImage: string;
    accountType: string;
    isLoadingLine: boolean = false;
    isOpen: any = false;
    isProd: boolean;
    userEmail:string;
    alertMessage:String;

    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private dropdownService: BsDropdownDirective,
                private userService: UserService,
                private loadingService: LoadingService,
                private dialog: MatDialog) {
        this.dropdown = dropdownService;

    }

    ngOnInit(): void {


        //alerts
        this.loadingService.isNotice.subscribe(data => {
                this.isNotice = true;
                this.alertMessage = data.message;
                setTimeout(()=>{this.isNotice = false},
                    5000)
        })
        this.loadingService.isAlert.subscribe(data => {
            this.isAlert = true;
            this.alertMessage = data.message;
            setTimeout(()=>{this.isAlert = false},
                5000)
        })
        this.loadingService.isError.subscribe(data => {
            this.isError = true;
            this.alertMessage = data.message;
            setTimeout(()=>{this.isError = false},
                5000)
        })
        this.loadingService.isSuccess.subscribe(data => {
            this.isSuccess = true;
            this.alertMessage = data.message;
            setTimeout(()=>{this.isSuccess = false},
                5000)
        })


        this.isProd = environment.frontEndUrl != 'http://localhost:4200';


        this.loadingService.isLoading.subscribe(value => {
            this.isLoading = value;
        })
        this.loadingService.isLoadingLine.subscribe(value => {
            this.isLoadingLine = value;
        })

        this.authService.user.subscribe((data: any) => {

            console.table(data)

            this.userService.fetchUserDetails().subscribe((userData: UserData) => {
                this.profileImage = userData.profilePicture;
            })

            this.accountType = data._accountType;
            this.userEmail = data.email;

            this.isVerified = data._isVerified;
            this.isHost = data._isHost

            if (!data) {
                this.isAuthenticated = false;
            } else {
                this.isAuthenticated = true;
            }

            this.hostID = data._hostID;

        })


    }

    ngOnDestroy() {
    }

    onLogout() {
        this.isAuthenticated = false;
        this.isHost = null;
        this.isVerified = null;
        this.hostID = null;
        this.accountType = null;
        this.authService.logout();
        this.router.navigate(['login'], {queryParams: {success: true}});

    }

    closeDropdown(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.dropdown.isOpen = false;
    }

    subscriptionModal() {
        const dialogRef = this.dialog.open(SubscriptionModalComponent, {
            height: 'max-content',
            width: 'max-content',
            hasBackdrop: true,
        });


    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
    }
}
