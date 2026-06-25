import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Lock, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState('');
    const [serverSuccessMessage, setServerSuccessMessage] = useState('');

    const identifierForm = useForm({
        identifier: '',
    });

    const resetForm = useForm({
        identifier: '',
        code: '',
        password: '',
        password_confirmation: '',
    });

    const handleSendCode = (e: React.FormEvent) => {
        e.preventDefault();
        setServerSuccessMessage('');
        identifierForm.post('/forgot-password/send-code', {
            preserveScroll: true,
            onSuccess: (page) => {
                resetForm.setData('identifier', identifierForm.data.identifier);
                setStep(2);
                const flash = (page.props as any).flash;
                if (flash?.success) {
                    setServerSuccessMessage(flash.success as string);
                }
                if (flash?.maskedEmail) {
                    setMaskedEmail(flash.maskedEmail as string);
                }
            },
        });
    };

    const handleVerifyAndReset = (e: React.FormEvent) => {
        e.preventDefault();
        resetForm.post('/forgot-password/verify-reset', {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cighra-light dark:bg-cighra-dark relative overflow-hidden font-sans w-full py-12 px-4 selection:bg-cighra-primary dark:selection:bg-cighra-gold dark:selection:text-slate-900 selection:text-white">
            {/* Background Tactical Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[0.5px] border-cighra-primary dark:border-cighra-gold/30 rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border-[0.5px] border-cighra-primary dark:border-cighra-gold/20 rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-cighra-darkcard/95 backdrop-blur-xl border-x border-b border-cighra-primary dark:border-cighra-gold/20 shadow-2xl rounded-sm overflow-hidden">
                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-olive via-camogreen to-olive" />

                <div className="p-8">
                    <div className="mb-8">
                        <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-cighra-primary dark:text-slate-400 dark:hover:text-cighra-gold mb-6 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Kembali ke Login
                        </Link>
                        <h2 className="text-2xl font-tactical text-slate-800 dark:text-white font-black tracking-tighter flex items-center gap-3">
                            <span className="p-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white rounded-sm">
                                <KeyRound className="w-5 h-5" />
                            </span>
                            LUPA KATA SANDI
                        </h2>
                        <p className="text-slate-500 dark:text-slate-300 text-[11px] font-mono tracking-[0.1em] mt-2">
                            {step === 1 ? 'Masukkan Nama Pengguna atau Email Anda.' : 'Masukkan kode 6 digit dan kata sandi baru Anda.'}
                        </p>
                    </div>

                    {(identifierForm.errors.identifier || resetForm.errors.code || resetForm.errors.password || resetForm.errors.identifier) && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-mono">
                            <p className="font-bold mb-1">TERJADI KESALAHAN:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                {identifierForm.errors.identifier && <li>{identifierForm.errors.identifier}</li>}
                                {resetForm.errors.identifier && <li>{resetForm.errors.identifier}</li>}
                                {resetForm.errors.code && <li>{resetForm.errors.code}</li>}
                                {resetForm.errors.password && <li>{resetForm.errors.password}</li>}
                            </ul>
                        </div>
                    )}

                    {serverSuccessMessage && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 text-xs font-mono">
                            <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {serverSuccessMessage}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Nama Pengguna atau Email
                                </label>
                                <div className="group relative">
                                    <input
                                        type="text"
                                        value={identifierForm.data.identifier}
                                        onChange={(e) => identifierForm.setData('identifier', e.target.value)}
                                        className="w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border border-cighra-primary/40 dark:border-cighra-gold/60 focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 focus:outline-none transition-all font-mono text-sm rounded-sm"
                                        placeholder="username atau email..."
                                        required
                                        disabled={identifierForm.processing}
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cighra-primary dark:bg-cighra-gold group-focus-within:w-full transition-all duration-300" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={identifierForm.processing}
                                className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white font-tactical font-black py-4 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {identifierForm.processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        MENGIRIM...
                                    </>
                                ) : 'KIRIM KODE OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyAndReset} className="space-y-6">
                            <div className="p-3 bg-cighra-primary/5 dark:bg-cighra-gold/5 border border-cighra-primary/20 dark:border-cighra-gold/20 rounded-sm text-center">
                                <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400">Kode telah dikirim ke email terhubung:</p>
                                <p className="text-sm font-bold text-cighra-primary dark:text-cighra-gold">{maskedEmail}</p>
                                <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">Masa aktif kode: 5 Menit</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                                    <KeyRound className="w-3 h-3" /> Kode OTP (6 Digit)
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={resetForm.data.code}
                                    onChange={(e) => resetForm.setData('code', e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center tracking-[1em] font-bold text-xl bg-soft-sand/30 dark:bg-cighra-dark/50 border border-cighra-primary/40 dark:border-cighra-gold/60 focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 focus:outline-none transition-all rounded-sm"
                                    placeholder="••••••"
                                    required
                                    disabled={resetForm.processing}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={resetForm.data.password}
                                        onChange={(e) => resetForm.setData('password', e.target.value)}
                                        className="w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border border-cighra-primary/40 dark:border-cighra-gold/60 focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 pr-10 focus:outline-none transition-all font-mono text-sm rounded-sm"
                                        placeholder="Min. 8 karakter (Huruf & Angka)"
                                        required
                                        disabled={resetForm.processing}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cighra-gold">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300/80 uppercase flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Konfirmasi Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswordConfirm ? "text" : "password"}
                                        value={resetForm.data.password_confirmation}
                                        onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                        className="w-full bg-soft-sand/30 dark:bg-cighra-dark/50 border border-cighra-primary/40 dark:border-cighra-gold/60 focus:border-camogreen text-slate-800 dark:text-white px-4 py-3 pr-10 focus:outline-none transition-all font-mono text-sm rounded-sm"
                                        placeholder="Ketik ulang kata sandi..."
                                        required
                                        disabled={resetForm.processing}
                                    />
                                    <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cighra-gold">
                                        {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={resetForm.processing}
                                className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white font-tactical font-black py-4 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {resetForm.processing ? 'MEMPROSES...' : 'RESET KATA SANDI'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

