import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BackendConnectorService } from '../../services/backend-connectors/backend-connector.service';
import { UserDestinationView } from '../../domain/appDestination.type';
import { SaveViewDialogComponent } from '../../components/application/dashboard/save-view-dialog/save-view-dialog.component';
import { take } from 'rxjs';
import { Destination } from '../../domain/appDestination.type';

@Component({
  selector: 'app-load-view-dialog',
  standalone: false,
  templateUrl: './load-view-dialog.component.html',
  styleUrls: ['./load-view-dialog.component.scss']
})
export class LoadViewDialogComponent implements OnInit {
  userViews: UserDestinationView[] = [];
  userId: string;
  currentDestinations: Destination[] = [];

  constructor(
    private dialogRef: MatDialogRef<LoadViewDialogComponent>,
    private backend: BackendConnectorService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: { userId: string, currentDestinations: Destination[] }
  ) {
    this.userId = data.userId;
    this.currentDestinations = data.currentDestinations;
  }

  ngOnInit(): void {

    this.backend.getAllForUser(this.userId)
      .pipe(take(1))
      .subscribe(views => this.userViews = views);
  }

  loadView(view: UserDestinationView): void {
    console.log('Loaded view:', view);
    let destinations;
    if (view.regionInfo) {
      try {
        destinations = JSON.parse(view.regionInfo);
      } catch (e) {
        console.error('Unable to parse regionInfo', e);
        destinations = [];
      }
    } else {
      destinations = [];
    }
    this.dialogRef.close(destinations);
  }

  deleteView(viewId: number): void {
    console.log('DELETE clicked for ID:', viewId);
    if (!viewId) {
      console.error('viewId invalid or undefined');
      return;
    }

    this.backend.deleteUserDestinationView(viewId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('View deleted:', viewId);
          this.userViews = this.userViews.filter(v => v.id !== viewId);
        },
          error: (err) => {
          console.error('Error when deleting:', err);
        }
      });
  }

  editView(view: UserDestinationView): void {
    const dialogRef = this.dialog.open(SaveViewDialogComponent, {
      width: '400px',
      data: { initialValue: view.viewName }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((newViewName: string | null) => {
      if (newViewName) {
        const updatedView = { ...view, viewName: newViewName, regionInfo: JSON.stringify(this.currentDestinations) };
        console.log('Sending to update:', updatedView);
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
