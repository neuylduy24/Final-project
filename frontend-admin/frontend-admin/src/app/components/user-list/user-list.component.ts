import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'roles', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.snackBar.open('Lỗi khi tải danh sách người dùng', 'Đóng', {
          duration: 3000
        });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('Cập nhật thông tin người dùng thành công', 'Đóng', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Lỗi khi cập nhật thông tin người dùng', 'Đóng', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('Xóa người dùng thành công', 'Đóng', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Lỗi khi xóa người dùng', 'Đóng', {
            duration: 3000
          });
        }
      });
    }
  }
} 