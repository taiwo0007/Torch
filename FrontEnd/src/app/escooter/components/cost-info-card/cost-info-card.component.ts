import {Component, Input, OnInit} from '@angular/core';
import {Discount} from "../../models/discount.interface";

@Component({
  selector: 'cost-info-card',
  templateUrl: './cost-info-card.component.html',
  styleUrls: ['./cost-info-card.component.css']
})
export class CostInfoCardComponent implements OnInit {

  @Input() escooterCost:number;
  @Input() initialCost:number;
  @Input() tripDays:number;
  @Input() vatCost:number;
  @Input() totalCost:number;
  @Input() totalInsurance:number;
  @Input() discountObj?:Discount;

  constructor() {}

  ngOnInit(): void {


    console.log(this.discountObj)
  }

}
