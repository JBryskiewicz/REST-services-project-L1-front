import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {BackendConnectorService} from '../../services/backend-connectors/backend-connector.service';
import {UserDestinationView} from '../../domain/appDestination.type';
import {
  SaveViewDialogComponent
} from '../../components/application/dashboard/save-view-dialog/save-view-dialog.component';
import {take, tap} from 'rxjs';
import {Destination} from '../../domain/appDestination.type';

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

  errorMessage: string = '';

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
      .pipe(
        take(1),
        tap(() => this.errorMessage = ''),
      )
      .subscribe({
        next: (views) => {
          this.userViews = views
        }, error: (error) => {
          switch (error.status) {
            case 403:
              this.errorMessage = `${error.status}: Bad request, cannot find items.`
              break;
            case 404:
              this.errorMessage = `${error.status}: Cannot find items.`
              break;
          }
        }
      });
  }

  loadView(view: UserDestinationView): void {
    let destinations;
    if (view.regionInfo) {
      try {
        destinations = JSON.parse(view.regionInfo);
      } catch (e) {
        destinations = [];
      }
    } else {
      destinations = [];
    }
    this.dialogRef.close(destinations);
  }

  deleteView(viewId: number): void {
    if (!viewId) {
      return;
    }

    this.backend.deleteUserDestinationView(viewId)
      .pipe(
        take(1),
        tap(() => this.errorMessage = ''),
      )
      .subscribe({
        next: () => {
          this.userViews = this.userViews.filter(v => v.id !== viewId);
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.errorMessage = `${error.status}: Bad request, cannot delete.`
              break;
            case 404:
              this.errorMessage = `${error.status}: cannot delete, item missing.`
              break;
          }
        }
      });
  }

  editView(view: UserDestinationView): void {
    const dialogRef = this.dialog.open(SaveViewDialogComponent, {
      width: '400px',
      data: {initialValue: view.viewName}
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((newViewName: string | null) => {
      if (newViewName) {
        const updatedView = {...view, viewName: newViewName, regionInfo: JSON.stringify(this.currentDestinations)};
        this.backend.editUserDestinationView(updatedView)
          .pipe(
            take(1),
            tap(() => this.errorMessage = ''),
          )
          .subscribe({
            next: (updated) => {
              this.userViews = this.userViews.map(v => v.id === updated.id ? updated : v);
            },
            error: (error) => {
              switch (error.status) {
                case 403:
                  this.errorMessage = `${error.status}: Bad request, cannot update.`
                  break;
                case 404:
                  this.errorMessage = `${error.status}: cannot edit, item missing.`
                  break;
              }
            }
          });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
