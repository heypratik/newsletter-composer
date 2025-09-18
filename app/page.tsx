"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterTable } from "@/components/dashboard/NewsletterTable";
import { PreviewDrawer } from "@/components/dashboard/PreviewDrawer";
import { TemplateSelector } from "@/components/dashboard/TemplateSelector";
import { useNewsletter } from "@/hooks/useNewsletter";
import { Newsletter } from "@/types/newsletter";

export default function Dashboard() {
  const router = useRouter();
  const {
    newsletters,
    createNewNewsletter,
    duplicateNewsletter,
    deleteNewsletter,
    setCurrentNewsletter,
  } = useNewsletter();

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleCreateNewsletter = () => {
    setShowTemplateSelector(true);
  };

  const handleTemplateSelect = async (templateId: 1 | 2 | 3) => {
    const newNewsletter = createNewNewsletter(templateId);
    setCurrentNewsletter(newNewsletter);

    router.replace("/editor");
  };

  const handlePreview = (newsletter: Newsletter) => {
    setPreviewNewsletter(newsletter);
    setIsPreviewOpen(true);
  };

  const handleEdit = (newsletter: Newsletter) => {
    setCurrentNewsletter(newsletter);
    router.push("/editor");
  };

  const handleDuplicate = (id: string) => {
    duplicateNewsletter(id);
  };

  const handleDelete = (id: string) => {
    deleteNewsletter(id);
  };

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        onSelect={handleTemplateSelect}
        onCancel={() => setShowTemplateSelector(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Newsletter Composer
              </h1>
              <p className="mt-2 text-gray-600">
                Create, manage, and schedule your email newsletters
              </p>
            </div>
            <Button
              onClick={handleCreateNewsletter}
              size="lg"
              variant="default"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Newsletter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {newsletters.length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-base font-semibold text-gray-900">
                  Total Newsletters
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-gray-300 border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {newsletters.filter((n) => n.status === "draft").length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-base font-semibold text-gray-900">
                  Drafts
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-gray-300 border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {newsletters.filter((n) => n.status === "scheduled").length}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-base font-semibold text-gray-900">
                  Scheduled
                </div>
              </div>
            </div>
          </div>
        </div>

        <NewsletterTable
          newsletters={newsletters}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />

        <PreviewDrawer
          newsletter={previewNewsletter}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
