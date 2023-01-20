import {Component, Input, OnInit} from '@angular/core';
import {ScooterReviewer} from "../../models/scooter-reviewer.interface";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() Review:ScooterReviewer;

  constructor() { }

  ngOnInit(): void {
  }

}
