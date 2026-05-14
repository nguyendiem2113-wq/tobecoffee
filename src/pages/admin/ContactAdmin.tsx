import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Eye, ArrowUp, ArrowDown } from 'lucide-react';

interface FormField {
  id: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  order_index: number;
}

interface ContactMessage {
  id: string;
  form_data: Record<string, any>;
  created_at: string;
}

const ContactAdmin = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageViewOpen, setMessageViewOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [formData, setFormData] = useState({
    field_name: '',
    field_type: 'text',
    is_required: false,
  });

  useEffect(() => {
    fetchFormFields();
    fetchMessages();
  }, []);

  const fetchFormFields = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_form_fields')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFormFields(data || []);
    } catch (error) {
      toast.error('Failed to load form fields');
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveField = async () => {
    if (!formData.field_name.trim()) {
      toast.error('Field name is required');
      return;
    }

    try {
      if (editingField) {
        const { error } = await supabase
          .from('contact_form_fields')
          .update({
            field_name: formData.field_name,
            field_type: formData.field_type,
            is_required: formData.is_required,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingField.id);

        if (error) throw error;
        toast.success('Field updated');
      } else {
        const { error } = await supabase.from('contact_form_fields').insert([
          {
            field_name: formData.field_name,
            field_type: formData.field_type,
            is_required: formData.is_required,
            order_index: formFields.length,
          },
        ]);

        if (error) throw error;
        toast.success('Field created');
      }

      setDialogOpen(false);
      setEditingField(null);
      setFormData({ field_name: '', field_type: 'text', is_required: false });
      fetchFormFields();
    } catch (error) {
      toast.error('Failed to save field');
      console.error(error);
    }
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFormData({
      field_name: field.field_name,
      field_type: field.field_type,
      is_required: field.is_required,
    });
    setDialogOpen(true);
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      const { error } = await supabase.from('contact_form_fields').delete().eq('id', id);

      if (error) throw error;
      toast.success('Field deleted');
      fetchFormFields();
    } catch (error) {
      toast.error('Failed to delete field');
      console.error(error);
    }
  };

  const handleReorderField = async (index: number, direction: number) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= formFields.length) return;

    const reordered = [...formFields];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);

    const updatedFields = reordered.map((field, idx) => ({
      ...field,
      order_index: idx,
    }));

    setFormFields(updatedFields);

    try {
      await Promise.all(
        updatedFields.map((field) =>
          supabase
            .from('contact_form_fields')
            .update({ order_index: field.order_index })
            .eq('id', field.id),
        ),
      );
      toast.success('Field order updated');
    } catch (error) {
      toast.error('Failed to update order');
      console.error(error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);

      if (error) throw error;
      toast.success('Message deleted');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>

        <Tabs defaultValue="fields">
          <TabsList>
            <TabsTrigger value="fields">Form Fields</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Form Fields</h2>
              <Button
                onClick={() => {
                  setEditingField(null);
                  setFormData({ field_name: '', field_type: 'text', is_required: false });
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Field
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.field_name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{field.field_type}</TableCell>
                        <TableCell>
                          <span className={field.is_required ? 'text-green-600' : 'text-gray-400'}>
                            {field.is_required ? '✓ Yes' : '✗ No'}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={index === 0}
                            onClick={() => handleReorderField(index, -1)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={index === formFields.length - 1}
                            onClick={() => handleReorderField(index, 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditField(field)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteField(field.id)}
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
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Messages</h2>

            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  {messages.length === 0 ? (
                    <p className="text-gray-500">No messages yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Preview</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="text-sm">
                              {new Date(message.created_at).toLocaleDateString()} at{' '}
                              {new Date(message.created_at).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="text-sm truncate max-w-xs text-gray-600">
                              {JSON.stringify(message.form_data).substring(0, 50)}...
                            </TableCell>
                            <TableCell className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setMessageViewOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="field_name">Field Name *</Label>
              <Input
                id="field_name"
                value={formData.field_name}
                onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                placeholder="e.g., name, email, phone"
              />
            </div>

            <div>
              <Label htmlFor="field_type">Field Type *</Label>
              <Select value={formData.field_type} onValueChange={(value) => setFormData({ ...formData, field_type: value })}>
                <SelectTrigger id="field_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="tel">Telephone</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: !!checked })}
              />
              <Label htmlFor="is_required" className="cursor-pointer">
                Required field
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveField}>
              {editingField ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={messageViewOpen} onOpenChange={setMessageViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Received: {new Date(selectedMessage.created_at).toLocaleString()}
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                {Object.entries(selectedMessage.form_data).map(([key, value]) => (
                  <div key={key} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                    <div className="font-semibold text-gray-700 capitalize">{key}</div>
                    <div className="text-gray-600 mt-1 break-words">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ContactAdmin;
