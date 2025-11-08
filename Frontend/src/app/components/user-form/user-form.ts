import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user';
import { User, CreateUser, UpdateUser } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  isLoading = false;

  roles = [
    { value: 'Administrator', label: 'Administrator' },
    { value: 'User', label: 'User' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Viewer', label: 'Viewer' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          lastName: user.lastName,
          role: user.role
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading user', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;

      if (this.isEditMode && this.userId) {
        // Update user
        const updateUser: UpdateUser = this.userForm.value;
        this.userService.updateUser(this.userId, updateUser).subscribe({
          next: (user) => {
            this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/users']);
          },
          error: (error) => {
            this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      } else {
        // Create user
        const createUser: CreateUser = this.userForm.value;
        this.userService.createUser(createUser).subscribe({
          next: (user) => {
            this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/users']);
          },
          error: (error) => {
            this.snackBar.open('Error creating user', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      lastName: 'Last Name',
      role: 'Role'
    };
    return labels[fieldName] || fieldName;
  }
}

export { UserFormComponent as UserForm };
