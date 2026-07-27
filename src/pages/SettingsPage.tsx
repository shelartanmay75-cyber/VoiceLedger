import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const SettingsPage: React.FC = () => {
  return (
    <PageContainer
      title="Settings"
      subtitle="Configure application preferences, notifications, and voice engine settings"
    >
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Placeholder page for app preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Settings manager placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
