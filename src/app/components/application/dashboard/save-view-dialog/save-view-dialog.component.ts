import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'save-view-dialog',
  templateUrl: './save-view-dialog.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class SaveViewDialogComponent implements OnInit {
  form = new FormGroup({
    viewName: new FormControl('', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<SaveViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { initialValue?: string }
  ) {}

  ngOnInit(): void {
    if (this.data.initialValue) {
      this.form.patchValue({ viewName: this.data.initialValue });
    }
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.viewName);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
