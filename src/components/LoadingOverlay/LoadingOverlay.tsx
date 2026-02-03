import React from 'react';

interface LoadingOverlayProps {
    message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                {/* Simple Spinner */}
                <div className="w-12 h-12 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin" />
                
                {/* Message */}
                <p className="text-gray-700 font-medium">
                    {message}
                </p>
            </div>
        </div>
    );
} 