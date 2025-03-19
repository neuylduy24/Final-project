import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) { }

  // Lấy danh sách vai trò
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Lấy thông tin vai trò theo ID
  getRoleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Tạo vai trò mới
  createRole(roleData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, roleData);
  }

  // Cập nhật thông tin vai trò
  updateRole(id: string, roleData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, roleData);
  }

  // Xóa vai trò
  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 