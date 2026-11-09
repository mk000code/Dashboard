import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        studentId: '',
        name: '',
        age: '',
        course: '',
        cgpa: ''
    });

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    );

    const isAdmin = user?.role === 'admin';
    const canManageStudents = isAdmin || user?.role === 'teacher';

    // Fetch all students
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await API.get('/students');
            setStudents(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to fetch students'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle form inputs
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Open add form
    const handleAdd = () => {
        setEditId(null);

        setForm({
            studentId: '',
            name: '',
            age: '',
            course: '',
            cgpa: ''
        });

        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (student) => {
        setEditId(student._id);

        setForm({
            studentId: student.studentId || '',
            name: student.name || '',
            age: student.age ?? '',
            course: student.course || '',
            cgpa: student.cgpa ?? ''
        });

        setShowForm(true);
    };

    // Add or update student
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const studentData = {
                ...form,
                age: Number(form.age),
                cgpa: Number(form.cgpa)
            };

            if (editId) {
                await API.put(
                    `/students/${editId}`,
                    studentData
                );

                alert('Student updated successfully');
            } else {
                await API.post('/students', studentData);

                alert('Student added successfully');
            }

            setShowForm(false);
            setEditId(null);

            fetchStudents();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Operation failed'
            );
        }
    };

    // Delete one student
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this student?'
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/students/${id}`);

            alert('Student deleted successfully');

            fetchStudents();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Unable to delete student'
            );
        }
    };

    // Delete all students (admin only)
    const handleDeleteAll = async () => {
        const confirmDelete = window.confirm(
            'Are you sure? This will permanently delete ALL students!'
        );

        if (!confirmDelete) return;

        try {
            const response = await API.delete(
                '/students/delete-all'
            );

            alert(response.data.message);

            fetchStudents();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Unable to delete all students'
            );
        }
    };

    // Logout
    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');

            localStorage.removeItem('user');

            navigate('/login');

        } catch (error) {
            alert('Logout failed');
        }
    };

    const averageCGPA = students.length
        ? (
            students.reduce(
                (sum, student) => sum + Number(student.cgpa || 0),
                0
            ) / students.length
        ).toFixed(2)
        : '0.00';

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div className="brand">
                    <span className="brand-mark" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 9l10-5 10 5-10 5L2 9z" />
                            <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
                        </svg>
                    </span>
                    <h2>StudentHub</h2>
                </div>

                <div className="header-actions">
                    <div className="user-chip">
                        <span className="user-avatar">
                            {user?.name?.charAt(0)}
                        </span>
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <section className="dashboard-hero">
                <div className="dashboard-hero-inner">
                    <h1>Dashboard</h1>

                    <p className="subtitle">
                        Manage your student records
                    </p>
                </div>
            </section>

            <main className="dashboard-main">

                {/* Statistics */}
                <div className="stats-grid">

                    <div className="stat-card">
                        <span className="stat-icon" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="8" r="3.5" />
                                <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
                                <path d="M16 4.6a3.5 3.5 0 010 6.8M18 14.3c2 .7 3.5 2.6 3.5 5.7" />
                            </svg>
                        </span>
                        <div>
                            <h3>Total Students</h3>
                            <strong>{students.length}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <span className="stat-icon" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
                            </svg>
                        </span>
                        <div>
                            <h3>Average CGPA</h3>
                            <strong>{averageCGPA}</strong>
                        </div>
                    </div>

                </div>

                {/* Student actions */}
                <div className="table-card">

                    <div className="table-heading">

                        <h2>Student Directory</h2>

                        <div className="action-buttons">

                            {canManageStudents && (
                                <button
                                    className="add-btn"
                                    onClick={handleAdd}
                                >
                                    + Add Student
                                </button>
                            )}

                            {isAdmin && (
                                <button
                                    className="delete-all-btn"
                                    onClick={handleDeleteAll}
                                >
                                    Delete All
                                </button>
                            )}

                        </div>
                    </div>

                    {loading && (
                        <p className="status-text">Loading students...</p>
                    )}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {!loading && !error && (
                        <div className="table-scroll">

                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Course</th>
                                        <th>CGPA</th>
                                        {canManageStudents && <th>Actions</th>}
                                    </tr>
                                </thead>

                                <tbody>

                                    {students.map((student) => (
                                        <tr key={student._id}>

                                            <td>
                                                <span className="id-chip">
                                                    {student.studentId}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="student-cell">
                                                    <span className="student-avatar">
                                                        {student.name?.charAt(0)}
                                                    </span>
                                                    {student.name}
                                                </div>
                                            </td>
                                            <td>{student.age}</td>
                                            <td>
                                                <span className="course-tag">
                                                    {student.course}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="cgpa-pill">
                                                    {student.cgpa}
                                                </span>
                                            </td>

                                            {canManageStudents && <td>
                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEdit(student)}
                                                    >
                                                        Edit
                                                    </button>

                                                    {isAdmin && (
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(student._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}

                                                </div>
                                            </td>}

                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                            {students.length === 0 && (
                                <p className="empty-state">No students found.</p>
                            )}

                        </div>
                    )}

                </div>

                {/* Add/Edit Form */}
                {showForm && (

                    <div className="modal-overlay">

                        <div className="student-form">

                            <h2>
                                {editId ? 'Edit Student' : 'Add Student'}
                            </h2>

                            <p className="form-hint">
                                Fill in the student's details below.
                            </p>

                            <form onSubmit={handleSubmit}>

                                <label>Student ID</label>
                                <input
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={handleChange}
                                    placeholder="STU001"
                                    required
                                />

                                <label>Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                    required
                                />

                                <div className="form-row">
                                    <div>
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={form.age}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>CGPA</label>
                                        <input
                                            type="number"
                                            name="cgpa"
                                            value={form.cgpa}
                                            onChange={handleChange}
                                            min="0"
                                            max="10"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <label>Course</label>
                                <input
                                    name="course"
                                    value={form.course}
                                    onChange={handleChange}
                                    placeholder="CSE"
                                    required
                                />

                                <div className="form-buttons">

                                    <button type="submit">
                                        {editId ? 'Update Student' : 'Add Student'}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Dashboard;
