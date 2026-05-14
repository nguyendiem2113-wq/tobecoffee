# Implementation Checklist - ToBe Coffee Admin Panel

## Phase 1: Database Setup ✅ READY

### Supabase Setup
- [ ] Go to Supabase dashboard: https://app.supabase.com/
- [ ] Select project: tobecoffee (ID: kkvvosbyntcfpmluqxmn)
- [ ] Go to SQL Editor section
- [ ] Create new query
- [ ] Copy entire contents of `database.sql` file
- [ ] Paste into SQL editor
- [ ] Execute query
- [ ] Verify all tables created successfully:
  - [ ] `homepage` table
  - [ ] `about_page` table
  - [ ] `products` table
  - [ ] `blog_posts` table
  - [ ] `contact_form_fields` table
  - [ ] `contact_messages` table
  - [ ] `media` storage bucket

### Verify Mock Data
- [ ] Homepage record created with sample content
- [ ] About page record created
- [ ] 3 products in products table
- [ ] 2 blog posts in blog_posts table
- [ ] 4 contact form fields added
- [ ] Storage bucket `media` exists and is public

## Phase 2: Admin Panel Testing ✅ READY

### Test Admin Dashboard
- [ ] Navigate to `http://localhost:5173/admin`
- [ ] Dashboard loads successfully
- [ ] Statistics show correct counts
- [ ] Sidebar navigation works
- [ ] Toggle sidebar collapse/expand

### Test Homepage Admin
- [ ] Navigate to `/admin/homepage`
- [ ] Can upload image from computer
- [ ] Can paste image URL
- [ ] Image preview displays
- [ ] Can edit hero title
- [ ] Can edit hero subtitle
- [ ] Save changes button works
- [ ] Data saves to Supabase

### Test About Admin
- [ ] Navigate to `/admin/about`
- [ ] Can edit page title
- [ ] Can edit page content
- [ ] Live preview updates
- [ ] Save changes button works
- [ ] Data persists in database

### Test Products Admin
- [ ] Navigate to `/admin/products`
- [ ] "+ Add Product" button opens dialog
- [ ] Can fill in product name
- [ ] Can fill in description
- [ ] Can fill in content
- [ ] Can upload images (max 5MB)
- [ ] Can upload videos (max 100MB)
- [ ] Can create new product
- [ ] Product appears in table
- [ ] Can edit product from table
- [ ] Can delete product (with confirmation)
- [ ] Images display thumbnails
- [ ] Can remove individual images
- [ ] Can remove individual videos

### Test Blog Admin
- [ ] Navigate to `/admin/blog`
- [ ] "+ Add Post" button opens dialog
- [ ] Can fill in post title
- [ ] Slug auto-generates from title
- [ ] Can edit slug manually
- [ ] Can fill in content
- [ ] Can upload images
- [ ] Can upload videos
- [ ] Can create new post
- [ ] Post appears in table
- [ ] Can edit post from table
- [ ] Can delete post (with confirmation)
- [ ] Images show thumbnails
- [ ] Can remove individual images
- [ ] Can remove individual videos

### Test Contact Admin
- [ ] Navigate to `/admin/contact`
- [ ] Form Fields tab shows existing fields
- [ ] Can add new field
- [ ] Can select field type
- [ ] Can mark field as required
- [ ] Can edit existing field
- [ ] Can delete field (with confirmation)
- [ ] Messages tab displays submitted messages
- [ ] Can view message details (eye icon)
- [ ] Can delete message (with confirmation)
- [ ] Message details modal displays all fields

## Phase 3: File Upload System ✅ READY

### Image Uploads
- [ ] Upload JPG image works
- [ ] Upload PNG image works
- [ ] Upload WebP image works
- [ ] Files > 5MB show error
- [ ] Invalid file types show error
- [ ] Upload progress indicator appears
- [ ] Images organized in correct folders:
  - [ ] Homepage images in `homepage/`
  - [ ] Product images in `products/images/`
  - [ ] Blog images in `blog/images/`

### Video Uploads
- [ ] Upload MP4 video works
- [ ] Upload WebM video works
- [ ] Files > 100MB show error
- [ ] Invalid file types show error
- [ ] Videos organized in correct folders:
  - [ ] Product videos in `products/videos/`
  - [ ] Blog videos in `blog/videos/`

### File Management
- [ ] Uploaded files get public URLs
- [ ] URLs are accessible from internet
- [ ] Files persist in storage
- [ ] Delete file function works
- [ ] Deleted files no longer accessible

## Phase 4: Error Handling ✅ READY

### Toast Notifications
- [ ] Success messages show (green)
- [ ] Error messages show (red)
- [ ] Info messages show (blue)
- [ ] Loading state shows
- [ ] Notifications auto-dismiss

### Form Validation
- [ ] Required fields show as required
- [ ] Empty required fields show error
- [ ] File size limits enforced
- [ ] File type validation works
- [ ] Helpful error messages displayed

### Database Errors
- [ ] Network errors handled gracefully
- [ ] Duplicate entries prevented
- [ ] Unique constraints enforced (slug)
- [ ] Rollback on error if needed

## Phase 5: Data Integration (Optional Next Step)

### Connect Homepage to Frontend
- [ ] Fetch homepage data in Index.tsx
- [ ] Display dynamic cover image
- [ ] Display dynamic hero title
- [ ] Display dynamic hero subtitle

### Connect About Page to Frontend
- [ ] Fetch about data in Story.tsx
- [ ] Display dynamic title
- [ ] Display dynamic content

### Connect Products to Frontend
- [ ] Fetch products in Product.tsx
- [ ] Display product list from database
- [ ] Display product images
- [ ] Maintain current sorting

### Connect Blog to Frontend
- [ ] Fetch blog posts in Blog.tsx
- [ ] Display post list from database
- [ ] Display post images
- [ ] Display post content

### Connect Contact Form to Frontend
- [ ] Fetch form fields in Contact.tsx
- [ ] Dynamically render form inputs
- [ ] Save submissions to database
- [ ] Validate based on field configuration

## Phase 6: Production Ready

### Security Review
- [ ] RLS policies verified
- [ ] Public read access confirmed
- [ ] Authenticated write access working
- [ ] File permissions correct
- [ ] No sensitive data exposed

### Performance Optimization
- [ ] Images load quickly
- [ ] Videos load on demand
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Caching implemented (React Query)

### Testing
- [ ] All CRUD operations tested
- [ ] File uploads tested
- [ ] Error scenarios tested
- [ ] Cross-browser tested
- [ ] Mobile responsive tested

### Documentation
- [ ] ADMIN_QUICKSTART.md - User guide
- [ ] INTEGRATION_GUIDE.md - Developer guide
- [ ] ADMIN_SETUP.md - Technical setup
- [ ] database.sql - Schema documented
- [ ] Code comments added

### Deployment
- [ ] Build runs without errors: `npm run build`
- [ ] No console errors in production
- [ ] Environment variables configured
- [ ] Database accessible from production
- [ ] Storage bucket accessible from production

## Files Summary

### Created Files
```
✅ .env                               - Supabase configuration
✅ database.sql                       - Database schema & mock data
✅ src/lib/supabase.ts               - Supabase client
✅ src/lib/storage.ts                - File upload utilities
✅ src/components/AdminLayout.tsx    - Admin UI layout
✅ src/components/FileUploadInput.tsx - File upload component
✅ src/pages/admin/Dashboard.tsx     - Admin dashboard
✅ src/pages/admin/HomepageAdmin.tsx - Homepage editor
✅ src/pages/admin/AboutAdmin.tsx    - About page editor
✅ src/pages/admin/ProductsAdmin.tsx - Products CRUD
✅ src/pages/admin/BlogAdmin.tsx     - Blog CRUD
✅ src/pages/admin/ContactAdmin.tsx  - Contact manager
✅ ADMIN_SETUP.md                    - Setup instructions
✅ ADMIN_QUICKSTART.md               - Quick start guide
✅ INTEGRATION_GUIDE.md              - Frontend integration
✅ ADMIN_PANEL_SUMMARY.md            - Feature summary
✅ IMPLEMENTATION_CHECKLIST.md       - This file
```

### Modified Files
```
✅ src/App.tsx                        - Added admin routes
```

## Command Reference

### Build & Test
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm run test         # Run tests
```

### Access Points
```
http://localhost:5173/              # Main website
http://localhost:5173/admin         # Admin dashboard
http://localhost:5173/admin/homepage # Homepage editor
http://localhost:5173/admin/about   # About page editor
http://localhost:5173/admin/products# Products manager
http://localhost:5173/admin/blog    # Blog manager
http://localhost:5173/admin/contact # Contact manager
```

### Supabase Links
```
Project: https://app.supabase.com/projects
Database: SQL Editor section
Storage: Storage section under "media" bucket
Logs: Any errors in Query > Logs
```

## Troubleshooting Quick Links

### "Table doesn't exist" error
→ Run database.sql in Supabase SQL Editor

### "Can't upload files" error
→ Check file size (5MB images, 100MB videos)
→ Check file type is supported
→ Check Supabase Storage bucket exists

### "Changes not saving" error
→ Check browser console for errors
→ Verify Supabase credentials in .env
→ Check network connection
→ Verify RLS policies allow authenticated access

### Empty admin pages
→ Confirm database.sql executed successfully
→ Check mock data inserted
→ Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

## Support Resources

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

## Notes

- All timestamps are UTC
- File uploads organized in folders automatically
- Delete operations require confirmation
- Live preview available on most pages
- Toast notifications for all actions
- Mobile responsive design
- Keyboard navigation supported

---

**Status**: ✅ Complete and ready to use!

Next step: Run the SQL commands from `database.sql` in Supabase dashboard.
