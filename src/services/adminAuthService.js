import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Create admin user in Firebase
export const createAdminUser = async() => {
    try {
        const adminEmail = 'admin.misslilytwo@gmail.com';
        const adminPassword = 'AdminMissLily2';

        console.log('Attempting to create admin user...');

        // First try to sign in (user might already exist)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            console.log('Admin user already exists, signed in successfully:', userCredential.user);
            return { success: true, user: userCredential.user, message: 'User already exists' };
        } catch (signInError) {
            if (signInError.code === 'auth/user-not-found') {
                console.log('Admin user not found, creating new user...');
                // User doesn't exist, create it
                const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
                console.log('Admin user created successfully:', userCredential.user);
                return { success: true, user: userCredential.user, message: 'User created' };
            } else {
                console.error('Error signing in:', signInError);
                return { success: false, error: signInError };
            }
        }
    } catch (error) {
        console.error('Error in admin auth setup:', error);
        return { success: false, error };
    }
};

// Sign in admin user
export const signInAdmin = async(email, password) => {
    try {
        console.log('Attempting admin sign in with:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Admin signed in successfully:', userCredential.user);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Admin sign in error:', error);
        return { success: false, error };
    }
};