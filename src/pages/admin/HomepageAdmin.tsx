import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploadInput } from '@/components/FileUploadInput';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { toast } from 'sonner';

interface Homepage {
  id: string;
  cover_image: string | null;
  hero_title: string;
  hero_subtitle: string;
  sections: any;
}

const HomepageAdmin = () => {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cover_image: '',
    hero_title: '',
    hero_subtitle: '',
  });

  useEffect(() => {
    fetchHomepage();
  }, []);

  const fetchHomepage = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setHomepage(data);
        setFormData({
          cover_image: data.cover_image || '',
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
        });
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('homepage')
          .insert([{
            cover_image: 'https://images.unsplash.com/photo-1495474472645-4d71bcdd2085?w=1200',
            hero_title: 'Welcome to ToBe Coffee',
            hero_subtitle: 'Discover Premium Coffee Experience',
            sections: [],
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setHomepage(newData);
        setFormData({
          cover_image: newData.cover_image || '',
          hero_title: newData.hero_title,
          hero_subtitle: newData.hero_subtitle,
        });
      }
    } catch (error) {
      toast.error('Failed to load homepage');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageUpload = async (file: File) => {
    const url = await uploadImage(file, 'homepage');
    if (url) {
      setFormData({
        ...formData,
        cover_image: url,
      });
      toast.success('Cover image uploaded');
    }
  };

  const handleSave = async () => {
    if (!homepage) {
      toast.error('Homepage not initialized');
      return;
    }

    try {
      const { error } = await supabase
        .from('homepage')
        .update({
          cover_image: formData.cover_image,
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', homepage.id);

      if (error) throw error;
      toast.success('Homepage updated successfully');
      fetchHomepage();
    } catch (error) {
      toast.error('Failed to update homepage');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-600">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Homepage</h1>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <FileUploadInput
                label="Cover Image"
                onFileSelect={handleCoverImageUpload}
                accept="image/*"
              />
              <p className="text-sm text-gray-600 mt-2">Or paste image URL below:</p>
              <Input
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
              />
              {formData.cover_image && (
                <div className="mt-3 border border-gray-200 rounded overflow-hidden">
                  <img
                    src={formData.cover_image}
                    alt="Cover preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                placeholder="Enter hero title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Preview</h4>
              <div
                className="h-64 bg-cover bg-center rounded flex items-center justify-center"
                style={{
                  backgroundImage: `url(${formData.cover_image})`,
                  backgroundColor: '#f3f4f6',
                }}
              >
                <div className="text-center text-white drop-shadow-lg">
                  <h2 className="text-4xl font-bold mb-2">{formData.hero_title}</h2>
                  <p className="text-xl">{formData.hero_subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={fetchHomepage}>
                Reset
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HomepageAdmin;
