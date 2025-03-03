import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  tables: string[] = [];
  dataMap: any = {};

  constructor(private service: SharedService) {}

  ngOnInit(): void {
    this.service.getUsers().subscribe(data => {
      console.log("Données reçues:", data);

      if (data && typeof data === "object") {
        this.tables = Object.keys(data);
        this.dataMap = data;
      } else {
        this.tables = [];
        this.dataMap = {};
      }
    });
  }

  getColumns(table: string): string[] {
    return this.dataMap[table] && this.dataMap[table].length > 0
      ? Object.keys(this.dataMap[table][0]) : [];
  }

  getValues(row: any): any[] {
    return Object.values(row);
  }
}
