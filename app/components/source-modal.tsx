import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SourceData } from '../services/worldmap.service';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SourceData) => void;
  initialData?: Partial<SourceData>;
  countryId: string;
  countryName: string;
}

export function SourceModal({ isOpen, onClose, onSubmit, initialData, countryId, countryName }: SourceModalProps) {
  const [formData, setFormData] = useState<Partial<SourceData>>({
    link: '',
    nickname: '',
    category: '',
    subcategory: '',
    country: countryName || '',
    countryid: countryId || '',
    type: 'link',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset form data when modal opens/closes or initialData changes
    setFormData({
      link: initialData?.link || '',
      nickname: initialData?.nickname || '',
      category: initialData?.category || '',
      subcategory: initialData?.subcategory || '',
      country: countryName || '',
      countryid: countryId || '',
      type: 'link',
    });
    setErrors({});
  }, [initialData, isOpen, countryId, countryName]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.link?.trim()) newErrors.link = 'Please enter a URL';
    if (!formData.nickname?.trim()) newErrors.nickname = 'Please enter a title';
    if (!formData.category?.trim()) newErrors.category = 'Please select a category';
    if (!formData.subcategory?.trim()) newErrors.subcategory = 'Please select a subcategory';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData as SourceData);
      setFormData({
        link: '',
        nickname: '',
        category: '',
        subcategory: '',
        country: countryName || '',
        countryid: countryId || '',
        type: 'link',
      });
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (field: keyof SourceData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const getSubcategoryOptions = (category: string) => {
    switch (category) {
      case 'address':
        return ['Electricity', 'Water', 'Gas', 'Telecom & Internet', 'Electricity & gas'];
      case 'id':
        return [
          'Passport',
          'Government ID',
          'Tax ID',
          'Driving License',
          'Degree(School/College)',
          'Military/Public Officer',
          'Birth Certificate',
          'Other',
          'Credit Bureau',
        ];
      case 'bank':
        return ['bank', 'neobanks'];
      case 'professional':
        return ['ca'];
      case 'organization':
        return ['Company Registry'];
      case 'crypto':
        return ['crypto'];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Source' : 'Add New Source'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link">Original Source (*)</Label>
            <Input
              id="link"
              type="url"
              value={formData.link || ''}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="Enter website URL"
            />
            {errors.link && <p className="text-sm text-red-500">{errors.link}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Title (*)</Label>
            <Input
              id="nickname"
              type="text"
              value={formData.nickname || ''}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Enter source title"
            />
            {errors.nickname && <p className="text-sm text-red-500">{errors.nickname}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (*)</Label>
            <Select
              value={formData.category || ''}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="address">Utilities</SelectItem>
                <SelectItem value="id">Identity</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory (*)</Label>
            <Select
              value={formData.subcategory || ''}
              onValueChange={(value) => handleInputChange('subcategory', value)}
              disabled={!formData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {getSubcategoryOptions(formData.category || '').map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subcategory && <p className="text-sm text-red-500">{errors.subcategory}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {initialData ? 'Save Changes' : 'Add Source'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 