import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import { BookOpen } from 'lucide-react';

export default function Classes() {
  return (
    <PlaceholderPage
      title="Classes"
      description="Manage your classes and subjects here"
      icon={<BookOpen className="h-6 w-6 text-blue-600" />}
    />
  );
}
