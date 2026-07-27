import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const AnalyticsPage: React.FC = () => {
  return (
    <PageContainer
      title="Analytics"
      subtitle="Financial trends, categorization insights, and spending reports"
    >
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>Placeholder page for financial analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Analytics & charts placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
