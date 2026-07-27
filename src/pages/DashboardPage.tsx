import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mic, Search, Plus, Sparkles, ArrowUpRight, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="Overview of your voice recorded expenses and financial activity"
      badge="Foundation Demo"
      actionSlot={
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
          New Record
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Component Showcase Banner */}
        <Card accentBorder hoverable>
          <CardHeader>
            <div className="flex items-center gap-2 text-[#3B82F6]">
              <Sparkles className="w-5 h-5" />
              <CardTitle>VoiceLedger UI Foundation</CardTitle>
            </div>
            <CardDescription>
              Reusable UI layout & components configured with Light & Dark theme support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-[#9CA3AF]">
              Try clicking the sun/moon toggle in the top navbar to switch between Light and Dark themes!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Voice Search Simulation"
                placeholder="Type or simulate voice input..."
                leftIcon={<Mic className="w-4 h-4 text-[#3B82F6]" />}
                rightIcon={<Search className="w-4 h-4 cursor-pointer hover:text-slate-900 dark:hover:text-white" />}
              />
              <Input
                label="Quick Category Filter"
                placeholder="e.g., Food, Travel, Subscriptions..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <span className="flex items-center gap-1.5 text-xs text-[#3B82F6]">
              <TrendingUp className="w-3.5 h-3.5" /> Ready for Phase 2 Integration
            </span>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              View Details
            </Button>
          </CardFooter>
        </Card>

        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card hoverable>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Placeholder card for transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-slate-400 dark:text-[#6B7280] border border-dashed border-slate-200 dark:border-[#222934] rounded-xl">
                No mock transactions loaded
              </div>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardHeader>
              <CardTitle>Voice Logs</CardTitle>
              <CardDescription>Placeholder card for voice transcriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-slate-400 dark:text-[#6B7280] border border-dashed border-slate-200 dark:border-[#222934] rounded-xl">
                Voice engine standby
              </div>
            </CardContent>
          </Card>

          <Card hoverable className="sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
              <CardDescription>Placeholder card for monthly balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-slate-400 dark:text-[#6B7280] border border-dashed border-slate-200 dark:border-[#222934] rounded-xl">
                Budget tracking ready
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
