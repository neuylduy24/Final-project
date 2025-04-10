import React, { useState, useEffect } from 'react';
import userService from '../../service/userService';
import { toast } from 'react-toastify';

const UserForm = ({ form, setForm, handleSubmit, closeForm, isEditing }) => {
    const [avatarPreview, setAvatarPreview] = useState(form.avatar || '');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Update avatar preview when form changes
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
        
        // Validate required fields
        if (!form.username || !form.username.trim()) {
            toast.error("Please enter username");
            return;
        }

        if (!form.email || !form.email.trim()) {
            toast.error("Please enter email");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Validate password for new users
        if (!isEditing) {
            if (!form.password || form.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }
        }
        
        try {
            let updatedForm = { ...form };
            
            // If adding new user, automatically assign "reader" role
            if (!isEditing) {
                updatedForm.roles = [2]; // Assuming reader role ID is 2
            }
            
            // If there's a new avatar file, upload to server
            if (selectedFile) {
                const avatarUrl = await userService.uploadAvatar(selectedFile);
                updatedForm.avatar = avatarUrl;
            }
            
            // Call parent's submit function
            handleSubmit(e, updatedForm);
            toast.success(isEditing ? "✏️ User updated successfully!" : "✅ User added successfully!");
        } catch (error) {
            toast.error("Unable to save user information. Please try again later.");
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h3>{isEditing ? 'Edit User' : 'Add New User'}</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="avatar-upload">
                        <div className="avatar-preview">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" />
                            ) : (
                                <div className="avatar-placeholder">
                                    No image
                                </div>
                            )}
                        </div>
                        <label htmlFor="avatar-input">Choose Avatar</label>
                        <input 
                            type="file" 
                            id="avatar-input" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username || ''}
                            onChange={handleChange}
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
                        />
                    </div>

                    {!isEditing && (
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password || ''}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div className="form-group">
                            <label>Role:</label>
                            <div className="role-badges">
                                {form.roles && form.roles.includes(1) ? (
                                    <span className="role-badge admin">Admin</span>
                                ) : (
                                    <span className="role-badge reader">Reader</span>
                                )}
                                <p className="note">Role is set automatically and cannot be changed</p>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="save">
                            {isEditing ? 'Update' : 'Add'}
                        </button>
                        <button type="button" className="cancel" onClick={closeForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
