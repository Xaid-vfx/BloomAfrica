'use client'

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Pencil, Trash2, Users, Briefcase, UserCheck, ChevronRight, BookOpen } from 'lucide-react';

interface PendingTrainer {
    id: string;
    user_id: string;
    business_name: string | null;
    registrant_full_name: string | null;
    trainer_category: string | null;
    primary_industry: string | null;
    created_at: string;
}

interface RecentUser {
    id: string;
    name: string | null;
    email: string | null;
    type: 'learner' | 'trainer';
    created_at: string;
}

interface Job {
    uid: string;
    title: string | null;
    company_name: string | null;
    location: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    type: string | null;
    category: string | null;
    created_at: string;
    deadline: string | null;
    recruiter: string | null;
    isVerified: boolean | null;
}

interface Curriculum {
    id: string;
    name: string;
    description: string | null;
    short_description: string | null;
    primary_industry: string | null;
    secondary_industries: string[] | null;
    skill_level: string | null;
    duration_weeks: number | null;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

type ExpandedSection = 'trainers' | 'users' | 'jobs' | 'curriculums' | null;

export default function AdminDashboardPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pendingTrainers, setPendingTrainers] = useState<PendingTrainer[]>([]);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [isLoadingTrainers, setIsLoadingTrainers] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [isLoadingCurriculums, setIsLoadingCurriculums] = useState(false);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const [deletingJobIds, setDeletingJobIds] = useState<Set<string>>(new Set());
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Job>>({});
    const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPendingTrainers();
            fetchRecentUsers();
            fetchRecentJobs();
            fetchCurriculums();
        }
    }, [isAuthenticated]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                toast.error('Invalid password');
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            toast.error('Authentication failed');
        }
    };

    const fetchPendingTrainers = async () => {
        setIsLoadingTrainers(true);
        try {
            const response = await fetch('/api/admin/trainers/pending');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch pending trainers');
            setPendingTrainers(data.trainers || []);
        } catch (error: any) {
            console.error('Error fetching pending trainers:', error);
            toast.error(error.message || 'Failed to load pending trainers');
        } finally {
            setIsLoadingTrainers(false);
        }
    };

    const fetchRecentUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await fetch('/api/admin/users/recent');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch recent users');
            setRecentUsers(data.users || []);
        } catch (error: any) {
            console.error('Error fetching recent users:', error);
            toast.error(error.message || 'Failed to load recent users');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchRecentJobs = async () => {
        setIsLoadingJobs(true);
        try {
            const response = await fetch('/api/admin/jobs/recent');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch recent apprenticeships');
            setRecentJobs(data.jobs || []);
        } catch (error: any) {
            console.error('Error fetching recent apprenticeships:', error);
            toast.error(error.message || 'Failed to load recent apprenticeships');
        } finally {
            setIsLoadingJobs(false);
        }
    };

    const fetchCurriculums = async () => {
        setIsLoadingCurriculums(true);
        try {
            const response = await fetch('/api/admin/curriculums');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch curriculums');
            setCurriculums(data.curriculums || []);
        } catch (error: any) {
            console.error('Error fetching curriculums:', error);
            toast.error(error.message || 'Failed to load curriculums');
        } finally {
            setIsLoadingCurriculums(false);
        }
    };

    const updateTrainerStatus = async (profileId: string, status: 'approved' | 'rejected') => {
        setProcessingIds(prev => new Set(prev).add(profileId));
        try {
            const response = await fetch('/api/admin/trainers/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, status }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update status');
            }
            toast.success(`Trainer ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
            setPendingTrainers(prev => prev.filter(t => t.id !== profileId));
        } catch (error: any) {
            console.error('Error updating trainer status:', error);
            toast.error(error.message || 'Failed to update trainer status');
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(profileId);
                return next;
            });
        }
    };

    const deleteUser = async (userId: string, userType: 'learner' | 'trainer') => {
        if (!confirm(`Are you sure you want to delete this ${userType}? This action cannot be undone.`)) return;
        setDeletingIds(prev => new Set(prev).add(userId));
        try {
            const response = await fetch('/api/admin/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userType }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete user');
            toast.success(`${userType === 'learner' ? 'Learner' : 'Trainer'} deleted successfully`);
            setRecentUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user');
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    const deleteJob = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this apprenticeship? This action cannot be undone.')) return;
        setDeletingJobIds(prev => new Set(prev).add(jobId));
        try {
            const response = await fetch(`/api/admin/jobs/${jobId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete apprenticeship');
            toast.success('Apprenticeship deleted successfully');
            setRecentJobs(prev => prev.filter(j => j.uid !== jobId));
        } catch (error: any) {
            console.error('Error deleting apprenticeship:', error);
            toast.error(error.message || 'Failed to delete apprenticeship');
        } finally {
            setDeletingJobIds(prev => {
                const next = new Set(prev);
                next.delete(jobId);
                return next;
            });
        }
    };

    const openEditModal = (job: Job) => {
        setEditingJob(job);
        setEditFormData({
            title: job.title || '',
            company_name: job.company_name || '',
            city: job.city || '',
            state: job.state || '',
            country: job.country || '',
            type: job.type || '',
            category: job.category || '',
            isVerified: job.isVerified || false,
        });
    };

    const closeEditModal = () => {
        setEditingJob(null);
        setEditFormData({});
    };

    const updateJob = async () => {
        if (!editingJob) return;
        try {
            const response = await fetch(`/api/admin/jobs/${editingJob.uid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update apprenticeship');
            toast.success('Apprenticeship updated successfully');
            setRecentJobs(prev => prev.map(j => (j.uid === editingJob.uid ? { ...j, ...editFormData } : j)));
            closeEditModal();
        } catch (error: any) {
            console.error('Error updating apprenticeship:', error);
            toast.error(error.message || 'Failed to update apprenticeship');
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-white">Admin Dashboard</h2>
                        <p className="mt-2 text-center text-sm text-gray-400">Enter your admin password</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#14B8A6] hover:bg-[#0D9488]"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <button onClick={fetchPendingTrainers} className="text-xs text-[#14B8A6] hover:text-[#0D9488]">Refresh All</button>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-4 gap-4 h-[calc(100vh-100px)]">
                {/* Pending Trainers Card */}
                <div
                    onClick={() => setExpandedSection('trainers')}
                    className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition-colors overflow-hidden flex flex-col"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <UserCheck size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white">Pending Approvals</h2>
                                <p className="text-2xl font-bold text-amber-400">{pendingTrainers.length}</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {isLoadingTrainers ? (
                            <div className="text-gray-500 text-xs">Loading...</div>
                        ) : pendingTrainers.length === 0 ? (
                            <div className="text-gray-500 text-xs">No pending approvals</div>
                        ) : (
                            <div className="space-y-1">
                                {pendingTrainers.slice(0, 8).map((t) => (
                                    <div key={t.id} className="text-xs bg-gray-700/50 rounded px-2 py-1 truncate">
                                        <span className="text-white">{t.business_name || t.registrant_full_name || 'Unknown'}</span>
                                        <span className="text-gray-400 ml-2">{t.primary_industry}</span>
                                    </div>
                                ))}
                                {pendingTrainers.length > 8 && (
                                    <div className="text-xs text-gray-500">+{pendingTrainers.length - 8} more</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Users Card */}
                <div
                    onClick={() => setExpandedSection('users')}
                    className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition-colors overflow-hidden flex flex-col"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Users size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white">Recent Users</h2>
                                <p className="text-2xl font-bold text-blue-400">{recentUsers.length}</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {isLoadingUsers ? (
                            <div className="text-gray-500 text-xs">Loading...</div>
                        ) : recentUsers.length === 0 ? (
                            <div className="text-gray-500 text-xs">No recent users</div>
                        ) : (
                            <div className="space-y-1">
                                {recentUsers.slice(0, 8).map((u) => (
                                    <div key={u.id} className="text-xs bg-gray-700/50 rounded px-2 py-1 truncate flex items-center justify-between">
                                        <span className="text-white truncate">{u.name || u.email || 'Unknown'}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${u.type === 'learner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {u.type === 'learner' ? 'L' : 'T'}
                                        </span>
                                    </div>
                                ))}
                                {recentUsers.length > 8 && (
                                    <div className="text-xs text-gray-500">+{recentUsers.length - 8} more</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Apprenticeships Card */}
                <div
                    onClick={() => setExpandedSection('jobs')}
                    className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition-colors overflow-hidden flex flex-col"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Briefcase size={20} className="text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white">Recent Apprenticeships</h2>
                                <p className="text-2xl font-bold text-green-400">{recentJobs.length}</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {isLoadingJobs ? (
                            <div className="text-gray-500 text-xs">Loading...</div>
                        ) : recentJobs.length === 0 ? (
                            <div className="text-gray-500 text-xs">No recent apprenticeships</div>
                        ) : (
                            <div className="space-y-1">
                                {recentJobs.slice(0, 8).map((j) => (
                                    <div key={j.uid} className="text-xs bg-gray-700/50 rounded px-2 py-1 truncate">
                                        <span className="text-white">{j.title || 'Untitled'}</span>
                                        <span className="text-gray-400 ml-2">{j.company_name}</span>
                                    </div>
                                ))}
                                {recentJobs.length > 8 && (
                                    <div className="text-xs text-gray-500">+{recentJobs.length - 8} more</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Curriculums Card */}
                <div
                    onClick={() => setExpandedSection('curriculums')}
                    className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition-colors overflow-hidden flex flex-col"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <BookOpen size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white">Curriculums</h2>
                                <p className="text-2xl font-bold text-purple-400">{curriculums.length}</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {isLoadingCurriculums ? (
                            <div className="text-gray-500 text-xs">Loading...</div>
                        ) : curriculums.length === 0 ? (
                            <div className="text-gray-500 text-xs">No curriculums</div>
                        ) : (
                            <div className="space-y-1">
                                {curriculums.slice(0, 8).map((c) => (
                                    <div key={c.id} className="text-xs bg-gray-700/50 rounded px-2 py-1 truncate flex items-center justify-between">
                                        <span className="text-white truncate">{c.name}</span>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {c.is_featured && (
                                                <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">F</span>
                                            )}
                                            <span className={`text-[10px] px-1 py-0.5 rounded ${c.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {c.is_active ? 'A' : 'I'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {curriculums.length > 8 && (
                                    <div className="text-xs text-gray-500">+{curriculums.length - 8} more</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Section Modal */}
            {expandedSection && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">
                                {expandedSection === 'trainers' && `Pending Trainer Approvals (${pendingTrainers.length})`}
                                {expandedSection === 'users' && `Recent Users (${recentUsers.length})`}
                                {expandedSection === 'jobs' && `Recent Apprenticeships (${recentJobs.length})`}
                                {expandedSection === 'curriculums' && `Curriculums (${curriculums.length})`}
                            </h3>
                            <button onClick={() => setExpandedSection(null)} className="p-1 hover:bg-gray-700 rounded text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {/* Pending Trainers Table */}
                            {expandedSection === 'trainers' && (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Business</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Registrant</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Industry</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Applied</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {pendingTrainers.map((trainer) => (
                                            <tr key={trainer.id} className="hover:bg-gray-700/50">
                                                <td className="px-4 py-3 text-sm text-white">{trainer.business_name || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-white">{trainer.registrant_full_name || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-300">{trainer.trainer_category || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-300">{trainer.primary_industry || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-400">{formatTimeAgo(trainer.created_at)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateTrainerStatus(trainer.id, 'approved'); }}
                                                            disabled={processingIds.has(trainer.id)}
                                                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 disabled:opacity-50 text-xs"
                                                        >
                                                            {processingIds.has(trainer.id) ? '...' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateTrainerStatus(trainer.id, 'rejected'); }}
                                                            disabled={processingIds.has(trainer.id)}
                                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50 text-xs"
                                                        >
                                                            {processingIds.has(trainer.id) ? '...' : 'Reject'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Recent Users Table */}
                            {expandedSection === 'users' && (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Signup</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {recentUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-700/50">
                                                <td className="px-4 py-3 text-sm text-white">{user.name || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-300">{user.email || '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${user.type === 'learner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                        {user.type === 'learner' ? 'Learner' : 'Trainer'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-400">{formatTimeAgo(user.created_at)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteUser(user.id, user.type); }}
                                                        disabled={deletingIds.has(user.id)}
                                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50 text-xs"
                                                    >
                                                        {deletingIds.has(user.id) ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Recent Apprenticeships Table */}
                            {expandedSection === 'jobs' && (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Company</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Posted</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Verified</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {recentJobs.map((job) => (
                                            <tr key={job.uid} className="hover:bg-gray-700/50">
                                                <td className="px-4 py-3 text-sm text-white">{job.title || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-300">{job.company_name || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-300">
                                                    {[job.city, job.state].filter(Boolean).join(', ') || job.location || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-300">{job.category || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-400">{formatTimeAgo(job.created_at)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${job.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                        {job.isVerified ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openEditModal(job); }}
                                                            className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteJob(job.uid); }}
                                                            disabled={deletingJobIds.has(job.uid)}
                                                            className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Curriculums Table */}
                            {expandedSection === 'curriculums' && (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Industry</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Skill Level</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Duration</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Featured</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {curriculums.map((curriculum) => (
                                            <tr key={curriculum.id} className="hover:bg-gray-700/50">
                                                <td className="px-4 py-3 text-sm text-white">
                                                    <div>
                                                        <div className="font-medium">{curriculum.name}</div>
                                                        {curriculum.short_description && (
                                                            <div className="text-xs text-gray-400 truncate max-w-xs">{curriculum.short_description}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-300">{curriculum.primary_industry || '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                                                        curriculum.skill_level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                                        curriculum.skill_level === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                                                        curriculum.skill_level === 'advanced' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                        {curriculum.skill_level || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-300">
                                                    {curriculum.duration_weeks ? `${curriculum.duration_weeks} weeks` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${curriculum.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {curriculum.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${curriculum.is_featured ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                        {curriculum.is_featured ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-400">{formatTimeAgo(curriculum.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Apprenticeship Modal */}
            {editingJob && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
                    <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">Edit Apprenticeship</h3>
                            <button onClick={closeEditModal} className="p-1 hover:bg-gray-700 rounded text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={editFormData.company_name || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, company_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={editFormData.city || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={editFormData.state || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                                    <input
                                        type="text"
                                        value={editFormData.country || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={editFormData.category || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <input
                                    type="text"
                                    value={editFormData.type || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isVerified"
                                    checked={editFormData.isVerified || false}
                                    onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.checked })}
                                    className="h-4 w-4 text-[#14B8A6] focus:ring-[#14B8A6] border-gray-600 rounded bg-gray-700"
                                />
                                <label htmlFor="isVerified" className="text-sm font-medium text-gray-300">Verified</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
                            <button onClick={closeEditModal} className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                            <button onClick={updateJob} className="px-4 py-2 text-white bg-[#14B8A6] rounded-lg hover:bg-[#0D9488]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
