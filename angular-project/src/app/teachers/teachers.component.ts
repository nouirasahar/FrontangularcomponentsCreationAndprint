import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
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
