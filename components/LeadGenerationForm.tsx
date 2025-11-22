import React, { useState } from 'react';
import { sendVerificationEmail, notifyAdminOfNewLead } from '../services/emailService';
import LoadingSpinner from './LoadingSpinner';

interface LeadGenerationFormProps {
    onVerified: () => void;
}

const InputField: React.FC<{
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder: string;
}> = ({ label, type, value, onChange, error, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const LeadGenerationForm: React.FC<LeadGenerationFormProps> = ({ onVerified }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const validate = (): boolean => {
        const newErrors: { name?: string; email?: string; phone?: string } = {};
        
        if (!name.trim()) {
            newErrors.name = 'Name is required.';
        }
        
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid.';
        }
        
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\+?[0-9\s-()]{7,}$/.test(phone)) {
            newErrors.phone = 'Phone number is invalid.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            // Step 1: Send the verification email to the user
            await sendVerificationEmail({ name, email, phone });
            setIsLoading(false);
            setIsEmailSent(true);
        } catch (error) {
            setErrors({ phone: 'Something went wrong sending the email. Please try again.'});
            setIsLoading(false);
        }
    };

    const handleActivation = async () => {
        setIsLoading(true);
        try {
            // Step 2: Once user "Activates", send the lead details to the Admin (mnbgotyou@gmail.com)
            console.log("User activating account. Notifying admin...");
            await notifyAdminOfNewLead({ name, email, phone });
        } catch (error) {
            console.error("Failed to notify admin:", error);
            // We still allow the user to proceed so their experience isn't broken by a backend logging issue
        } finally {
            setIsLoading(false);
            // Step 3: Grant access to the application
            onVerified();
        }
    };

    if (isEmailSent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg text-center">
                     <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-bold text-slate-800">Activate your AbroBot access</h2>
                     <p className="text-slate-600">
                        We've sent an activation email to <span className="font-semibold text-slate-800">{email}</span>.
                     </p>
                     <p className="text-sm text-slate-500">
                        Please check your inbox and click the "Activate My Form" button inside the email to unlock your access.
                     </p>
                     
                     <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-400 mb-4">
                            (For Demo Purpose: Click below to simulate clicking the email link)
                        </p>
                        <button
                            onClick={handleActivation}
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-300 disabled:bg-cyan-400"
                        >
                            {isLoading ? <LoadingSpinner size={5} color="white" /> : 'I have activated my account'}
                        </button>
                     </div>
                     <button 
                        onClick={() => { setIsEmailSent(false); setIsLoading(false); }}
                        disabled={isLoading}
                        className="text-sm text-cyan-600 hover:text-cyan-700 mt-4 disabled:text-cyan-400"
                     >
                        Wrong email? Try again
                     </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-cyan-600 tracking-wider">ABROBOT</h1>
                    <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-800">
                        Unlock Your Future
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Enter your details to access our exclusive scholarship finder and news hub.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
                        <InputField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="e.g., Jane Doe" />
                        <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="e.g., jane.doe@example.com" />
                        <InputField label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="e.g., (123) 456-7890" />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-400 disabled:cursor-not-allowed transition duration-300"
                        >
                            {isLoading ? <LoadingSpinner size={5} color="white" /> : 'Access Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadGenerationForm;