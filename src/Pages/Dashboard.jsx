import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Dashboard = () => {
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState('');
    const [description, setdescription] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                setTasks(res.data.tasks);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/tasks', { title, description });
            setTasks([res.data.task, ...tasks]);
            setTitle('');
            setdescription('');
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
            const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
            setTasks(tasks.map(t => t._id === task._id ? res.data.task : t));
        } catch (err) {
            console.error(err);
        }
    }

    const deleteTask = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        nav('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Nav */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold text-indigo-600 tracking-tight">TaskManager</h1>
                <div className="flex gap-4">
                    <button onClick={() => nav('/profile')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Profile</button>
                    <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">Logout</button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto mt-8 px-4">
                {/* Form Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Task</h2>
                    <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text"
                            placeholder="What needs to be done?"
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input 
                            type="text"
                            placeholder="Description (Optional)"
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:bg-indigo-300"
                        >
                            {loading ? 'Adding...' : 'Add Task'}
                        </button>
                    </form>
                </div>

                {/* Task List Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tasks</h2>
                <div className="space-y-4">
                    {tasks.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">No tasks yet. Start by adding one above!</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-bold text-lg ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {task.title}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm">{task.description || 'No description provided.'}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => toggleStatus(task)}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
                                    >
                                        {task.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                                    </button>
                                    <button 
                                        onClick={() => deleteTask(task._id)}
                                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                        title="Delete Task"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}

export default Dashboard