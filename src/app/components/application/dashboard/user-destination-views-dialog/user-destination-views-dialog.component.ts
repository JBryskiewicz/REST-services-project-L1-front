import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDestinationView } from '../../../../domain/appDestination.type';
import { BackendConnectorService } from '../../../../services/backend-connectors/backend-connector.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-destination-views-dialog',
  templateUrl: './user-destination-views-dialog.component.html',
  styleUrls: ['./user-destination-views-dialog.component.scss'],
  imports: [MatListModule, MatButtonModule, CommonModule],
  standalone: true,
})
export class UserDestinationViewsDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { views: UserDestinationView[] },
  private dialogRef: MatDialogRef<UserDestinationViewsDialogComponent>,
  private backend: BackendConnectorService
  ) {}

  loadView(view: UserDestinationView): void {
    this.dialogRef.close(view);
  }

  deleteView(view: UserDestinationView): void {
    this.backend.deleteUserDestinationView(view.userId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.data.views = this.data.views.filter(v => v.userId !== view.userId);
        },
        error: (err) => {
          console.error('Failed to delete view', err);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
