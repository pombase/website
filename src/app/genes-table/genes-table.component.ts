import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() genes: Array<any>;

  public currentPage: number = 1;
  public itemsPerPage: number = 20;
  public showPagination = true;
  public thisPageGenes: Array<any>;
  
  constructor() { }

  ngOnInit() {
    this.onPageChange({page: this.currentPage, itemsPerPage: this.itemsPerPage});
  }

  showAll() {
    this.itemsPerPage = this.genes.length;
    this.showPagination = false;
    this.onPageChange({page: 1, itemsPerPage: this.itemsPerPage});
  }

  onPageChange(page: any) {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : this.genes.length;
    this.thisPageGenes = this.genes.slice(start, end);
  }
}
