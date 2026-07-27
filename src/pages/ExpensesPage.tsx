import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  return (
    <PageContainer
      title="Expenses"
      subtitle="Manage and review all your recorded expenses"
      actionSlot={
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add Expense
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Expenses List</CardTitle>
          <CardDescription>Placeholder page for managing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-[#6B7280] border border-dashed border-[#222934] rounded-xl">
            Expenses feature placeholder
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
