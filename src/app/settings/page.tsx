import { Settings } from 'lucide-react';
import { SettingsForm } from '@/components/forms/settings-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Agrisage',
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your application preferences and default values.
          </p>
        </div>
      </div>
      <SettingsForm />
    </div>
  );
}
