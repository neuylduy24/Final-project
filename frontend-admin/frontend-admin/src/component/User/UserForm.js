import React, { useState, useEffect } from 'react';
import userService from '../../service/userService';

const UserForm = ({ form, setForm, handleSubmit, closeForm, isEditing }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(form.avatar || '');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Cập nhật avatar preview khi form thay đổi
        if (form.avatar) {
            setAvatarPreview(form.avatar);
        }
    }, [form.avatar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setAvatarPreview(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let updatedForm = { ...form };
            
            // Nếu đang thêm mới, tự động gán vai trò "reader"
            if (!isEditing) {
                // Tìm ID của vai trò reader hoặc dùng ID cố định nếu biết trước
                updatedForm.roles = [2]; // Giả sử ID của vai trò reader là 2, điều chỉnh nếu cần
            }
            
            // Nếu có file ảnh đại diện mới, upload lên server
            if (selectedFile) {
                const avatarUrl = await userService.uploadAvatar(selectedFile);
                updatedForm.avatar = avatarUrl;
            }
            
            // Gọi hàm submit của parent
            handleSubmit(e, updatedForm);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Không thể lưu thông tin người dùng. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h3>{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="avatar-upload">
                        <div className="avatar-preview">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" />
                            ) : (
                                <div className="avatar-placeholder">
                                    Chưa có ảnh
                                </div>
                            )}
                        </div>
                        <label htmlFor="avatar-input">Chọn ảnh đại diện</label>
                        <input 
                            type="file" 
                            id="avatar-input" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Tên người dùng:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isEditing && (
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password || ''}
                                onChange={handleChange}
                                required={!isEditing}
                                minLength={6}
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div className="form-group">
                            <label>Vai trò:</label>
                            <div className="role-badges">
                                {form.roles && form.roles.includes(1) ? (
                                    <span className="role-badge admin">Admin</span>
                                ) : (
                                    <span className="role-badge reader">Reader</span>
                                )}
                                <p className="note">Vai trò được thiết lập tự động, không thể thay đổi</p>
                            </div>
                        </div>
                    )}

                    <div className="form-buttons">
                        <button type="submit" className="btn-submit">
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={closeForm}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
