# Admin Panel Quick Start Guide

## Access the Admin Panel

Navigate to: `http://localhost:5173/admin`

## What's Included

### ✅ Complete CRUD Operations

All admin pages support:
- **Create** - Add new content
- **Read** - View all content
- **Update** - Edit existing content  
- **Delete** - Remove content

### ✅ File Upload Support

- **Images**: Upload product/blog images directly from your computer
- **Videos**: Upload product/blog videos directly from your computer
- **Automatic Storage**: Files stored in Supabase Storage bucket
- **Public URLs**: Automatic public URLs generated for all uploads

### ✅ Database Integration

All changes sync immediately to Supabase database with:
- Automatic timestamps (created_at, updated_at)
- Data validation
- Error handling with toast notifications

## Navigation

**Admin Menu:**
- `/admin` - Dashboard (overview with statistics)
- `/admin/homepage` - Edit homepage hero section
- `/admin/about` - Edit about page content
- `/admin/products` - Manage products
- `/admin/blog` - Manage blog posts
- `/admin/contact` - Manage contact form and messages

## How to Use Each Section

### 1. Homepage Admin

1. Go to `/admin/homepage`
2. Click "Upload Images" to add cover image from your computer
3. Or paste image URL manually
4. Edit hero title and subtitle
5. See live preview as you type
6. Click "Save Changes"

### 2. About Page Admin

1. Go to `/admin/about`
2. Edit page title and content
3. See live preview
4. Click "Save Changes"

### 3. Products Admin

1. Go to `/admin/products`
2. Click "+ Add Product" button
3. Fill in:
   - Product Name (required)
   - Description
   - Detailed Content
4. Upload images by clicking "Upload Images" button
5. Upload videos by clicking "Upload Videos" button
6. Click "Create" or "Update"
7. Edit/Delete from the table list

### 4. Blog Admin

1. Go to `/admin/blog`
2. Click "+ Add Post" button
3. Fill in:
   - Post Title (required)
   - Slug auto-generates from title but you can edit it
   - Content
4. Upload images and videos
5. Click "Create" or "Update"
6. Edit/Delete from the table list

### 5. Contact Management

**Form Fields Tab:**
- Add form fields your contact form needs
- Choose field types: text, email, tel, textarea, checkbox, select
- Mark as required or optional
- View all form fields in table

**Messages Tab:**
- View all submitted contact messages
- Click eye icon to view full message details
- Delete messages as needed

## File Upload Tips

✓ Supported image formats: JPG, PNG, WebP, GIF
✓ Supported video formats: MP4, WebM, MOV
✓ Image max size: 5MB
✓ Video max size: 100MB
✓ Files automatically organized in folders:
  - `homepage/` - Homepage images
  - `products/images/` - Product images
  - `products/videos/` - Product videos
  - `blog/images/` - Blog images
  - `blog/videos/` - Blog videos

## Database Schema

### Tables Created:

1. **homepage** - Single row with hero section
2. **about_page** - Single row with about content
3. **products** - Product listings
4. **blog_posts** - Blog article posts
5. **contact_form_fields** - Custom form fields
6. **contact_messages** - Submitted messages

### Media Storage:

- Bucket: `media`
- All uploads public URLs
- Organized in folders by type

## Common Tasks

### Change Homepage Cover Image
1. Go to `/admin/homepage`
2. Click "Upload Images" or paste URL
3. Preview updates automatically
4. Save changes

### Add a New Product
1. Go to `/admin/products`
2. Click "+ Add Product"
3. Fill name, description, content
4. Upload images/videos from your computer
5. Click "Create"
6. Product appears in table immediately

### Add a Blog Post
1. Go to `/admin/blog`
2. Click "+ Add Post"
3. Enter title - slug auto-generates
4. Write content
5. Upload images/videos
6. Click "Create"
7. Post appears in table

### Manage Contact Form
1. Go to `/admin/contact`
2. Form Fields tab to add/edit/delete fields
3. Messages tab to view/delete submissions

## Keyboard Shortcuts

- Click away from dialog to close
- Tab to navigate form fields
- Ctrl+Click image preview to open in new tab

## Troubleshooting

**Can't upload files?**
- Check file size limits (5MB images, 100MB videos)
- Verify file type is supported
- Check browser console for errors

**Changes not saving?**
- Check toast notifications for errors
- Verify internet connection
- Reload page and try again

**Database empty?**
- Run the SQL commands from `database.sql`
- Confirm execution in Supabase dashboard

## Support

The admin panel includes:
- Real-time validation
- Error messages with solutions
- Live preview for most content
- One-click delete confirmation
- Toast notifications for all actions

For detailed SQL schema, see `database.sql`
For technical setup, see `ADMIN_SETUP.md`
