import DashboardLayout from '@/components/DashboardLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
