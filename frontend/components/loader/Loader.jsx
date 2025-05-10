import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-lg text-gray-700">{message}</p>
        </div>
    );
};

export default Loader;