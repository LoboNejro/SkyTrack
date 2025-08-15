import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  return (
    <PlaceholderPage
      title="Calendar"
      description="View and manage your schedule and events"
      icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
    />
  );
}
