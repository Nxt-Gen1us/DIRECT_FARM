import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, X, AlertCircle, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../app/providers/AppProviders';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { fetchProfile, updateProfile } from '../lib/api/users';
import { uploadProfileImage } from '../lib/api/upload';
import type { User } from '../lib/types';
import { cn } from '../lib/cn';

export function CustomerProfileEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: session, updateUser } = useApp();

  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    preferences: {
      notifications: true,
      newsletter: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await fetchProfile();
        setFormData(profile);
        setImagePreview(profile.avatar || '');
        setErrors({});
      } catch (error) {
        console.error('Failed to load profile:', error);
        setMessage({ type: 'error', text: t('errors.loadFailed') || 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, navigate, t]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = t('errors.firstNameRequired') || 'First name is required';
    }

    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = t('errors.firstNameTooLong') || 'First name must be 50 characters or less';
    }

    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = t('errors.lastNameTooLong') || 'Last name must be 50 characters or less';
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
      setFormData({ ...formData, avatar: result.url });
      setImagePreview(result.url);
      setMessage({ type: 'success', text: t('success.imageUploaded') || 'Profile picture updated' });
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

      const updated = await updateProfile(formData);
      setFormData(updated);
      
      // Update global user context so avatar changes everywhere
      updateUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
        avatar: updated.avatar,
        preferences: updated.preferences,
      });

      setMessage({ type: 'success', text: t('success.profileUpdated') || 'Profile updated successfully' });

      setTimeout(() => {
        navigate('/account');
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

  if (loading) {
    return (
      <div className="container-app max-w-2xl py-8">
        <Card className="p-8 text-center text-ink-soft">{t('common.loading')}</Card>
      </div>
    );
  }

  return (
    <div className="container-app max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-ink">{t('profile.editCustomer') || 'Edit Profile'}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t('profile.editCustomerSub') || 'Update your personal information'}</p>
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
          <h2 className="font-display text-lg text-ink">{t('profile.basicInfo') || 'Basic Information'}</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-soft">{t('profile.firstName') || 'First Name'}</label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={cn(
                  'mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2',
                  errors.firstName
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-line focus:border-primary focus:ring-primary-soft',
                )}
              />
              {errors.firstName && <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-soft">{t('profile.lastName') || 'Last Name'}</label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={cn(
                  'mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2',
                  errors.lastName
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-line focus:border-primary focus:ring-primary-soft',
                )}
              />
              {errors.lastName && <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-soft">{t('profile.email') || 'Email'}</label>
              <input
                type="email"
                value={formData.email || ''}
                disabled
                className="mt-2 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-muted"
              />
              <p className="mt-1 text-xs text-muted">{t('profile.emailNotEditable') || 'Email cannot be changed'}</p>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">{t('profile.preferences') || 'Preferences'}</h2>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preferences?.notifications ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      notifications: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-line text-primary focus:ring-2 focus:ring-primary-soft"
              />
              <div>
                <p className="text-sm font-medium text-ink">{t('profile.notifications') || 'Email Notifications'}</p>
                <p className="text-xs text-ink-soft">{t('profile.notificationsSub') || 'Receive updates about orders and promotions'}</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preferences?.newsletter ?? false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      newsletter: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-line text-primary focus:ring-2 focus:ring-primary-soft"
              />
              <div>
                <p className="text-sm font-medium text-ink">{t('profile.newsletter') || 'Newsletter'}</p>
                <p className="text-xs text-ink-soft">{t('profile.newsletterSub') || 'Subscribe to our weekly newsletter'}</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? t('common.saving') : t('common.save')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/account')}>
            <X size={16} />
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
