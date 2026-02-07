// Frontend service for fetching contact information
import { getContactSettings } from './settingsService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getWebsiteContacts = async() => {
    try {
        const settings = await getContactSettings();

        return {
            phones: settings.phones.filter(phone => phone.isActive) || [],
            whatsapp: settings.whatsapp.filter(wa => wa.isActive) || [],
            emails: settings.emails.filter(email => email.isActive) || [],
            addresses: settings.addresses.filter(addr => addr.isActive) || []
        };
    } catch (error) {
        console.error('Error fetching website contacts:', error);
        // Return fallback data
        return {
            phones: [{ id: 'fallback-1', number: '+91 8320953686', type: 'primary', isActive: true }],
            whatsapp: [{ id: 'fallback-wa-1', number: '+91 8320953686', isActive: true }],
            emails: [{ id: 'fallback-email-1', email: 'info@misslily.com', type: 'info', isActive: true }],
            addresses: [{
                id: 'fallback-addr-1',
                street: 'Miss lily, suthar faliyu',
                city: 'ankleshwar',
                state: 'Gujarat',
                zipCode: '33001',
                country: 'India',
                type: 'branch',
                isActive: true
            }]
        };
    }
};

// Save contact inquiry to Firebase
export const saveContactInquiry = async(inquiryData) => {
    try {
        const inquiryRef = collection(db, 'contactInquiries');
        const inquiry = {
            ...inquiryData,
            createdAt: serverTimestamp(),
            status: 'new',
            inquiryType: 'product_inquiry'
        };

        const docRef = await addDoc(inquiryRef, inquiry);
        return { id: docRef.id, ...inquiry };
    } catch (error) {
        console.error('Error saving contact inquiry:', error);
        throw error;
    }
};