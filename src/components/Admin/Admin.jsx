import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { postRegister, postLogin } from '../../Apis/AdminApis';
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash,  } from '@fortawesome/free-solid-svg-icons'; // Import eye icons

const Admin = () => {
    const [isRegistering, setIsRegistering] = useState(true);
    const [name, setName] = useState('');
    const [mobilenumber, setMobilenumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const navigate = useNavigate(); // Initialize navigate

    const validateMobileNumber = (number) => {
        // Validate mobile number (10 digits)
        const regex = /^[0-9]{10}$/;
        return regex.test(number);
    };

    const validatePassword = (pwd) => {
        // Validate password strength
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return (
            pwd.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChars
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateMobileNumber(mobilenumber)) {
            setMessage('Please enter a valid mobile number (10 digits).');
            return;
        }

        if (isRegistering && !validatePassword(password)) {
            setMessage('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
            return;
        }

        try {
            let response;
            if (isRegistering) {
                const response = await postRegister(name, mobilenumber, password);
                setMessage(`Registration successful! Welcome ${response.name}`);
                navigate('/products', { state: { adminName: response.name } });
            } else {
                const response = await postLogin(mobilenumber, password);
                setMessage(`Login successful! Welcome back ${response.name}`);
                navigate('/products', { state: { adminName: response.name } });
            }
            setName('');
            setMobilenumber('');
            setPassword('');
        } catch (error) {
            setMessage(isRegistering 
                ? 'Registration failed. Please try again.' 
                : 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className='center-wrapper'> {/* New wrapper div */}
            <div className='admin-container'>
                <h2 className='admin-header'>{isRegistering ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <input
                            type="text"
                            className='adminName'
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="text"
                        className='adminMobilenumber'
                        placeholder="Mobile Number"
                        value={mobilenumber}
                        onChange={(e) => setMobilenumber(e.target.value)}
                        required
                    />
                    <div className='password-container'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='adminPassword'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className='password-toggle' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <button className='adminBtn' type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
                {message && <p className='admin-msg'>{message}</p>}
                <p className='admin-P'>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? 'Login' : 'Register'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Admin;
