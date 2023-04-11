import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isLoadingLine: boolean = false;
  isLoading: boolean = false;

  constructor(private loadingService:LoadingService) { }

  ngOnInit(): void {

    this.loadingService.isLoading.subscribe(value => {
      this.isLoading = value;
    })
    this.loadingService.isLoadingLine.subscribe(value => {
      this.isLoadingLine = value;
    })
  }

}
