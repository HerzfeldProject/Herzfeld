import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-protocol-modal',
  templateUrl: './protocol-modal.component.html',
  styleUrls: ['./protocol-modal.component.css']
})
export class ProtocolModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProtocolModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }


}








