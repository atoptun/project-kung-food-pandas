import { Navigate, useParams } from 'react-router';

import UserProfileView from '@/components/profile/user-profile-view/user-profile-view';
import Loader from '@/components/shared/loader/loader';
import { useAuth } from '@/hooks/use-auth';

export default function UserProfilePage() {
  const { id = '', tab } = useParams<{ id: string; tab?: string }>();
  const { user, isPending } = useAuth();

  if (isPending) {
    return <Loader size="lg" fullscreen label="Loading profile…" />;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ authModal: 'sign-in' }} />;
  }

  return <UserProfileView key={`${user.id}:${id}`} id={id} initialTab={tab} viewerId={user.id} />;
}
