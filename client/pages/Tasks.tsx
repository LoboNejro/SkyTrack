import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import { CheckSquare } from 'lucide-react';

export default function Tasks() {
  return (
    <PlaceholderPage
      title="Tasks"
      description="Track and manage your assignments and to-dos"
      icon={<CheckSquare className="h-6 w-6 text-green-600" />}
    />
  );
}
