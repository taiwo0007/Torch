import {Component, Input, OnInit} from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
