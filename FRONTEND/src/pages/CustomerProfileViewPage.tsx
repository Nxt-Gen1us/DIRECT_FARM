import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Mail, MapPin, Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../app/providers/AppProviders';
import { Button } from '../components/ui/Button';
import { Card, SectionHead } from '../components/ui/Card';
import { fetchProfile, getAddresses } from '../lib/api/users';
import type { User } from '../lib/types';
import { cn } from '../lib/cn';

export function CustomerProfileViewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: session } = useApp();

  const [profile, setProfile] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, addressData] = await Promise.all([
          fetchProfile(),
          getAddresses(),
        ]);
        setProfile(profileData);
        setAddresses(addressData);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setMessage({ type: 'error', text: t('errors.loadFailed') || 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, navigate, t]);

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
        <Card className="p-8 text-center text-ink-soft">{t('profile.notFound')}</Card>
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
        <div className="flex items-center gap-4">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={`${profile.firstName} ${profile.lastName || ''}`}
              className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
            />
          )}
          <SectionHead kicker={t('nav.account')} title={`${profile.firstName} ${profile.lastName || ''}`} />
        </div>
        <Link to="/customer/profile/edit">
          <Button>
            <Edit size={16} />
            {t('common.edit')}
          </Button>
        </Link>
      </div>

      {/* Personal Information */}
      <Card className="mb-6 p-6">
        <h2 className="font-display text-lg text-ink">{t('profile.personalInfo') || 'Personal Information'}</h2>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-ink-soft">{t('profile.firstName') || 'First Name'}</p>
              <p className="mt-1 text-base text-ink">{profile.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-ink-soft">{t('profile.lastName') || 'Last Name'}</p>
              <p className="mt-1 text-base text-ink">{profile.lastName || '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-cream p-4">
            <Mail size={18} className="text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-soft">{t('profile.email') || 'Email'}</p>
              <p className="truncate text-base text-ink">{profile.email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-ink-soft">{t('profile.verified') || 'Verified'}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', profile.verified ? 'bg-nature' : 'bg-muted')} />
                <span className="text-sm text-ink">{profile.verified ? t('common.yes') : t('common.no')}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-ink-soft">{t('profile.memberSince') || 'Member Since'}</p>
              <p className="mt-1 text-sm text-ink">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : '—'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="mb-6 p-6">
        <h2 className="font-display text-lg text-ink">{t('profile.preferences') || 'Preferences'}</h2>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-line p-4">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-primary" />
              <div>
                <p className="font-medium text-ink">{t('profile.notifications') || 'Email Notifications'}</p>
                <p className="text-xs text-ink-soft">{t('profile.notificationsSub') || 'Updates about orders'}</p>
              </div>
            </div>
            <div className={cn('h-6 w-10 rounded-full', profile.preferences?.notifications ? 'bg-nature' : 'bg-muted')} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-line p-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-primary" />
              <div>
                <p className="font-medium text-ink">{t('profile.newsletter') || 'Newsletter'}</p>
                <p className="text-xs text-ink-soft">{t('profile.newsletterSub') || 'Weekly updates'}</p>
              </div>
            </div>
            <div className={cn('h-6 w-10 rounded-full', profile.preferences?.newsletter ? 'bg-nature' : 'bg-muted')} />
          </div>
        </div>

        <div className="mt-4 text-right">
          <Link to="/customer/profile/edit" className="text-sm font-medium text-primary">
            {t('common.edit')} →
          </Link>
        </div>
      </Card>

      {/* Addresses */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">{t('profile.addresses') || 'Addresses'}</h2>
          <Link to="/customer/addresses/new">
            <Button size="sm" variant="secondary">
              {t('profile.addAddress') || 'Add Address'}
            </Button>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-cream p-8 text-center">
            <MapPin size={32} className="mx-auto text-muted" />
            <p className="mt-2 text-sm text-ink-soft">{t('profile.noAddresses') || 'No addresses saved'}</p>
            <Link to="/customer/addresses/new" className="mt-3 inline-block text-sm font-medium text-primary">
              {t('profile.addFirst') || 'Add your first address'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, idx) => (
              <div key={idx} className="rounded-lg border border-line p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {addr.label && (
                      <div className="inline-block rounded-full bg-primary-soft px-2 py-1 text-xs font-medium text-primary mb-2">
                        {addr.label}
                      </div>
                    )}
                    <p className="font-medium text-ink">{addr.street}</p>
                    <p className="text-sm text-ink-soft">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-xs text-muted">{addr.country}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/customer/addresses/${idx}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-3">
        <Link to="/account">
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>
    </div>
  );
}
