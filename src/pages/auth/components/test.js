import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

export default function APITester() {
    const [results, setResults] = useState({});
    const [testing, setTesting] = useState(false);
    const [apiUrl, setApiUrl] = useState('http://localhost/bookon/bookon-be/api');

    const endpoints = [
        // { name: 'Health Check', url: '/health.php', method: 'GET' },
        {
            name: 'Register', url: '/auth/register.php', method: 'POST',
            body: { email: 'test@test.com', username: 'testuser', password: 'Test123456' }
        },
        // {
        //     name: 'Login', url: '/auth/login.php', method: 'POST',
        //     body: { email: 'test@test.com', password: 'Test123456' }
        // }
    ];

    const testEndpoint = async (endpoint) => {
        try {
            const options = {
                method: endpoint.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            };

            if (endpoint.body) {
                options.body = JSON.stringify(endpoint.body);
            }

            const response = await fetch(`${apiUrl}${endpoint.url}`, options);
            const data = await response.json();

            return {
                status: response.ok ? 'success' : 'error',
                statusCode: response.status,
                data: data
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    };

    const testAll = async () => {
        setTesting(true);
        const newResults = {};

        for (const endpoint of endpoints) {
            newResults[endpoint.name] = await testEndpoint(endpoint);
            setResults({ ...newResults });
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setTesting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        API Connection Tester
                    </h1>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Base URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="http://localhost/bookon/bookon-be/api"
                            />
                            <button
                                onClick={testAll}
                                disabled={testing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {testing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    'Test All Endpoints'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {endpoints.map((endpoint) => (
                            <div
                                key={endpoint.name}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-800">
                                            {endpoint.name}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            {endpoint.method}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {endpoint.url}
                                        </span>
                                    </div>

                                    {results[endpoint.name] && (
                                        <div className="flex items-center gap-2">
                                            {results[endpoint.name].status === 'success' ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {results[endpoint.name].statusCode || 'Failed'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {results[endpoint.name] && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                                        <pre className="text-xs overflow-x-auto">
                                            {JSON.stringify(results[endpoint.name], null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Testing Instructions:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Make sure your PHP backend server is running</li>
                                    <li>Update the API Base URL if needed</li>
                                    <li>Check browser console for CORS errors</li>
                                    <li>Verify database connection in PHP</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Environment Check
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">REACT_APP_API_URL:</span>
                            <span className="font-mono text-gray-800">
                                {process.env.REACT_APP_API_URL || 'Not set'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Current Origin:</span>
                            <span className="font-mono text-gray-800">
                                {window.location.origin}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}