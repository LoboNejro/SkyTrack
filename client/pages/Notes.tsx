import React from "react";
import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function Notes() {
  return (
    <PlaceholderPage
      title="Notes"
      description="Create and organize your study notes"
      icon={<FileText className="h-6 w-6 text-purple-600" />}
    />
  );
}
