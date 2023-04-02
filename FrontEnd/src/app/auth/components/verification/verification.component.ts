import {Component, Input} from '@angular/core';
import {FormBuilder, NgControl, Validators} from "@angular/forms";
import {Options} from "ngx-google-places-autocomplete/objects/options/options";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {VerifyRequestPayload} from "../../payloads/verify-request.payload";
import {AuthService} from "../../services/auth.service";
import {Route, Router} from "@angular/router";
import {LoadingService} from "../../../shared/services/loading.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent {


  base64textString = [];
  isGooglePlaceSelected:boolean = false;
  fileName;
  imageFileType:String;
  verifyRequestPayload:VerifyRequestPayload = {
    firstName: "",
    lastName: "",
    about: "",
    gender: "",
    phoneNumber: null,
    profilePicture: "",
    location: "",
    contentType: "",
    fileName: "",
    image: "",
    url:environment.frontEndUrl

  };
  isLoading:boolean = false;
  googlePlaceLocation:any;
  options:Options = new Options({
    bounds: undefined, fields: ['geometry', 'name'], strictBounds: false,
    types: ['establishment'],
    componentRestrictions: {country: 'ie'}
  });


  isLinear = true;
  firstFormGroup = this._formBuilder.group({
    firstName: ['Taiwo', Validators.required],
    lastName: ['Obadare', Validators.required],
    about: ['', Validators.required],
    gender: ['male', Validators.required ],
    phoneNumber: [null, Validators.required ],
    profilePicture: ['', Validators.required ],
  });
  secondFormGroup = this._formBuilder.group({
    location: ['', Validators.required],
  });
   srcResult: any;
   error: string;
  constructor(private _formBuilder: FormBuilder,
              private authService:AuthService,
              private router:Router,private loadingService:LoadingService) {}


  handleAddressChange(locationData: Address) {

    this.googlePlaceLocation = locationData.name;
    this.isGooglePlaceSelected = true;
    this.secondFormGroup.value.location  = locationData.name;

  }

  onFileSelected(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();



      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/'+this.imageFileType +';base64,' + btoa(e.target.result));
    const value = this.firstFormGroup.value.profilePicture.substring(12);
    const valueSplitted = value.split(".")
    const fileType = valueSplitted[1];
    this.verifyRequestPayload.contentType = "image/"+fileType;
    this.verifyRequestPayload.fileName = value;
    this.firstFormGroup.value.profilePicture = 'data:image/'+this.imageFileType +';base64,' + btoa(e.target.result);

  }


  onSubmit() {
    this.loadingService.isLoadingLine.next(true);

    this.isLoading = true;
    console.log(this.secondFormGroup)
    console.log(this.firstFormGroup)
    if(this.secondFormGroup.invalid || this.firstFormGroup.invalid){
      return;
    }
    console.log(this.firstFormGroup)

    const value = this.firstFormGroup.value.profilePicture.substring(12);
    const valueSplitted = value.split(".")
    const fileType = valueSplitted[1];

    this.verifyRequestPayload.about = this.firstFormGroup.value.about;
    this.verifyRequestPayload.phoneNumber = this.firstFormGroup.value.phoneNumber;
    this.verifyRequestPayload.lastName = this.firstFormGroup.value.lastName;
    this.verifyRequestPayload.gender = this.firstFormGroup.value.gender;
    this.verifyRequestPayload.location = this.secondFormGroup.value.location;

    this.verifyRequestPayload.profilePicture = this.base64textString[0];
    this.verifyRequestPayload.firstName = this.firstFormGroup.value.firstName;

    console.log(this.verifyRequestPayload)

    this.authService.verfyUserViaAPI(this.verifyRequestPayload).subscribe(data => {
    console.log(data)
      this.isLoading = false;
          this.loadingService.isLoadingLine.next(false);

        },
        error => {
          this.error = "An unexpected Error has occurred"
          this.isLoading = false;
          this.loadingService.isLoadingLine.next(false);

          return;
        },
        () => {
      if(!this.error){
        this.loadingService.isLoadingLine.next(false);

        this.router.navigate(['/profile'], { queryParams: { success: true } });
      }


        })
  }





}
