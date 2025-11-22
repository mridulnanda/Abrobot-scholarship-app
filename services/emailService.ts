interface LeadData {
    name: string;
    email: string;
    phone: string;
}

/**
 * Simulates sending a verification email to the user.
 * 
 * @param data - The user's contact information.
 * @returns A promise that resolves to true on successful "sending".
 */
export const sendVerificationEmail = async (data: LeadData): Promise<boolean> => {
    const recipient = data.email;
    
    const subject = "Activate your AbroBot access — Begin your AI-powered study abroad journey";
    
    const body = `
Hi ${data.name}, 👋

Welcome to AbroBot — India’s first AI-powered Study Abroad Advisor built to simplify your entire admission journey.
Before we begin analyzing your SOP or matching you with top universities, please activate your form by clicking the button below.

Your activation ensures your profile is securely linked to your personalized dashboard — powered by insights from 25 lakh+ student reviews and 4000+ expert consultants.

👉 [Activate My Form](https://abrobot.com/activate?token=simulated_token)

Once you activate, you’ll instantly unlock:
✅ AI-based SOP feedback & improvement suggestions
✅ Smart university and scholarship matching
✅ Free access to our daily visa & admission update feed

If you face any issues or didn’t request this, simply ignore this email — your data remains safe and unprocessed until activation.

Need Help?

📞 +91 9711488481
📧 contact@mnbresearch.com
`;

    console.log('--- SIMULATING EMAIL SENDING (USER VERIFICATION) ---');
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log('----------------------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return true;
};

/**
 * Simulates forwarding the verified lead details to the admin email.
 * This is called ONLY after the user has successfully verified/activated their account.
 * 
 * @param data - The user's contact information.
 * @returns A promise that resolves to true on successful "sending".
 */
export const notifyAdminOfNewLead = async (data: LeadData): Promise<boolean> => {
    const recipient = "mnbgotyou@gmail.com";
    const subject = `New Verified User Lead: ${data.name}`;
    
    const body = `
Hello Admin,

A new user has successfully verified their email address and activated their AbroBot access.

--------------------------------------------------
USER LEAD DETAILS
--------------------------------------------------
Name:  ${data.name}
Email: ${data.email}
Phone: ${data.phone}
--------------------------------------------------

The user has now been granted access to the dashboard.

Regards,
AbroBot System
`;

    console.log('--- SIMULATING EMAIL SENDING (ADMIN NOTIFICATION) ---');
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log('-----------------------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
};