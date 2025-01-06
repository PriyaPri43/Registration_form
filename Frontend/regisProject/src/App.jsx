import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function App() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        // email: '',
        // phone: '',
        // address: '',
        // city: '',
        // state: '',
        // country: '',
        // zipcode: '',
        // age: ''
    });
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const register = async () => {
        try {
            await axios.post('http://localhost:5000/register', formData);
            alert("Registration Successful! Fetch users to view details.");
        } catch (error) {
            alert("Error during registration");
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: formData.username,
                password: formData.password
            });
            setToken(response.data.token);
            alert("Login Successful!");
        } catch (error) {
            alert("Invalid credentials");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users', {
                headers: { Authorization: token }
            });
            setUsers(response.data);
        } catch (error) {
            alert("Error fetching users");
        }
    };

    return (
        
            <Container style={{
                backgroundColor: 'rgba(208, 165, 216, 0.9)',
                padding: '20px',
                borderRadius: '15px',
                marginLeft: '300px',
            }}>
                <h1 style={{ textAlign: 'center',color: 'rgb(70, 30, 87)', marginBottom: '20px' }}>Registration Form</h1>
                <div style={{ marginBottom: '20px' }}>
                    {Object.keys(formData).map((field, index) => (
                        <TextField
                            key={index}
                            name={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field]}
                            onChange={handleChange}
                            style={{ margin: '5px 0', color: 'rgb(218, 39, 110)' }}
                            fullWidth
                        />
                    ))}
                    <Button variant="contained" color="primary" onClick={register} style={{ marginTop: '20px', width: '100%' }}>
                        Register
                    </Button>
                    <Button variant="contained" color="secondary" onClick={login} style={{ marginTop: '20px', width: '100%' }}>
                        Login
                    </Button>
                </div>
                <Button variant="contained" color="success" onClick={fetchUsers} style={{ marginTop: '10px', width: '100%' }}>
                    Fetch Users
                </Button>
                {users.length > 0 && (
                    <TableContainer component={Paper} style={{ maxHeight: '300px', overflow: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(users[0]).map((key, index) => (
                                        <TableCell key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={index}>
                                        {Object.values(user).map((value, idx) => (
                                            <TableCell key={idx}>{value}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
      
    );
}

export default App;
