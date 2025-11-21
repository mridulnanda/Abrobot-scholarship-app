interface LeadData {
    name: string;
    email: string;
    phone: string;
}

/**
 * Simulates sending lead generation data to an email address.
 * In a real-world application, this function would make an API call 
 * to a backend service or a third-party email service (like EmailJS or Formspree)
 * which would then send the email.
 * 
 * @param data - The user's contact information.
 * @returns A promise that resolves to true on successful "sending".
 */
export const sendLeadData = async (data: LeadData): Promise<boolean> => {
    const recipient = 'contact@mnbresearch.com';
    
    console.log('--- SIMULATING EMAIL ---');
    console.log(`Recipient: ${recipient}`);
    console.log(`Name: ${data.name}`);
    console.log(`Email: ${data.email}`);
    console.log(`Phone: ${data.phone}`);
    console.log('------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real scenario, you'd handle potential errors from the API call.
    // For this simulation, we'll always assume success.
    return true;
};
