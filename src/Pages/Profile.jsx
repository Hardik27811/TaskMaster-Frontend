import React, { useEffect, useState } from 'react'
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/tasks/profile');
                setProfile(res.data.profile);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header with Back Button */}
                <div className="p-6 pb-0">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>

                <div className="p-8 pt-4 flex flex-col items-center text-center">
                    {/* User Avatar */}
                    <div className="relative mb-4">
                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 rounded-full">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {profile.user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800">{profile.user.name}</h2>
                    <p className="text-gray-500 font-medium mb-8">{profile.user.email}</p>
                    
                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-3 gap-2 py-6 bg-gray-50 rounded-2xl">
                        <div className="border-r border-gray-200">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total</p>
                            <p className="text-xl font-extrabold text-gray-800">{profile.stats.total}</p>
                        </div>
                        <div className="border-r border-gray-200">
                            <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Done</p>
                            <p className="text-xl font-extrabold text-gray-800">{profile.stats.completed || 0}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-yellow-500 uppercase tracking-widest font-bold">Pending</p>
                            <p className="text-xl font-extrabold text-gray-800">{profile.stats.pending || 0}</p>
                        </div>
                    </div>

                    {/* <button 
                        onClick={() => navigate('/dashboard')}
                        className="mt-8 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all active:scale-95"
                    >
                        Manage My Tasks
                    </button> */}
                </div>
            </div>
        </div>
    );
}

export default Profile;