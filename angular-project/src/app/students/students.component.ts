import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  tables: string[] = [];  // Will hold the table names (students, teachers, subjects)
  dataMap: any = {};      // Will store data for each table

  constructor(private service: SharedService) {}

  ngOnInit(): void {
    this.service.getUsers().subscribe(data => {
      console.log("Données reçues:", data);

      if (data && typeof data === "object") {
        this.tables = Object.keys(data);  // Store all table names dynamically
        this.dataMap = data;  // Store all the data dynamically
      } else {
        this.tables = [];
        this.dataMap = {};
      }
    });
  }

  // Get columns for the table dynamically
  getColumns(table: string): string[] {
    return this.dataMap[table] && this.dataMap[table].length > 0
      ? Object.keys(this.dataMap[table][0]) : [];
  }

  // Get the values of a row dynamically
  getValues(row: any): any[] {
    return Object.values(row);
  }
}
