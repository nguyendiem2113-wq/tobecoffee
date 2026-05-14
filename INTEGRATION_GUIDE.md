# Frontend Integration Guide

This guide explains how to connect the admin panel data to your website frontend.

## Overview

The admin panel manages content in Supabase. To display this content on your website:

1. Fetch data from Supabase tables
2. Display data on corresponding pages
3. Data updates automatically when edited in admin

## Data Fetching Pattern

```typescript
import { supabase } from '@/lib/supabase';

// Example: Fetch products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('order_index', { ascending: true });
```

## Frontend Pages to Update

### 1. Homepage (`/`)

**Current:** Uses static hero image and content
**To Connect:** Fetch from `homepage` table

```typescript
// In Index.tsx
const [homepage, setHomepage] = useState(null);

useEffect(() => {
  const fetchHomepage = async () => {
    const { data } = await supabase
      .from('homepage')
      .select('*')
      .single();
    setHomepage(data);
  };
  fetchHomepage();
}, []);

// Use: homepage.cover_image, homepage.hero_title, etc.
```

### 2. About Page (`/story`)

**Current:** Uses static content
**To Connect:** Fetch from `about_page` table

```typescript
// In Story.tsx
const [about, setAbout] = useState(null);

useEffect(() => {
  const fetchAbout = async () => {
    const { data } = await supabase
      .from('about_page')
      .select('*')
      .single();
    setAbout(data);
  };
  fetchAbout();
}, []);

// Display: about.title, about.content
```

### 3. Products Page (`/product`)

**Current:** Hardcoded product array
**To Connect:** Fetch from `products` table

```typescript
// In Product.tsx
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('order_index', { ascending: true });
    setProducts(data || []);
  };
  fetchProducts();
}, []);

// Render products.map(p => (
//   <ProductCard 
//     name={p.name}
//     description={p.description}
//     images={p.images}
//     videos={p.videos}
//   />
// ))
```

### 4. Blog Page (`/blog`)

**Current:** Hardcoded blog articles
**To Connect:** Fetch from `blog_posts` table

```typescript
// In Blog.tsx
const [posts, setPosts] = useState([]);

useEffect(() => {
  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('order_index', { ascending: true });
    setPosts(data || []);
  };
  fetchPosts();
}, []);

// Render posts.map(p => (
//   <BlogCard
//     title={p.title}
//     slug={p.slug}
//     content={p.content}
//     images={p.images}
//   />
// ))
```

### 5. Contact Form (`/contact`)

**Current:** Static form fields
**To Connect:** Fetch from `contact_form_fields` table

```typescript
// In Contact.tsx
const [formFields, setFormFields] = useState([]);

useEffect(() => {
  const fetchFormFields = async () => {
    const { data } = await supabase
      .from('contact_form_fields')
      .select('*')
      .order('order_index', { ascending: true });
    setFormFields(data || []);
  };
  fetchFormFields();
}, []);

// Render dynamic form from formFields
// On submit, save to contact_messages table
const handleSubmit = async (formData) => {
  await supabase
    .from('contact_messages')
    .insert([{ form_data: formData }]);
};
```

## Database Tables Reference

### homepage
```
{
  id: uuid,
  cover_image: string (URL),
  hero_title: string,
  hero_subtitle: string,
  sections: jsonb (for future use),
  created_at: timestamp,
  updated_at: timestamp
}
```

### about_page
```
{
  id: uuid,
  title: string,
  content: string,
  sections: jsonb (for future use),
  created_at: timestamp,
  updated_at: timestamp
}
```

### products
```
{
  id: uuid,
  name: string,
  description: string,
  content: string (detailed info),
  images: string[] (URLs),
  videos: string[] (URLs),
  order_index: integer,
  created_at: timestamp,
  updated_at: timestamp
}
```

### blog_posts
```
{
  id: uuid,
  title: string,
  slug: string (unique),
  content: string,
  images: string[] (URLs),
  videos: string[] (URLs),
  order_index: integer,
  created_at: timestamp,
  updated_at: timestamp
}
```

### contact_form_fields
```
{
  id: uuid,
  field_name: string,
  field_type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox' | 'select',
  is_required: boolean,
  order_index: integer,
  created_at: timestamp,
  updated_at: timestamp
}
```

### contact_messages
```
{
  id: uuid,
  form_data: jsonb (key-value pairs),
  ip_address: string,
  created_at: timestamp
}
```

## React Query Integration (Already Installed)

For better performance with caching, use React Query:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data: products, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('order_index', { ascending: true });
    return data;
  },
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

## Real-time Updates (Advanced)

To update content when admin makes changes:

```typescript
useEffect(() => {
  const subscription = supabase
    .from('products')
    .on('*', (payload) => {
      // Refetch data when changes occur
      fetchProducts();
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## Error Handling

Always handle potential errors:

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) throw error;
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

// Display loading state
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!data) return <div>No data found</div>;
```

## Environment Variables

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://kkvvosbyntcfpmluqxmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Access in code:
```typescript
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Performance Tips

1. **Use order_index**: Content is already ordered by `order_index` field
2. **Limit results**: Use `.limit(10)` for pagination
3. **Cache with React Query**: Already installed and configured
4. **Image optimization**: URLs point to Supabase Storage (CDN)
5. **Lazy load images**: Use `loading="lazy"` attribute

## Implementation Checklist

- [ ] Update Index.tsx to fetch homepage data
- [ ] Update Story.tsx to fetch about_page data
- [ ] Update Product.tsx to fetch products
- [ ] Update Blog.tsx to fetch blog_posts
- [ ] Update Contact.tsx to fetch form_fields and submit messages
- [ ] Add error handling to all data fetches
- [ ] Test all pages load data from Supabase
- [ ] Deploy and verify in production

## Next Steps

1. Start with Homepage integration
2. Test data displays correctly
3. Move to other pages
4. Add real-time updates if needed
5. Deploy to production

See `ADMIN_QUICKSTART.md` for admin usage instructions.
See `ADMIN_SETUP.md` for technical setup details.
