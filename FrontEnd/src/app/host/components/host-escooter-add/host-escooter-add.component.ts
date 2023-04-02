import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Make} from "../../../escooter/models/make.interface";
import {HostService} from "../../services/host.service";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {Options} from "ngx-google-places-autocomplete/objects/options/options";
import {ScooterAddRequestPayload} from "../../payload/scooter-add-request.payload";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {UserService} from "../../../user/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../shared/services/loading.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-host-escooter-add',
  templateUrl: './host-escooter-add.component.html',
  styleUrls: ['./host-escooter-add.component.css']
})
export class HostEscooterAddComponent implements OnInit{

  makes:Make[];
  isHostCreated:boolean = false;
  error:any;
  options:Options = new Options({
    bounds: undefined, fields: ['geometry', 'name'], strictBounds: false,
    types: ['establishment'],
    componentRestrictions: {country: 'ie'}
  });
  isGooglePlaceSelected:boolean = false;
  googlePlaceLocation:any;
  imageFileType:String;
  base64textString = [];
  isLoading: boolean = false;
  scooterAddRequestPayload:ScooterAddRequestPayload | undefined = {
    make:"",
    modelName:"",
    cost:0,
    maxSpeed:0,
    maxWeight:0,
    scooterWeight:0,
    motorPower:0,
    maxRange:0,
    tripStart:null,
    tripEnd:null,
    waterResistant:null,
    image:null,
    country:"",
    about:"",
    fileName: "",
    contentType: ""
  };
 hostID:number;


  constructor(private hostService:HostService,
              private userService:UserService,
              private route:Router,
              private router:ActivatedRoute,
              private loadingService:LoadingService,
              private toastr:ToastrService) {
  }

  onSubmit(addForm: NgForm) {
      this.loadingService.isLoading.next(true);

    if(addForm.invalid){
        this.loadingService.isLoading.next(false);

      return;
    }

    const value = addForm.value.image.substring(12);
    const valueSplitted = value.split(".")
    const fileType = valueSplitted[1];
    this.imageFileType = fileType;

    this.scooterAddRequestPayload.country = this.googlePlaceLocation;
    this.scooterAddRequestPayload.modelName = addForm.value.modelName;
    this.scooterAddRequestPayload.cost = addForm.value.cost;
    this.scooterAddRequestPayload.maxSpeed = addForm.value.maxSpeed;
    this.scooterAddRequestPayload.maxWeight = addForm.value.maxWeight;
    this.scooterAddRequestPayload.scooterWeight = addForm.value.scooterWeight;
    this.scooterAddRequestPayload.motorPower = addForm.value.motorPower;
    this.scooterAddRequestPayload.maxRange = addForm.value.maxRange;
    this.scooterAddRequestPayload.tripStart = addForm.value.tripStart;
    this.scooterAddRequestPayload.tripEnd = addForm.value.tripEnd;
    this.scooterAddRequestPayload.waterResistant = addForm.value.waterResistant;
    this.scooterAddRequestPayload.fileName = value;
    this.scooterAddRequestPayload.about = addForm.value.about;
    this.scooterAddRequestPayload.make = addForm.value.make;
    this.scooterAddRequestPayload.contentType = "image/"+fileType;

    const reader = new FileReader();
    const blob = new Blob([addForm.value.image], {type: "image/"+fileType})
    reader.readAsDataURL(blob);
    //once it has been loaded go ahead and call the api in th ebody
    reader.onload = () => {
      // this.scooterAddRequestPayload.image = reader.result;

    }

    console.log(this.scooterAddRequestPayload )
     this.isLoading = true;
    this.hostService.createEscooter(this.scooterAddRequestPayload).subscribe((data:Escooter) => {
          console.log(data);
          this.isLoading = false;
            this.loadingService.isLoading.next(false);

          console.log(this.hostID)
          this.route.navigate(['/host-escooters', data.host], {queryParams: {success: true}})
        },
        error => {
          this.error = error;
            this.loadingService.isLoading.next(false);

            this.isLoading = false;
          console.log(error)

        },
        ()=> {
            this.loadingService.isLoading.next(false);

            this.isLoading = false;
        })



  }

  ngOnInit() {
    this.setHostAddedAlert();
    this.getAllMakes();
  }

  getAllMakes(){
    this.hostService.fetchAllMakes().subscribe(makesData => {
      console.log(makesData);
      this.makes = makesData;
    })
  }

  handleAddressChange(locationData: Address) {
      this.googlePlaceLocation = locationData.name;
      this.isGooglePlaceSelected = true;
      console.log(locationData)
  }

  setHostAddedAlert(){

    this.router.queryParams.subscribe(params => {
      this.isHostCreated = params['hostCreated'];

      if(this.isHostCreated){
          this.toastr.success(  'Host Created', "", {
              positionClass: 'toast-top-center'
          });
      }
      console.log(params['hostId'])
      this.hostID = params['hostId'];
    })
  }



  onUploadChange(evt: any) {

      const file = evt.target.files[0];

      if (file) {
          const reader = new FileReader();

          reader.onload = this.handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
      }

  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.scooterAddRequestPayload.image = 'data:image/'+this.imageFileType +';base64,' + btoa(e.target.result);
  }
}
