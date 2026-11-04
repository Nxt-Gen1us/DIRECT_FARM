import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, AlertCircle, CheckCircle, MapPin, Award, Sprout } from 'lucide-react';
import { useApp } from '../../app/providers/AppProviders';
import { Button } from '../../components/ui/Button';
import { Card, SectionHead } from '../../components/ui/Card';
import { PageTitle, SectionTitle } from '../../components/ui/Typography';
import { fetchFarmerProfile, deleteFarmerProfile } from '../../lib/api/farmers';
import type { FarmerProfile } from '../../lib/types';
import { cn } from '../../lib/cn';

export function FarmerProfileViewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: session } = useApp();

  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!session || session.role !== 'farmer') {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetchFarmerProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to load profile:', error);
        // No profile exists yet
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, navigate, t]);

  const handleDelete = async () => {
    if (!window.confirm(t('profile.confirmDelete') || 'Are you sure you want to delete your profile?')) {
      return;
    }

    try {
      setDeleting(true);
      setMessage(null);

      await deleteFarmerProfile();
      setMessage({ type: 'success', text: t('success.profileDeleted') || 'Profile deleted successfully' });

      setTimeout(() => {
        navigate('/farmer');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to delete profile:', error);
      setMessage({
        type: 'error',
        text: error.message || t('errors.deleteFailed') || 'Failed to delete profile',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-app max-w-4xl py-8">
        <Card className="p-8 text-center text-ink-soft">{t('common.loading')}</Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-app max-w-4xl py-8">
        <SectionHead kicker={t('nav.farmer')} title={t('profile.noProfile') || 'No Profile Yet'} />
        <p className="mt-2 text-sm text-ink-soft">
          {t('profile.createProfilePrompt') || 'Create your farm profile to get started'}
        </p>
        <Link to="/farmer/profile/edit" className="mt-4 inline-block">
          <Button>{t('profile.createProfile') || 'Create Profile'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app max-w-4xl py-8">
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

      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <SectionHead kicker={t('nav.farm')} title={profile.farmName} />
        </div>
        <div className="flex gap-2">
          <Link to="/farmer/profile/edit">
            <Button>
              <Edit size={16} />
              {t('common.edit')}
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            className="text-rose-600 hover:text-rose-700"
          >
            <Trash2 size={16} />
            {deleting ? t('common.deleting') : t('common.delete')}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="mb-6 p-6">
        <SectionTitle>{t('profile.farmInfo') || 'Farm Information'}</SectionTitle>

        <div className="mt-6 space-y-4">
          {profile.description && (
            <div>
              <p className="text-sm font-medium text-ink-soft">{t('profile.description') || 'Description'}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{profile.description}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-cream p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('profile.experience') || 'Experience'}</p>
              <p className="mt-2 font-display text-2xl text-primary">{profile.experienceYears || 0}</p>
              <p className="text-xs text-ink-soft">{t('profile.years') || 'years'}</p>
            </div>

            <div className="rounded-lg bg-cream p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('profile.verification') || 'Verification'}</p>
              <p className="mt-2 text-sm font-medium text-ink">
                {profile.verificationStatus ? (
                  <span className={profile.verificationStatus === 'verified' ? 'text-nature' : 'text-secondary'}>
                    {t(`profile.status.${profile.verificationStatus}`) || profile.verificationStatus}
                  </span>
                ) : (
                  '—'
                )}
              </p>
            </div>

            <div className="rounded-lg bg-cream p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('profile.organic') || 'Organic'}</p>
              <p className="mt-2 text-sm font-medium text-ink">
                {profile.organicCertification ? (
                  <span className="inline-flex items-center gap-1 text-nature">
                    <Sprout size={14} /> {t('common.yes')}
                  </span>
                ) : (
                  t('common.no')
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Location */}
      {profile.location && (
        <Card className="mb-6 p-6">
          <SectionTitle>{t('profile.location') || 'Location'}</SectionTitle>

          <div className="mt-4 flex items-start gap-3 rounded-lg bg-cream p-4">
            <MapPin size={20} className="mt-0.5 flex-shrink-0 text-primary" />
            <div className="flex-1">
              {profile.location.address && <p className="font-medium text-ink">{profile.location.address}</p>}
              <p className="text-sm text-ink-soft">
                {profile.location.city && `${profile.location.city}, `}
                {profile.location.state && `${profile.location.state} `}
                {profile.location.postalCode && `${profile.location.postalCode}`}
              </p>
              {profile.location.country && <p className="text-xs text-muted">{profile.location.country}</p>}
            </div>
          </div>
        </Card>
      )}

      {/* Gallery */}
      {profile.gallery && profile.gallery.length > 0 && (
        <Card className="mb-6 p-6">
          <SectionTitle>{t('profile.gallery') || 'Gallery'}</SectionTitle>

          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {profile.gallery.map((item, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-line">
                {item.type === 'video' ? (
                  <div className="aspect-square bg-ink flex items-center justify-center">
                    <span className="text-accent text-xs">Video</span>
                  </div>
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={`Gallery ${idx}`}
                    className="aspect-square object-cover w-full group-hover:scale-105 transition"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <Link to="/farmer/profile/edit" className="text-sm font-medium text-primary">
              {t('profile.manageGallery') || 'Manage Gallery'} →
            </Link>
          </div>
        </Card>
      )}

      {/* Stats */}
      {(profile.trustedBadge || profile.verificationStatus === 'verified') && (
        <Card className="mb-6 p-6">
          <SectionTitle>{t('profile.badges') || 'Badges & Recognition'}</SectionTitle>

          <div className="mt-4 flex flex-wrap gap-3">
            {profile.trustedBadge && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-nature-soft px-4 py-2">
                <Award size={16} className="text-nature" />
                <span className="text-sm font-medium text-nature-dark">{t('profile.trustedBadge') || 'Trusted Farmer'}</span>
              </div>
            )}
            {profile.verificationStatus === 'verified' && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-primary-soft px-4 py-2">
                <Award size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary-dark">{t('profile.verified') || 'Verified Profile'}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link to="/farmer">
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>
    </div>
  );
}
