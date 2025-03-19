import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) { }

  // Lấy danh sách người dùng
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Lấy thông tin người dùng theo ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Cập nhật thông tin người dùng
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  // Xóa người dùng
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cập nhật thể loại yêu thích
  updateFavoriteCategories(userId: string, categories: string[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/favorite-categories`, categories);
  }

  // Đánh dấu sách
  bookmarkBook(userId: string, bookId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/bookmark-book/${bookId}`, {});
  }

  // Xóa đánh dấu sách
  removeBookmark(userId: string, bookId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/remove-bookmark/${bookId}`);
  }

  // Lấy danh sách sách đã đánh dấu
  getBookmarkedBooks(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${userId}/bookmarked-books`);
  }
} 