import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Create admin user in Firebase
export const createAdminUser = async() => {
    try {
        const adminEmail = 'admin.misslilytwo@gmail.com';
        const adminPassword = 'AdminMissLily2';



        // First try to sign in (user might already exist)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            return { success: true, user: userCredential.user, message: 'User already exists' };
        } catch (signInError) {
            if (signInError.code === 'auth/user-not-found') {
                // User doesn't exist, create it
                const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
                return { success: true, user: userCredential.user, message: 'User created' };
            } else {

                return { success: false, error: signInError };
            }
        }
    } catch (error) {

        return { success: false, error };
    }
};

// Sign in admin user
export const signInAdmin = async(email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error };
    }
};