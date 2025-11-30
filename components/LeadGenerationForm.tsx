import React, { useState } from 'react';
import { sendVerificationEmail, notifyAdminOfNewLead } from '../services/emailService';
import LoadingSpinner from './LoadingSpinner';
import { UserCircleIcon, ExternalLinkIcon } from './Icons';

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
    const [accessExhausted, setAccessExhausted] = useState(false);

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

    const checkAccessLimit = (emailToCheck: string): boolean => {
        const normalizedEmail = emailToCheck.toLowerCase().trim();
        const usedEmails = JSON.parse(localStorage.getItem('abrobot_used_emails') || '[]');
        return usedEmails.includes(normalizedEmail);
    };

    const recordAccess = (emailToRecord: string) => {
        const normalizedEmail = emailToRecord.toLowerCase().trim();
        const usedEmails = JSON.parse(localStorage.getItem('abrobot_used_emails') || '[]');
        if (!usedEmails.includes(normalizedEmail)) {
            usedEmails.push(normalizedEmail);
            localStorage.setItem('abrobot_used_emails', JSON.stringify(usedEmails));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        // Check if user has already used the service
        if (checkAccessLimit(email)) {
            setAccessExhausted(true);
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
            
            // Record usage to prevent re-entry
            recordAccess(email);
        } catch (error) {
            console.error("Failed to notify admin:", error);
        } finally {
            setIsLoading(false);
            // Step 3: Grant access to the application
            onVerified();
        }
    };

    // --- VIEW: ACCESS EXHAUSTED ---
    if (accessExhausted) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
                <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border-t-4 border-cyan-600 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Free Access Limit Reached</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        The one-time free access for <span className="font-semibold">{email}</span> has already been utilized.
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                        To continue your study abroad journey with personalized AI insights, please visit our main website or contact our expert team.
                    </p>
                    
                    <div className="space-y-3">
                        <a 
                            href="https://www.abrobot.ai/"
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition duration-300 shadow-md"
                        >
                            Visit Abrobot.ai <ExternalLinkIcon />
                        </a>
                        <a 
                            href="https://www.abrobot.ai/contactus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition duration-300"
                        >
                            Contact Support
                        </a>
                    </div>
                    <button 
                        onClick={() => { setAccessExhausted(false); setEmail(''); }}
                        className="mt-6 text-xs text-slate-400 hover:text-cyan-600 underline"
                    >
                        Use a different email address
                    </button>
                </div>
            </div>
        )
    }

    // --- VIEW: EMAIL SENT / VERIFICATION ---
    if (isEmailSent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg text-center border-t-4 border-cyan-500">
                     <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-bold text-slate-800">Check Your Inbox</h2>
                     <p className="text-slate-600">
                        We've sent an activation link to <span className="font-semibold text-slate-800">{email}</span>.
                     </p>
                     <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                        <p><strong>Note:</strong> Please click the "Activate My Form" button inside the email to securely unlock your dashboard.</p>
                     </div>
                     
                     <div className="mt-8 pt-6 border-t border-slate-200">
                        {/* Simulation Button - In a real app, this logic happens when the user clicks the link in their email client. 
                            Here, we simulate that action completing. */}
                        <button
                            onClick={handleActivation}
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:bg-green-400 shadow-sm"
                        >
                            {isLoading ? <LoadingSpinner size={5} color="white" /> : 'I have activated my account'}
                        </button>
                     </div>
                     <button 
                        onClick={() => { setIsEmailSent(false); setIsLoading(false); }}
                        disabled={isLoading}
                        className="text-sm text-cyan-600 hover:text-cyan-700 mt-4 disabled:text-cyan-400"
                     >
                        Re-enter email
                     </button>
                </div>
            </div>
        );
    }

    // --- VIEW: SIGN UP FORM ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
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
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-400 disabled:cursor-not-allowed transition duration-300 shadow-md"
                        >
                            {isLoading ? <LoadingSpinner size={5} color="white" /> : 'Verify & Access Dashboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadGenerationForm;