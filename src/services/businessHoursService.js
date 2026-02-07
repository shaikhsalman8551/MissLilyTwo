import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';


const BUSINESS_HOURS_COLLECTION = 'businessHours';

// Get all business hours
export const getBusinessHours = async() => {
    try {
        const businessHoursDoc = await getDoc(doc(db, BUSINESS_HOURS_COLLECTION, 'main'));
        if (businessHoursDoc.exists()) {
            return { id: businessHoursDoc.id, ...businessHoursDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting business hours:', error);
        throw error;
    }
};

// Create or update business hours
export const saveBusinessHours = async(businessHoursData) => {
    try {
        const businessHoursRef = doc(db, BUSINESS_HOURS_COLLECTION, 'main');
        await setDoc(businessHoursRef, businessHoursData);
        return { id: 'main', ...businessHoursData };
    } catch (error) {
        console.error('Error saving business hours:', error);
        throw error;
    }
};

// Update business hours
export const updateBusinessHours = async(id, businessHoursData) => {
    try {
        const businessHoursRef = doc(db, BUSINESS_HOURS_COLLECTION, id);
        await updateDoc(businessHoursRef, businessHoursData);
        return { id, ...businessHoursData };
    } catch (error) {
        console.error('Error updating business hours:', error);
        throw error;
    }
};

// Delete business hours
export const deleteBusinessHours = async(id) => {
    try {
        await deleteDoc(doc(db, BUSINESS_HOURS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting business hours:', error);
        throw error;
    }
};

// Default business hours structure
export const defaultBusinessHours = {
    monday: { isOpen: true, openTime: '10:00', closeTime: '20:00', lunchBreak: null },
    tuesday: { isOpen: true, openTime: '10:00', closeTime: '20:00', lunchBreak: null },
    wednesday: { isOpen: true, openTime: '10:00', closeTime: '20:00', lunchBreak: null },
    thursday: { isOpen: true, openTime: '10:00', closeTime: '20:00', lunchBreak: null },
    friday: { isOpen: true, openTime: '10:00', closeTime: '20:00', lunchBreak: null },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '20:00', lunchBreak: null },
    sunday: { isOpen: true, openTime: '11:00', closeTime: '18:00', lunchBreak: null },
    holidays: {
        isOpen: false,
        note: 'Closed on holidays'
    },
    specialInstructions: 'Please call ahead for appointments'
};