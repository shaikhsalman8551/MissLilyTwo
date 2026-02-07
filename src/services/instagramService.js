import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const INSTAGRAM_COLLECTION = 'instagramConfig';

// Get Instagram configuration
export const getInstagramConfig = async() => {
    try {
        console.log('Fetching Instagram config from Firebase...');
        const configDoc = await getDoc(doc(db, INSTAGRAM_COLLECTION, 'main'));
        if (configDoc.exists()) {
            console.log('Instagram config found:', configDoc.data());
            return { id: configDoc.id, ...configDoc.data() };
        }
        console.log('No Instagram config found, returning null');
        return null;
    } catch (error) {
        console.error('Error getting Instagram config:', error);
        throw error;
    }
};

// Initialize default Instagram configuration if none exists
export const initializeInstagramConfig = async() => {
    try {
        console.log('Initializing default Instagram config...');
        const existingConfig = await getInstagramConfig();
        if (!existingConfig) {
            console.log('Creating default Instagram config...');
            await saveInstagramConfig(defaultInstagramConfig);
            console.log('Default Instagram config created successfully');
            return defaultInstagramConfig;
        }
        console.log('Instagram config already exists');
        return existingConfig;
    } catch (error) {
        console.error('Error initializing Instagram config:', error);
        throw error;
    }
};

// Save Instagram configuration
export const saveInstagramConfig = async(configData) => {
    try {
        console.log('Saving Instagram config to Firebase:', configData);
        const configRef = doc(db, INSTAGRAM_COLLECTION, 'main');
        await setDoc(configRef, configData);
        console.log('Instagram config saved successfully');
        return { id: 'main', ...configData };
    } catch (error) {
        console.error('Error saving Instagram config:', error);
        throw error;
    }
};

// Update Instagram configuration
export const updateInstagramConfig = async(id, configData) => {
    try {
        const configRef = doc(db, INSTAGRAM_COLLECTION, id);
        await updateDoc(configRef, configData);
        return { id, ...configData };
    } catch (error) {
        console.error('Error updating Instagram config:', error);
        throw error;
    }
};

// Default Instagram configuration
export const defaultInstagramConfig = {
    username: 'misslily_0.2_',
    profileUrl: 'https://www.instagram.com/misslily_0.2_?utm_source=qr&igsh=MXZ4bTk3M3VzbGZlNw==',
    reelIds: []
};