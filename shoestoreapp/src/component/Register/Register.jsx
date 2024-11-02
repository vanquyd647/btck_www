import React, { useState } from 'react';
import '../css/register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match! Please check again.");
            setLoading(false);
            return;
        }

        // Chỉ giữ lại mật khẩu trong formData trước khi gửi đến backend
        const { confirmPassword, ...dataToSend } = formData; // Bỏ qua confirmPassword

        try {
            const response = await fetch('http://localhost:8088/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify(dataToSend), // Chỉ gửi thông tin mà không có confirmPassword
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                setLoading(false);
                return;
            }

            // Hiện modal OTP để xác minh
            const data = await response.json();
            localStorage.setItem('otp', data.otp);
            localStorage.setItem('user', JSON.stringify(data.user));

            setShowOtpModal(true);
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('User:', user);
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const storedOtp = localStorage.getItem('otp');
        const user = JSON.parse(localStorage.getItem('user'));


        if (storedOtp !== otp) {
            setErrorMessage('Invalid OTP. Please try again.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8088/api/v1/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ otp, user }), // Gửi OTP và thông tin người dùng trong cùng một đối tượng
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            localStorage.removeItem('otp');
            localStorage.removeItem('user');

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                return;
            }

            const data = await response.json();
            alert(data.message);
            // Thực hiện hành động chuyển hướng hoặc khác ở đây

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="register-form">
                {/* Registration Fields */}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-register" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="otp-modal">
                    <h2>Enter OTP</h2>
                    <input type="text" value={otp} onChange={handleOtpChange} placeholder="Enter OTP" required />
                    <button onClick={handleOtpSubmit} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button onClick={() => setShowOtpModal(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Register;
