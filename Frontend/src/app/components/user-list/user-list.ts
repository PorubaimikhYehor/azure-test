import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'lastName', 'role', 'createdAt', 'actions'];
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    console.log('Loading users from API...');
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users);
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  editUser(id: string): void {
    this.router.navigate(['/user-form', id]);
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  createUser(): void {
    this.router.navigate(['/user-form']);
  }
}

export { UserListComponent as UserList };
