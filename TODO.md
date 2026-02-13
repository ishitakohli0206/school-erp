# School ERP - Features to Implement

## 1. Student Details Enhancement (Students.jsx)
- [x] Update Students.jsx to display student names instead of just IDs
- [x] Display class name and other relevant information
- [x] The backend API already returns this data, just need to update frontend display

## 2. Photo Gallery Feature
- [ ] Add backend endpoint for gallery images in publicRoutes.js
- [ ] Add gallery controller/model
- [ ] Update PublicWebsite.jsx to display photo gallery
- [ ] Add frontend gallery component

## 3. Student Promotion Feature
- [ ] Add backend endpoint for student promotion in studentRoutes.js
- [ ] Add promotion controller logic
- [ ] Add frontend page/component for student promotion in Admin panel
- [ ] Add route for promotion page
- [ ] Update sidebar to include promotion option

## Implementation Steps:

### Step 1: Update Students.jsx to show student names (COMPLETED)
- Modify the table to display User.name, Class.class_name

### Step 2: Add Photo Gallery
- Create gallery model (if needed) or use simple URL-based gallery
- Add backend route for gallery
- Update PublicWebsite.jsx to show gallery

### Step 3: Add Student Promotion
- Add promoteStudent controller function
- Add backend route
- Create promotion frontend component
- Add to Admin sidebar and routes
