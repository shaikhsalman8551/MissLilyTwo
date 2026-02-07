# 📊 MissLily Firestore Database Structure

## Collections Overview

### 1. **products** Collection

```javascript
{
  id: "auto-generated",
  name: "Summer Casual Dress",
  description: "Beautiful summer dress made from premium cotton",
  price: 1299,
  discount: 15,
  categoryId: "cat_001",
  category: "Dresses",
  images: [
    "https://firebase-storage-url/image1.jpg",
    "https://firebase-storage-url/image2.jpg"
  ],
  stock: 50,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Fields:**
- `name` (String): Product name
- `description` (String): Product description
- `price` (Number): Original price in rupees
- `discount` (Number): Discount percentage (0-100)
- `categoryId` (String): Reference to category
- `category` (String): Category name for quick access
- `images` (Array): URLs of product images from Firebase Storage
- `stock` (Number): Available quantity
- `isActive` (Boolean): Product visibility
- `createdAt` (Timestamp): Creation date
- `updatedAt` (Timestamp): Last update date

---

### 2. **categories** Collection

```javascript
{
  id: "auto-generated",
  name: "Dresses",
  description: "All types of dresses for every occasion",
  icon: "👗",
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Fields:**
- `name` (String): Category name
- `description` (String): Category description
- `icon` (String): Emoji icon for UI display
- `isActive` (Boolean): Category visibility
- `createdAt` (Timestamp): Creation date
- `updatedAt` (Timestamp): Last update date

---

### 3. **userInquiries** Collection

```javascript
{
  id: "auto-generated",
  productId: "prod_001",
  productName: "Summer Casual Dress",
  fullName: "Neha Sharma",
  email: "neha@email.com",
  phone: "8320953686",
  city: "Mumbai",
  size: "M",
  color: "Blue",
  message: "Do you have this in pink color?",
  status: "pending", // pending, contacted, resolved
  inquiryType: "product_inquiry",
  createdAt: Timestamp
}
```

**Fields:**
- `productId` (String): Reference to product
- `productName` (String): Product name (for quick access)
- `fullName` (String): User's full name
- `email` (String): User's email
- `phone` (String): 10-digit phone number
- `city` (String): User's city
- `size` (String): Preferred size (XS, S, M, L, XL, XXL)
- `color` (String): Preferred color
- `message` (String): User's message/question
- `status` (String): pending, contacted, resolved
- `inquiryType` (String): Type of inquiry
- `createdAt` (Timestamp): Inquiry date

---

### 4. **contactMessages** Collection

```javascript
{
  id: "auto-generated",
  fullName: "Priya Patel",
  email: "priya@email.com",
  phone: "9876543211",
  subject: "Bulk Order Inquiry",
  message: "I want to place a bulk order of 100 pieces",
  status: "unread", // unread, read, replied
  createdAt: Timestamp
}
```

**Fields:**
- `fullName` (String): Sender's full name
- `email` (String): Sender's email
- `phone` (String): 10-digit phone number
- `subject` (String): Message subject
- `message` (String): Message content
- `status` (String): unread, read, replied
- `createdAt` (Timestamp): Message date

---

## Database Indexes

For optimal query performance, create these indexes in Firestore:

1. **Products by Category and Status**
   - Collection: products
   - Fields: categoryId (Ascending), isActive (Ascending)

2. **Products by Creation Date**
   - Collection: products
   - Field: createdAt (Descending)

3. **Contact Messages by Date**
   - Collection: contactMessages
   - Field: createdAt (Descending)

4. **User Inquiries by Date**
   - Collection: userInquiries
   - Field: createdAt (Descending)

---

## Firebase Storage Structure

```
gs://your-project.appspot.com/
├── products/
│   ├── 1708234567890_image1.jpg
│   ├── 1708234567891_image2.jpg
│   ├── 1708234567892_image3.jpg
│   └── ...
```

**Storage Path Format:** `products/{timestamp}_{filename}`

---

## Sample Data for Testing

### Sample Category:
```javascript
{
  name: "Dresses",
  description: "All types of dresses for every occasion",
  icon: "👗",
  isActive: true
}
```

### Sample Product:
```javascript
{
  name: "Summer Casual Dress",
  description: "Beautiful summer dress made from premium cotton",
  price: 1299,
  discount: 15,
  categoryId: "{category_id}",
  category: "Dresses",
  images: [],
  stock: 50,
  isActive: true
}
```

### Sample Inquiry:
```javascript
{
  productId: "{product_id}",
  productName: "Summer Casual Dress",
  fullName: "Neha Sharma",
  email: "neha@email.com",
  phone: "8320953686",
  city: "Mumbai",
  size: "M",
  color: "Blue",
  message: "Do you have this in pink?",
  status: "pending",
  inquiryType: "product_inquiry"
}
```

---

## Query Examples (Used in Code)

### Get All Products:
```javascript
const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
```

### Get Products by Category:
```javascript
const q = query(
  collection(db, 'products'),
  where('categoryId', '==', categoryId),
  where('isActive', '==', true)
);
```

### Get All Categories (Sorted):
```javascript
const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
```

### Get All Contact Messages:
```javascript
const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
```

---

## Data Access Patterns

### From Admin Panel:
1. **Products Management**: Read/Write to products collection
2. **Categories Management**: Read/Write to categories collection
3. **View Inquiries**: Read userInquiries collection
4. **View Contact Messages**: Read contactMessages collection
5. **Analytics**: Aggregate data from all collections

### From User Side:
1. **Home/Products Page**: Read active products and categories
2. **Product Inquiry**: Write to userInquiries collection
3. **Contact Form**: Write to contactMessages collection
4. **Images**: Read from Firebase Storage (public URLs)

---

## Security Considerations

### Test Mode Rules (Development):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules (Secure):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to products and categories
    match /products/{document=**} {
      allow read: if true;
    }
    match /categories/{document=**} {
      allow read: if true;
    }
    
    // Only admins can write
    match /products/{document=**} {
      allow write: if isAdmin();
    }
    match /categories/{document=**} {
      allow write: if isAdmin();
    }
    
    // Users can write inquiries and messages
    match /userInquiries/{document=**} {
      allow create: if true;
      allow read: if isAdmin();
    }
    match /contactMessages/{document=**} {
      allow create: if true;
      allow read: if isAdmin();
    }
  }
  
  function isAdmin() {
    return request.auth.token.email == 'admin@misslily.com';
  }
}
```

---

## Backup Strategy

1. **Firestore Backups**: 
   - Use Firebase Console → Firestore → Manage → Create Export
   - Schedule regular automated exports

2. **Storage Backups**:
   - Export product images periodically
   - Keep backup copies in separate bucket

3. **CSV Export**:
   - Export contact messages and inquiries to CSV monthly
   - Store in Google Drive or local backup

---

## Estimated Costs (Firebase Free Tier Limits)

- **Firestore Reads**: 50,000 reads/day
- **Firestore Writes**: 20,000 writes/day
- **Storage**: 5 GB
- **Bandwidth**: 1 GB/day

For a small e-commerce store, free tier is usually sufficient.

---

## Performance Tips

1. **Index Fields Frequently Queried**: Done ✓
2. **Denormalize Data for Fast Access**: Done ✓ (product name in inquiries)
3. **Limit Results in Real-time Listeners**: Used pagination ✓
4. **Batch Writes**: Use batch operations for multiple updates
5. **Cloud Functions**: Consider for complex operations

---

## Migration Guide (If Needed)

To migrate from another system:

1. Export data as JSON/CSV
2. Transform to match Firestore schema
3. Upload images to Firebase Storage
4. Use Firebase Admin SDK for batch import
5. Verify data integrity

Example:
```javascript
const batch = db.batch();
data.forEach(item => {
  const docRef = db.collection('products').doc();
  batch.set(docRef, item);
});
await batch.commit();
```

---

## Monitoring

Monitor database usage:
1. Firebase Console → Firestore → Storage
2. Set up Firestore alerts for quota
3. Track query performance in Cloud Monitoring
4. Review storage costs monthly

---

This structure provides a solid foundation for the MissLily e-commerce platform. All collections are optimized for the features specified and can scale as the business grows!
