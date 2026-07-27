import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const SharedExpensesPage: React.FC = () => {
  return (
    <PageContainer
      title="Shared Expenses"
      subtitle="Split bills, track group balances, and settle up with friends"
    >
      <Card>
        <CardHeader>
          <CardTitle>Group Balances</CardTitle>
          <CardDescription>Placeholder page for shared expense splitting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Shared expenses placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
