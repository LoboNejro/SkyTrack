import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import { Users } from 'lucide-react';

export default function Contacts() {
  return (
    <PlaceholderPage
      title="Contacts"
      description="Manage your academic contacts and connections"
      icon={<Users className="h-6 w-6 text-orange-600" />}
    />
  );
}
