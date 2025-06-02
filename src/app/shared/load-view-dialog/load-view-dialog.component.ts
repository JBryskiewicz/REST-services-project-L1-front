import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BackendConnectorService } from '../../services/backend-connectors/backend-connector.service';
import { UserDestinationView } from '../../domain/appDestination.type';
import { SaveViewDialogComponent } from '../../components/application/dashboard/save-view-dialog/save-view-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-load-view-dialog',
  standalone: false,
  templateUrl: './load-view-dialog.component.html',
})
export class LoadViewDialogComponent implements OnInit {
  userViews: UserDestinationView[] = [];
  userId: string;

  constructor(
    private dialogRef: MatDialogRef<LoadViewDialogComponent>,
    private backend: BackendConnectorService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: { userId: string }
  ) {
    this.userId = data.userId;
  }

  ngOnInit(): void {
    this.backend.getAllForUser(this.userId)
      .pipe(take(1))
      .subscribe(views => this.userViews = views);
  }

  loadView(view: UserDestinationView): void {
    this.dialogRef.close(view.destinations);
  }

  deleteView(viewId: number): void {
    this.backend.deleteUserDestinationView(viewId)
      .pipe(take(1))
      .subscribe(() => {
        this.userViews = this.userViews.filter(v => v.id !== viewId);
      });
  }

  editView(view: UserDestinationView): void {
    const dialogRef = this.dialog.open(SaveViewDialogComponent, {
      width: '400px',
      data: { initialValue: view.viewName } // opcjonalne – jeśli chcesz podać starą nazwę
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((newViewName: string | null) => {
      if (newViewName) {
        const updatedView = { ...view, viewName: newViewName };
        this.backend.editUserDestinationView(updatedView)
          .pipe(take(1))
          .subscribe(updated => {
            this.userViews = this.userViews.map(v => v.id === updated.id ? updated : v);
          });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
