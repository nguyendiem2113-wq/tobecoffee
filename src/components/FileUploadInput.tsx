import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader } from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  onFileSelect: (file: File) => Promise<void>;
  accept?: string;
  disabled?: boolean;
}

export const FileUploadInput = ({
  label,
  onFileSelect,
  accept = 'image/*',
  disabled = false,
}: FileUploadInputProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onFileSelect(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        ref={fileInputRef}
        id={label}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading || disabled}
        className="cursor-pointer"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || disabled}
      >
        {uploading ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" /> Choose File
          </>
        )}
      </Button>
    </div>
  );
};
