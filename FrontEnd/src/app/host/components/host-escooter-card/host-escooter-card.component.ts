import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewChild,
    AfterContentInit, OnChanges, SimpleChanges, DoCheck
} from '@angular/core';
import {Escooter} from "../../../escooter/models/escooter.interface";
import {EscooterService} from "../../../escooter/services/escooter.service";

@Component({
  selector: 'host-escooter-card',
  templateUrl: './host-escooter-card.component.html',
  styleUrls: ['./host-escooter-card.component.css']
})
export class HostEscooterCardComponent implements OnInit, AfterContentInit, OnChanges, DoCheck{
    @ViewChild('imgerr', {static: false}) imgerr:any
    @ViewChild('price', {static: false}) price:any
    @ViewChild('modelName', {static: false}) modelName:any


    @Output() deleteClick: EventEmitter<number> = new EventEmitter<number>();
  @Input() escooter:Escooter;
    @Input() OnImageRemove:boolean;
  @Input() isScooterOwner:boolean = false;
  isAdRunning:boolean;
  @Output() adClick: EventEmitter<Escooter> = new EventEmitter<Escooter>();

  onAddClick(){
    this.adClick.emit(this.escooter)
  }
ngAfterContentInit() {
    console.log(this.imgerr)

}

ngDoCheck() {

}

    ngOnChanges(changes: SimpleChanges) {
        if(this.OnImageRemove && this.imgerr){
            console.log(this.imgerr.nativeElement)
            this.imgerr.nativeElement.style.display = 'none'
            this.price.nativeElement.style.display = 'none'
            this.modelName.nativeElement.style.width = '50%'


        }
        if(this.OnImageRemove == false && this.imgerr){
            console.log(this.imgerr.nativeElement)
            this.imgerr.nativeElement.style.display = 'block'
            this.price.nativeElement.style.display = 'block'
            this.modelName.nativeElement.style.width = 'auto'


        }
}

    ngOnInit() {







    this.calculateAdRunning();


  }
  calculateAdRunning(){
      let tommorow = new Date();
      tommorow.setDate(tommorow.getDate() +1)
      tommorow.setHours(0, 0, 0, 0)

      let yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0)
      yesterday.setDate(new Date().getDate() - 1)

      let twoDaysAgo = new Date();
      twoDaysAgo.setHours(0, 0, 0, 0)
      twoDaysAgo.setDate(new Date().getDate() - 2)


      const a = new Date(),
          b = new Date(this.escooter.adDate), difference = this.dateDiffInDays(a, b);


      //todays ads
      if(this.dateDiffInDays(new Date(this.escooter.adDate), tommorow) == 1){
          this.isAdRunning = true;
      }

      //yesterday ads
      if(this.dateDiffInDays(new Date(this.escooter.adDate), yesterday) == 0 && this.escooter.escooterAdDays >=2){
          this.isAdRunning = true;
      }

      //twoDaysAgo ads
      if(this.dateDiffInDays(new Date(this.escooter.adDate), twoDaysAgo) == 0 && this.escooter.escooterAdDays >=3){
          this.isAdRunning = true;
      }
  }

   dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }



  constructor(private esccooterService:EscooterService) {
  }


    onDelete(id: number) {
      this.deleteClick.emit(id)
    }
}
