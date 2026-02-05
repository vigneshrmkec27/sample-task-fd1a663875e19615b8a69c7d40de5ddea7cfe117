import React, { useEffect, useState } from 'react';
import { Camera, Mail, X } from 'lucide-react';

const ProfilePanel = ({ user, onClose, onSave, isSaving }) => {
    const [email, setEmail] = useState(user?.email || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [preview, setPreview] = useState(user?.profileImage || '');

    useEffect(() => {
        setEmail(user?.email || '');
        setProfileImage(user?.profileImage || '');
        setPreview(user?.profileImage || '');
    }, [user]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result?.toString() || '';
            setProfileImage(result);
            setPreview(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const normalizedEmail = email.trim();
        onSave({
            email: normalizedEmail.length > 0 ? normalizedEmail : null,
            profileImage: profileImage || null
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-white/10 shadow-2xl animate-zoomIn">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/70 dark:border-white/10">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Profile Settings</p>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update your details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10"
                        aria-label="Close profile panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-2xl bg-gray-100 dark:bg-white/10 overflow-hidden border border-gray-200/70 dark:border-white/10">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                                        No photo
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profile-upload"
                                className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-indigo-600 p-2 text-white shadow-lg hover:bg-indigo-500"
                            >
                                <Camera className="w-4 h-4" />
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user?.username}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Upload a new profile photo or update your email.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
                                placeholder="you@email.com"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 disabled:opacity-60"
                        >
                            {isSaving ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePanel;
