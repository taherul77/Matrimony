import RealtimeMessagingTest from '@/components/RealtimeMessagingTest';
import { AppProviders } from '@/context/AppProviders';

export default function TestMessagingPage() {
  return (
    <AppProviders>
      <RealtimeMessagingTest />
    </AppProviders>
  );
}