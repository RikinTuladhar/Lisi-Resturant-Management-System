import React from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn } from 'lucide-react';
import Cookie from "js-cookie";
import { LoginAPI } from "../../apis/auth/UserApi"
import { z } from "zod"
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Login = () => {
    const userLogin = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Invalid password length")
    });

    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(userLogin),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await LoginAPI(data);
            Cookie.set('token', JSON.stringify(res.data.access_token));
            toast.success(`Login Successful!\nEmail: ${data.email}`);
            navigate("/admin")
        } catch (error) {
            console.log("error in login", error?.response?.data?.message?.error);
            toast.error(error?.response?.data?.message?.error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center items-center p-4 font-sans">
            <Toaster />
            <div className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Welcome Back!</h1>
                    <p className="text-slate-600 mt-2">Please sign in to continue.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="you@example.com"
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm`}
                            />
                        </div>
                        {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                placeholder="••••••••"
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm`}
                            />
                        </div>
                        {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-slate-700">Remember me</label>
                        </div>
                        <a href="#" className="font-medium text-sky-600 hover:text-sky-500">Forgot your password?</a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5 mr-2 opacity-70" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <p className="mt-8 text-center text-sm text-slate-600">
                    Not a member?{' '}
                    <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                        Sign up now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
