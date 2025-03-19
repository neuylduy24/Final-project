import React from 'react';

const UserTable = ({ users, handleEdit, handleDelete, setShowForm }) => {
    // Hàm hiển thị vai trò với các màu sắc khác nhau
    const renderRoles = (roles) => {
        if (!roles || roles.length === 0) return <span>Không có vai trò</span>;
        
        return (
            <div className="role-badges">
                {roles.map((role, index) => {
                    let roleClass = '';
                    
                    // Xác định class dựa trên tên vai trò
                    if (typeof role === 'string') {
                        const roleLower = role.toLowerCase();
                        if (roleLower.includes('admin')) roleClass = 'admin';
                        else if (roleLower.includes('author')) roleClass = 'author';
                        else if (roleLower.includes('reader')) roleClass = 'reader';
                    } else if (role.name) {
                        const roleLower = role.name.toLowerCase();
                        if (roleLower.includes('admin')) roleClass = 'admin';
                        else if (roleLower.includes('author')) roleClass = 'author';
                        else if (roleLower.includes('reader')) roleClass = 'reader';
                    }
                    
                    return (
                        <span key={index} className={`role-badge ${roleClass}`}>
                            {typeof role === 'string' ? role : role.name}
                        </span>
                    );
                })}
            </div>
        );
    };

    // Hàm format ngày tạo
    const formatCreatedDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            // Xử lý cả trường hợp nhận ISO string hoặc timestamp
            const date = new Date(dateString);
            
            // Kiểm tra nếu là ngày hợp lệ
            if (isNaN(date.getTime())) {
                return 'N/A';
            }
            
            // Format ngày theo định dạng Việt Nam
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
        }
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Danh sách người dùng</h2>
                <button className="btn-add" onClick={() => setShowForm(true)}>
                    Thêm người dùng mới
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Người dùng</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu người dùng</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    <div className="user-info">
                                        {user.avatar ? (
                                            <img
                                                className="user-avatar"
                                                src={user.avatar}
                                                alt={user.username}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/40';
                                                }}
                                            />
                                        ) : (
                                            <div className="user-avatar" style={{ backgroundColor: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                            </div>
                                        )}
                                        {user.username}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>{renderRoles(user.roles)}</td>
                                <td>{formatCreatedDate(user.createdAt)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
