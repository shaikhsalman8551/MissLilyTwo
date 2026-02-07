// Convert image file to base64
const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Firebase Services for Firestore operations
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
    where,
    orderBy
} from 'firebase/firestore';
import { compressImage, validateImageFile } from '../utils/imageUtils';

// ============ PRODUCTS ============
export const addProduct = async(productData, imageFiles) => {
    try {
        console.log('Adding product:', productData);
        console.log('Image files:', imageFiles);

        const imageUrls = [];

        // Handle image uploads using compression and base64 encoding
        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                console.log(`Processing image:`, file.name);

                // Validate file
                const validation = validateImageFile(file, 5);
                if (!validation.valid) {
                    console.warn(`Invalid image ${file.name}:`, validation.error);
                    imageUrls.push(`https://via.placeholder.com/300x300?text=Invalid+Image`);
                    continue;
                }

                try {
                    // Compress and convert to base64
                    const compressedBase64 = await compressImage(file, 800, 0.7);
                    imageUrls.push(compressedBase64);
                } catch (error) {
                    console.error(`Error processing image ${file.name}:`, error);
                    imageUrls.push(`https://via.placeholder.com/300x300?text=Error+${i + 1}`);
                }
            }
        }

        const productDoc = {
            ...productData,
            images: imageUrls,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, 'products'), productDoc);
        console.log('Product saved with ID:', docRef.id);

        return docRef.id;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const getAllProducts = async() => {
    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductById = async(id) => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const updateProduct = async(id, productData, newImageFiles = [], existingImages = []) => {
    try {
        console.log('Updating product with ID:', id);
        console.log('Product data:', productData);
        console.log('New image files:', newImageFiles);
        console.log('Existing images:', existingImages);

        let imageUrls = [...existingImages];

        // Add new images if any using compression and base64 encoding
        if (newImageFiles && newImageFiles.length > 0) {
            for (let i = 0; i < newImageFiles.length; i++) {
                const file = newImageFiles[i];
                console.log(`Processing new image:`, file.name);

                // Validate file
                const validation = validateImageFile(file, 5);
                if (!validation.valid) {
                    console.warn(`Invalid image ${file.name}:`, validation.error);
                    imageUrls.push(`https://via.placeholder.com/300x300?text=Invalid+Image`);
                    continue;
                }

                try {
                    // Compress and convert to base64
                    const compressedBase64 = await compressImage(file, 800, 0.7);
                    imageUrls.push(compressedBase64);
                } catch (error) {
                    console.error(`Error processing image ${file.name}:`, error);
                    imageUrls.push(`https://via.placeholder.com/300x300?text=Error+${imageUrls.length + 1}`);
                }
            }
        }

        const productDoc = {
            ...productData,
            images: imageUrls,
            updatedAt: new Date()
        };

        console.log('Updating product document:', productDoc);

        await updateDoc(doc(db, 'products', id), productDoc);
        console.log('Product updated successfully');

    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async(id) => {
    try {
        // Storage disabled - just delete the document
        await deleteDoc(doc(db, 'products', id));
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const getProductsByCategory = async(categoryId) => {
    try {
        const q = query(
            collection(db, 'products'),
            where('categoryId', '==', categoryId),
            where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

// ============ CATEGORIES ============
export const addCategory = async(categoryData, iconFile = null) => {
    try {
        console.log('Adding category:', categoryData);
        console.log('Icon file:', iconFile);

        let iconUrl = '';

        if (iconFile) {
            console.log('Processing category icon:', iconFile.name);

            // Validate file
            const validation = validateImageFile(iconFile, 2);
            if (!validation.valid) {
                console.warn(`Invalid icon ${iconFile.name}:`, validation.error);
                iconUrl = `https://via.placeholder.com/150x150?text=${encodeURIComponent(categoryData.name)}`;
            } else {
                try {
                    // Compress and convert to base64 (smaller size for icons)
                    iconUrl = await compressImage(iconFile, 150, 0.8);
                } catch (error) {
                    console.error(`Error processing icon ${iconFile.name}:`, error);
                    iconUrl = `https://via.placeholder.com/150x150?text=${encodeURIComponent(categoryData.name)}`;
                }
            }
        }

        const docRef = await addDoc(collection(db, 'categories'), {
            ...categoryData,
            icon: iconUrl || categoryData.icon || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return docRef.id;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

export const getAllCategories = async() => {
    try {
        const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const updateCategory = async(id, categoryData, iconFile = null) => {
    try {
        let iconUrl = categoryData.icon || '';

        if (iconFile) {
            console.log('Processing category icon for update:', iconFile.name);

            // Validate file
            const validation = validateImageFile(iconFile, 2);
            if (!validation.valid) {
                console.warn(`Invalid icon ${iconFile.name}:`, validation.error);
                iconUrl = `https://via.placeholder.com/150x150?text=${encodeURIComponent(categoryData.name)}`;
            } else {
                try {
                    // Compress and convert to base64 (smaller size for icons)
                    iconUrl = await compressImage(iconFile, 150, 0.8);
                } catch (error) {
                    console.error(`Error processing icon ${iconFile.name}:`, error);
                    iconUrl = `https://via.placeholder.com/150x150?text=${encodeURIComponent(categoryData.name)}`;
                }
            }
        }

        await updateDoc(doc(db, 'categories', id), {
            ...categoryData,
            icon: iconUrl,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async(id) => {
    try {
        await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// ============ CONTACT US ============
export const addContactMessage = async(contactData) => {
    try {
        const docRef = await addDoc(collection(db, 'contactMessages'), {
            ...contactData,
            createdAt: new Date(),
            status: 'unread'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding contact message:', error);
        throw error;
    }
};

export const getAllContactMessages = async() => {
    try {
        const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
    }
};

export const updateContactMessageStatus = async(id, status) => {
    try {
        await updateDoc(doc(db, 'contactMessages', id), { status });
    } catch (error) {
        console.error('Error updating contact message:', error);
        throw error;
    }
};

// ============ USER INQUIRIES ============
export const addUserInquiry = async(inquiryData) => {
    try {
        const docRef = await addDoc(collection(db, 'userInquiries'), {
            ...inquiryData,
            createdAt: new Date(),
            status: 'pending'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding user inquiry:', error);
        throw error;
    }
};

export const getAllUserInquiries = async() => {
    try {
        const q = query(collection(db, 'userInquiries'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user inquiries:', error);
        throw error;
    }
};