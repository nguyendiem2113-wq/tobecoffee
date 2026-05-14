import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUploadInput } from '@/components/FileUploadInput';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage, uploadVideo, deleteFile } from '@/lib/storage';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  images: string[];
  videos: string[];
  order_index: number;
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    images: [] as string[],
    videos: [] as string[],
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to load blog posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            images: formData.images,
            videos: formData.videos,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Post updated');
      } else {
        const { error } = await supabase.from('blog_posts').insert([
          {
            ...formData,
            order_index: posts.length,
          },
        ]);

        if (error) throw error;
        toast.success('Post created');
      }

      setDialogOpen(false);
      setEditingPost(null);
      setFormData({ title: '', slug: '', content: '', images: [], videos: [] });
      fetchPosts();
    } catch (error) {
      toast.error('Failed to save post');
      console.error(error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      images: post.images || [],
      videos: post.videos || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);

      if (error) throw error;
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
      console.error(error);
    }
  };

  const handleAddImage = async (file: File) => {
    const url = await uploadImage(file, 'blog/images');
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      });
      toast.success('Image uploaded');
    }
  };

  const handleRemoveImage = async (index: number) => {
    const image = formData.images[index];
    if (await deleteFile(image)) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
      toast.success('Image removed');
    }
  };

  const handleAddVideo = async (file: File) => {
    const url = await uploadVideo(file, 'blog/videos');
    if (url) {
      setFormData({
        ...formData,
        videos: [...formData.videos, url],
      });
      toast.success('Video uploaded');
    }
  };

  const handleRemoveVideo = async (index: number) => {
    const video = formData.videos[index];
    if (await deleteFile(video)) {
      setFormData({
        ...formData,
        videos: formData.videos.filter((_, i) => i !== index),
      });
      toast.success('Video removed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Button
            onClick={() => {
              setEditingPost(null);
              setFormData({ title: '', slug: '', content: '', images: [], videos: [] });
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Post
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell className="text-sm text-gray-600">{post.slug}</TableCell>
                      <TableCell>{post.images?.length || 0}</TableCell>
                      <TableCell>{post.videos?.length || 0}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Auto-generated from title"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter post content"
                rows={4}
              />
            </div>

            <div>
              <FileUploadInput
                label="Upload Images"
                onFileSelect={handleAddImage}
                accept="image/*"
              />
              <div className="space-y-2 mt-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img src={img} alt="preview" className="h-8 w-8 rounded object-cover" />
                      <span className="text-sm truncate">{img.split('/').pop()}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <FileUploadInput
                label="Upload Videos"
                onFileSelect={handleAddVideo}
                accept="video/*"
              />
              <div className="space-y-2 mt-3">
                {formData.videos.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="text-sm truncate">{vid.split('/').pop()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVideo(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPost ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BlogAdmin;
