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

interface Product {
  id: string;
  name: string;
  description: string;
  content: string;
  images: string[];
  videos: string[];
  order_index: number;
}

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    images: [] as string[],
    videos: [] as string[],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Product updated');
      } else {
        const { error } = await supabase.from('products').insert([
          {
            ...formData,
            order_index: products.length,
          },
        ]);

        if (error) throw error;
        toast.success('Product created');
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', content: '', images: [], videos: [] });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      content: product.content,
      images: product.images || [],
      videos: product.videos || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const handleAddImage = async (file: File) => {
    const url = await uploadImage(file, 'products/images');
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
    const url = await uploadVideo(file, 'products/videos');
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', description: '', content: '', images: [], videos: [] });
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="truncate max-w-xs">{product.description}</TableCell>
                      <TableCell>{product.images?.length || 0}</TableCell>
                      <TableCell>{product.videos?.length || 0}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
              />
            </div>

            <div>
              <Label htmlFor="content">Detailed Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter detailed product content"
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
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProductsAdmin;
