import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ children, href }) => {
    return (
        <div style={{ margin: '10px 0' }}>
            <a
                href={href}
                style={{
                    textDecoration: 'none',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s',
                    display: 'block',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                {children}
            </a>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/dashboard');
            return;
        }
        loadUsers(currentPage); // Load users initially
    }, [token, currentPage]);

    const loadUsers = (page) => {
        fetch(`http://localhost:8088/api/v1/admin/users?page=${page}&size=${pageSize}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then(data => {
                setUsers(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(error => console.error('Error loading users:', error));
    };

    const deleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        fetch(`http://localhost:8088/api/v1/admin/users/${userId}`, { method: 'DELETE' })
            .then(() => loadUsers(currentPage))
            .catch(error => console.error('Error deleting user:', error));
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', background: '#f4f4f4', height: '100vh' }}>
            {/* Side Menu */}
            <div style={{ width: '250px', padding: '20px', background: '#343a40', color: '#fff', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.2)' }}>
                <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>Menu Quản Trị</h2>
                <MenuItem href="/">Home</MenuItem>
                <MenuItem href="/admin/dashboard">Dashboard</MenuItem>
                <MenuItem href="/admin/order-management">Quản lý Đặt Hàng</MenuItem>
                <MenuItem href="/admin/user-management">Quản lý Người dùng</MenuItem>
                <MenuItem href="/admin/add-product">Thêm Sản phẩm</MenuItem>
                <MenuItem href="/admin/add-edit-user">Thêm/Sửa Người dùng</MenuItem>
                <MenuItem href="/admin/product-management">Quản lý Sản phẩm</MenuItem>
                <MenuItem href="/admin/category-management">Quản lý Danh Mục</MenuItem>
                <MenuItem href="/admin/product-category-management">Quản lý Danh Mục Sản Phẩm</MenuItem>
            </div>

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#343a40' }}>Quản lý Người Dùng</h1>
                <button 
                    onClick={() => navigate('/admin/add-edit-user')}
                    style={{ marginBottom: '20px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                    Thêm Người Dùng Mới
                </button>

                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>#</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>User_ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Tên Đăng Nhập</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Email</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Điện Thoại</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Địa Chỉ</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Vai Trò</th>
                                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{currentPage * pageSize + index + 1}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.username}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.email}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.phone}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.address}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.role.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                        <button onClick={() => navigate(`/admin/add-edit-user?id=${user.id}`)} style={{ marginRight: '10px' }}>Sửa</button>
                                        <button onClick={() => deleteUser(user.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage <= 0}
                        style={{ marginRight: '10px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        style={{ marginLeft: '10px', padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
