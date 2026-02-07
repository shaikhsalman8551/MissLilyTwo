// Settings service for managing website contact information
import { db } from '../firebaseConfig';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';

// ============ CONTACT SETTINGS ============
export const getContactSettings = async () => {
    try {
        const q = query(collection(db, SETTINGS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // Return default settings if none exist
            return {
                phones: [
                    { id: 'default-1', number: '+91 8320953686', type: 'primary', isActive: true },
                    { id: 'default-2', number: '+91 9265210069', type: 'secondary', isActive: true }
                ],
                whatsapp: [
                    { id: 'default-wa-1', number: '+91 8320953686', isActive: true },
                    { id: 'default-wa-2', number: '+91 9265210069', isActive: true }
                ],
                emails: [
                    { id: 'default-email-1', email: 'info@misslily.com', type: 'info', isActive: true },
                    { id: 'default-email-2', email: 'support@misslily.com', type: 'support', isActive: true }
                ],
                addresses: [
                    {
                        id: 'default-addr-1',
                        street: '123 Fashion Street',
                        city: 'Style City',
                        state: 'SC',
                        zipCode: '12345',
                        country: 'India',
                        type: 'main',
                        isActive: true
                    }
                ]
            };
        }
        
        // Get the most recent settings document
        const latestDoc = querySnapshot.docs[0];
        return latestDoc.data();
    } catch (error) {
        console.error('Error fetching contact settings:', error);
        throw error;
    }
};

export const updateContactSettings = async (settings) => {
    try {
        // Create or update settings document
        const settingsDoc = {
            ...settings,
            updatedAt: new Date(),
            createdAt: new Date() // Always set to current time for latest version
        };

        const docRef = await addDoc(collection(db, SETTINGS_COLLECTION), settingsDoc);
        console.log('Contact settings updated with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error updating contact settings:', error);
        throw error;
    }
};

// ============ INDIVIDUAL CONTACT MANAGEMENT ============
export const addPhone = async (phoneData) => {
    try {
        const settings = await getContactSettings();
        const newPhone = {
            id: `phone-${Date.now()}`,
            ...phoneData,
            isActive: true,
            createdAt: new Date()
        };
        
        settings.phones.push(newPhone);
        await updateContactSettings(settings);
        return newPhone.id;
    } catch (error) {
        console.error('Error adding phone:', error);
        throw error;
    }
};

export const updatePhone = async (phoneId, phoneData) => {
    try {
        const settings = await getContactSettings();
        const phoneIndex = settings.phones.findIndex(p => p.id === phoneId);
        
        if (phoneIndex !== -1) {
            settings.phones[phoneIndex] = { ...settings.phones[phoneIndex], ...phoneData };
            await updateContactSettings(settings);
        }
    } catch (error) {
        console.error('Error updating phone:', error);
        throw error;
    }
};

export const deletePhone = async (phoneId) => {
    try {
        const settings = await getContactSettings();
        settings.phones = settings.phones.filter(p => p.id !== phoneId);
        await updateContactSettings(settings);
    } catch (error) {
        console.error('Error deleting phone:', error);
        throw error;
    }
};

export const addWhatsApp = async (whatsappData) => {
    try {
        const settings = await getContactSettings();
        const newWhatsApp = {
            id: `whatsapp-${Date.now()}`,
            ...whatsappData,
            isActive: true,
            createdAt: new Date()
        };
        
        settings.whatsapp.push(newWhatsApp);
        await updateContactSettings(settings);
        return newWhatsApp.id;
    } catch (error) {
        console.error('Error adding WhatsApp:', error);
        throw error;
    }
};

export const updateWhatsApp = async (whatsappId, whatsappData) => {
    try {
        const settings = await getContactSettings();
        const whatsappIndex = settings.whatsapp.findIndex(w => w.id === whatsappId);
        
        if (whatsappIndex !== -1) {
            settings.whatsapp[whatsappIndex] = { ...settings.whatsapp[whatsappIndex], ...whatsappData };
            await updateContactSettings(settings);
        }
    } catch (error) {
        console.error('Error updating WhatsApp:', error);
        throw error;
    }
};

export const deleteWhatsApp = async (whatsappId) => {
    try {
        const settings = await getContactSettings();
        settings.whatsapp = settings.whatsapp.filter(w => w.id !== whatsappId);
        await updateContactSettings(settings);
    } catch (error) {
        console.error('Error deleting WhatsApp:', error);
        throw error;
    }
};

export const addEmail = async (emailData) => {
    try {
        const settings = await getContactSettings();
        const newEmail = {
            id: `email-${Date.now()}`,
            ...emailData,
            isActive: true,
            createdAt: new Date()
        };
        
        settings.emails.push(newEmail);
        await updateContactSettings(settings);
        return newEmail.id;
    } catch (error) {
        console.error('Error adding email:', error);
        throw error;
    }
};

export const updateEmail = async (emailId, emailData) => {
    try {
        const settings = await getContactSettings();
        const emailIndex = settings.emails.findIndex(e => e.id === emailId);
        
        if (emailIndex !== -1) {
            settings.emails[emailIndex] = { ...settings.emails[emailIndex], ...emailData };
            await updateContactSettings(settings);
        }
    } catch (error) {
        console.error('Error updating email:', error);
        throw error;
    }
};

export const deleteEmail = async (emailId) => {
    try {
        const settings = await getContactSettings();
        settings.emails = settings.emails.filter(e => e.id !== emailId);
        await updateContactSettings(settings);
    } catch (error) {
        console.error('Error deleting email:', error);
        throw error;
    }
};

export const addAddress = async (addressData) => {
    try {
        const settings = await getContactSettings();
        const newAddress = {
            id: `address-${Date.now()}`,
            ...addressData,
            isActive: true,
            createdAt: new Date()
        };
        
        settings.addresses.push(newAddress);
        await updateContactSettings(settings);
        return newAddress.id;
    } catch (error) {
        console.error('Error adding address:', error);
        throw error;
    }
};

export const updateAddress = async (addressId, addressData) => {
    try {
        const settings = await getContactSettings();
        const addressIndex = settings.addresses.findIndex(a => a.id === addressId);
        
        if (addressIndex !== -1) {
            settings.addresses[addressIndex] = { ...settings.addresses[addressIndex], ...addressData };
            await updateContactSettings(settings);
        }
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

export const deleteAddress = async (addressId) => {
    try {
        const settings = await getContactSettings();
        settings.addresses = settings.addresses.filter(a => a.id !== addressId);
        await updateContactSettings(settings);
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
};
