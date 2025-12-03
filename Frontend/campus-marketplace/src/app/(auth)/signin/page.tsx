"use client";
import React, { useState } from "react";
import { login, register } from '@/src/lib/api/auth';
import { useRouter } from 'next/navigation';

type Mode = "signin" | "signup";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("signin");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [college, setCollege] = useState("");

    const switchMode = (m: Mode) => {
        setError(null);
        setMode(m);
        setEmail(''); setPassword(''); setUsername(''); setConfirmPassword(''); setCollege('');
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === "signup") {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
        }

        setLoading(true);
        try {
            if (mode === "signin") {
                await login({
                    username,
                    password
                });
            } else {
                await register({
                    username,
                    email,
                    password,
                    college
                });
            }

            // Redirect to home or dashboard on success
            router.push('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-7xl flex gap-6 items-stretch">
                {/* Left: informational section */}
                <section
                    aria-hidden
                    className="flex-1 p-7 rounded-xl bg-blue-50 flex flex-col justify-center gap-3"
                >
                    <h1 className="m-0 text-3xl font-bold">Campus Marketplace</h1>
                    <p className="m-0 text-gray-700">
                        {mode === "signin"
                            ? "Welcome back! Sign in to access your listings and messages."
                            : "Create an account to start buying and selling on campus."}
                    </p>
                    <ul className="mt-3 pl-4.5 text-gray-600">
                        <li>Quick listings</li>
                        <li>Private messaging</li>
                        <li>Student-only community</li>
                    </ul>
                </section>

                {/* Right: auth card */}
                <section className="w-96 p-7 rounded-xl shadow-lg bg-white">
                    <div className="flex justify-between items-baseline mb-3">
                        <h2 className="m-0 text-xl font-semibold">{mode === "signin" ? "Sign in" : "Create account"}</h2>
                        <div className="text-xs text-gray-600">
                            <button
                                onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                                className="bg-transparent border-none text-blue-600 cursor-pointer p-1.5 hover:underline"
                                aria-label="Switch sign in sign up"
                            >
                                {mode === "signin" ? "Need an account?" : "Have an account?"}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {mode === "signup" && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs text-gray-900 font-medium">Username</span>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Your username"
                                    required
                                    className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </label>
                        )}

                        {mode === "signin" && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs text-gray-900 font-medium">Username</span>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Your username"
                                    required
                                    className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </label>
                        )}

                        {mode === "signup" && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs text-gray-900 font-medium">Email</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@school.edu"
                                    required
                                    className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </label>
                        )}

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs text-gray-900 font-medium">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </label>

                        {mode === "signup" && (
                            <>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-xs text-gray-900 font-medium">Confirm password</span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat password"
                                        required
                                        className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </label>

                                <label className="flex flex-col gap-1.5">
                                    <span className="text-xs text-gray-900 font-medium">College</span>
                                    <input
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        placeholder="Your college name"
                                        required
                                        className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </label>
                            </>
                        )}

                        {error && <div className="text-red-600 text-xs">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1.5 p-2.5 rounded-lg bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-default transition-colors font-medium"
                        >
                            {loading ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
                        </button>

                        <div className="text-xs text-gray-600 mt-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    alert("Password reset flow (stub)");
                                }}
                                className="bg-transparent border-none text-blue-600 cursor-pointer p-0 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}