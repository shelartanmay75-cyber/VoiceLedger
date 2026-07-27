import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const ProfilePage: React.FC = () => {
  return (
    <PageContainer
      title="User Profile"
      subtitle="Manage your personal information, subscription plan, and security settings"
    >
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Placeholder page for profile management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Profile details placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
