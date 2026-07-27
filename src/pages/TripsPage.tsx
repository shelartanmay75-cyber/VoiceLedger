import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const TripsPage: React.FC = () => {
  return (
    <PageContainer
      title="Trips & Travel"
      subtitle="Organize travel expenses and multi-currency trip budgets"
      badge="New"
    >
      <Card>
        <CardHeader>
          <CardTitle>Travel Expenses</CardTitle>
          <CardDescription>Placeholder page for managing trip budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Trips manager placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
