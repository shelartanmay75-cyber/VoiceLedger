import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const GoalsPage: React.FC = () => {
  return (
    <PageContainer
      title="Savings Goals"
      subtitle="Track progress towards your savings targets and financial milestones"
    >
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
          <CardDescription>Placeholder page for savings goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Goals tracker placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
