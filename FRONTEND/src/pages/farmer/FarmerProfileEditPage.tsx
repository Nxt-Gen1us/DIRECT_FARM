import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, X, AlertCircle, CheckCircle, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../app/providers/AppProviders';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  fetchFarmerProfile,
  updateFarmerProfile,
  createFarmerProfile,
  addGalleryItem,
  removeGalleryItem,
} from '../../lib/api/farmers';
import { uploadGalleryItem, validateFile, uploadProfileImage } from '../../lib/api/upload';
import type { FarmerProfile } from '../../lib/types';
import { cn } from '../../lib/cn';

export function FarmerProfileEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: session, updateUser } = useApp();

  const [formData, setFormData] = useState<Partial<FarmerProfile>>({
    farmName: '',
    description: '',
    experienceYears: 0,
    organicCertification: false,
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    gallery: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [galleryType, setGalleryType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    if (!session || session.role !== 'farmer') {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await fetchFarmerProfile();
        setFormData(profile);
        setImagePreview(session?.avatar || '');
        setIsNewProfile(false);
        setErrors({});
      } catch (error) {
        // Profile doesn't exist - user needs to create it
        console.log('No existing profile - will create new one');
        setIsNewProfile(true);
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, navigate]);

  useEffect(() => {
    if (!loading) setLoading(false);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.farmName?.trim()) {
      newErrors.farmName = t('errors.farmNameRequired') || 'Farm name is required';
    }

    if (formData.farmName && formData.farmName.length > 100) {
      newErrors.farmName = t('errors.farmNameTooLong') || 'Farm name must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = t('errors.descriptionTooLong') || 'Description must be 1000 characters or less';
    }

    const years = parseInt(String(formData.experienceYears), 10);
    if (isNaN(years) || years < 0 || years > 150) {
      newErrors.experienceYears = t('errors.experienceYearsInvalid') || 'Experience must be between 0 and 150 years';
    }

    if (formData.location?.city && formData.location.city.length > 50) {
      newErrors.city = t('errors.cityTooLong') || 'City must be 50 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage(null);

      const result = await uploadProfileImage(file);
      setImagePreview(result.url);
      setMessage({ type: 'success', text: t('success.imageUploaded') || 'Profile picture updated' });
      
      // Update global user context immediately
      updateUser({ avatar: result.url });
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      setMessage({
        type: 'error',
        text: error.message || t('errors.uploadFailed') || 'Failed to upload image',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: t('errors.validationFailed') || 'Please fix the errors below' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      let updated: FarmerProfile;
      if (isNewProfile) {
        updated = await createFarmerProfile(formData);
        setIsNewProfile(false);
      } else {
        updated = await updateFarmerProfile(formData);
      }

      setFormData(updated);
      
      // Update global user context so profile picture changes everywhere
      // The farmer's avatar comes from their user.avatar field
      if (session) {
        updateUser({
          firstName: session.firstName,
          lastName: session.lastName,
          avatar: session.avatar,
        });
      }

      setMessage({ type: 'success', text: t('success.profileUpdated') || 'Profile updated successfully' });

      setTimeout(() => {
        navigate('/farmer');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({
        type: 'error',
        text: error.message || t('errors.updateFailed') || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file, 'any');
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      e.target.value = '';
      return;
    }

    setGalleryFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setGalleryPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryItem = async () => {
    if (!galleryFile) {
      setMessage({ type: 'error', text: t('errors.selectFile') || 'Please select a file' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      // Upload file to backend
      const uploaded = await uploadGalleryItem(galleryFile);

      // Add uploaded file to profile
      const updated = await addGalleryItem({
        mediaUrl: uploaded.mediaUrl,
        type: uploaded.type,
      });
      setFormData(updated);

      // Reset gallery form
      setGalleryFile(null);
      setGalleryPreview(null);
      setGalleryType('image');

      setMessage({ type: 'success', text: t('success.galleryItemAdded') || 'Gallery item added' });
    } catch (error: any) {
      console.error('Failed to add gallery item:', error);
      setMessage({
        type: 'error',
        text: error.message || t('errors.galleryAddFailed') || 'Failed to add gallery item',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveGalleryItem = async (index: number) => {
    try {
      setSaving(true);
      const updated = await removeGalleryItem(index);
      setFormData(updated);
      setMessage({ type: 'success', text: t('success.galleryItemRemoved') || 'Gallery item removed' });
    } catch (error: any) {
      console.error('Failed to remove gallery item:', error);
      setMessage({
        type: 'error',
        text: error.message || t('errors.galleryRemoveFailed') || 'Failed to remove gallery item',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-app max-w-4xl py-8">
        <Card className="p-8 text-center text-ink-soft">{t('common.loading')}</Card>
      </div>
    );
  }

  return (
    <div className="container-app max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-ink">
          {isNewProfile ? t('profile.createFarmer') : t('profile.editFarmer')} || 'Edit Farm Profile'
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {isNewProfile
            ? t('profile.createFarmerSub') || 'Create your farm profile'
            : t('profile.editFarmerSub') || 'Update your farm information'}
        </p>
      </div>

      {message && (
        <div
          className={cn(
            'mb-6 flex items-center gap-3 rounded-lg px-4 py-3',
            message.type === 'success' ? 'bg-nature-soft text-nature-dark' : 'bg-rose-soft text-rose-dark',
          )}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">{t('profile.profileImage') || 'Profile Picture'}</h2>

          <div className="mt-4">
            {imagePreview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                />
              </div>
            )}

            <label className="block">
              <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary/30 px-6 py-8 transition hover:border-primary/50 hover:bg-primary/5">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={32} className="text-primary" />
                  <span className="text-sm font-medium text-ink">{t('profile.selectImage') || 'Select Image'}</span>
                  <span className="text-xs text-muted">{t('profile.jpgPngMax5mb') || 'JPG, PNG (Max 5MB)'}</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </div>
            </label>

            {uploadingImage && (
              <p className="mt-2 text-sm text-muted">{t('common.uploading') || 'Uploading...'}</p>
            )}
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">{t('profile.farmInfo') || 'Farm Information'}</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft">{t('profile.farmName') || 'Farm Name'}</label>
              <input
                type="text"
                required
                value={formData.farmName || ''}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                className={cn(
                  'mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2',
                  errors.farmName
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-line focus:border-primary focus:ring-primary-soft',
                )}
                placeholder={t('profile.farmNamePlaceholder') || 'e.g., Organic Valley Farm'}
              />
              {errors.farmName && <p className="mt-1 text-xs text-rose-600">{errors.farmName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-soft">{t('profile.description') || 'Description'}</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn(
                  'mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2',
                  errors.description
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-line focus:border-primary focus:ring-primary-soft',
                )}
                placeholder={t('profile.descriptionPlaceholder') || 'Tell us about your farm...'}
                rows={4}
              />
              {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink-soft">{t('profile.experienceYears') || 'Years of Experience'}</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={formData.experienceYears || 0}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value, 10) })}
                  className={cn(
                    'mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2',
                    errors.experienceYears
                      ? 'border-rose-300 focus:ring-rose-200'
                      : 'border-line focus:border-primary focus:ring-primary-soft',
                  )}
                />
                {errors.experienceYears && <p className="mt-1 text-xs text-rose-600">{errors.experienceYears}</p>}
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-6">
                <input
                  type="checkbox"
                  checked={formData.organicCertification || false}
                  onChange={(e) => setFormData({ ...formData, organicCertification: e.target.checked })}
                  className="h-4 w-4 rounded border-line text-primary focus:ring-2 focus:ring-primary-soft"
                />
                <span className="text-sm font-medium text-ink">{t('profile.organic') || 'Organic Certified'}</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">{t('profile.location') || 'Location'}</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft">{t('profile.address') || 'Address'}</label>
              <input
                type="text"
                value={formData.location?.address || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value },
                  })
                }
                className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-soft"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft">{t('profile.city') || 'City'}</label>
                <input
                  type="text"
                  value={formData.location?.city || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value },
                    })
                  }
                  className={cn(
                    'mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2',
                    errors.city ? 'border-rose-300 focus:ring-rose-200' : 'border-line focus:ring-primary-soft',
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-soft">{t('profile.state') || 'State'}</label>
                <input
                  type="text"
                  value={formData.location?.state || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value },
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-soft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-soft">{t('profile.postalCode') || 'Postal Code'}</label>
                <input
                  type="text"
                  value={formData.location?.postalCode || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, postalCode: e.target.value },
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-soft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-soft">{t('profile.country') || 'Country'}</label>
                <input
                  type="text"
                  value={formData.location?.country || 'India'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, country: e.target.value },
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-soft"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Gallery */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">{t('profile.gallery') || 'Gallery'}</h2>

          {/* Existing Gallery */}
          {formData.gallery && formData.gallery.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink-soft mb-3">{t('profile.existingMedia') || 'Your Media'}</p>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {formData.gallery.map((item, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-line">
                    {item.type === 'video' ? (
                      <div className="aspect-video bg-ink flex items-center justify-center">
                        <span className="text-accent text-xs">Video</span>
                      </div>
                    ) : (
                      <img src={item.mediaUrl} alt="" className="aspect-square object-cover w-full" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(idx)}
                      disabled={saving}
                      className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Media */}
          {(!formData.gallery || formData.gallery.length < 20) && (
            <div className="mt-6 pt-6 border-t border-line">
              <p className="text-sm font-medium text-ink-soft mb-3">{t('profile.addMedia') || 'Add Media'}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">{t('profile.mediaType') || 'Media Type'}</label>
                  <div className="flex gap-3">
                    {(['image', 'video'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          value={type}
                          checked={galleryType === type}
                          onChange={(e) => setGalleryType(e.target.value as 'image' | 'video')}
                          className="h-4 w-4"
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">{t('profile.file') || 'File'}</label>
                  <input
                    type="file"
                    accept={galleryType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleGalleryFileChange}
                    className="block w-full text-sm"
                  />
                  {galleryPreview && (
                    <div className="mt-3">
                      {galleryType === 'image' ? (
                        <img src={galleryPreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                      ) : (
                        <video src={galleryPreview} className="h-24 w-24 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={!galleryFile || saving}
                  onClick={handleAddGalleryItem}
                >
                  <Plus size={16} />
                  {t('profile.addMedia') || 'Add Media'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? t('common.saving') : t('common.save')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/farmer')}>
            <X size={16} />
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
