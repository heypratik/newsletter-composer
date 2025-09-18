"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNewsletter } from "@/hooks/useNewsletter";
import { render } from "@react-email/render";
import Template1 from "@/components/email/templates/Template1";
import Template2 from "@/components/email/templates/Template2";
import Template3 from "@/components/email/templates/Template3";

interface TemplateSelectorProps {
  onSelect: (templateId: 1 | 2 | 3) => void;
  onCancel: () => void;
}

export function TemplateSelector({
  onSelect,
  onCancel,
}: TemplateSelectorProps) {
  const { createNewNewsletter } = useNewsletter();
  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3 | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [previewHtmls, setPreviewHtmls] = useState<{ [key: number]: string }>(
    {}
  );

  const previewNewsletters = useMemo(
    () => ({
      1: createNewNewsletter(1),
      2: createNewNewsletter(2),
      3: createNewNewsletter(3),
    }),
    [createNewNewsletter]
  );

  useEffect(() => {
    let isCancelled = false;

    const generatePreviews = async () => {
      const htmls: { [key: number]: string } = {};

      try {
        if (!isCancelled) {
          htmls[1] = await render(
            <Template1 newsletter={previewNewsletters[1]} />
          );
        }
        if (!isCancelled) {
          htmls[2] = await render(
            <Template2 newsletter={previewNewsletters[2]} />
          );
        }
        if (!isCancelled) {
          htmls[3] = await render(
            <Template3 newsletter={previewNewsletters[3]} />
          );
        }

        if (!isCancelled) {
          setPreviewHtmls(htmls);
        }
      } catch (error) {
        console.error("Error generating template previews:", error);
        if (!isCancelled) {
          setPreviewHtmls({
            1: '<div style="padding: 20px; text-align: center;">Preview unavailable</div>',
            2: '<div style="padding: 20px; text-align: center;">Preview unavailable</div>',
            3: '<div style="padding: 20px; text-align: center;">Preview unavailable</div>',
          });
        }
      }
    };

    if (
      previewNewsletters[1] &&
      previewNewsletters[2] &&
      previewNewsletters[3]
    ) {
      const timeoutId = setTimeout(() => {
        if (!isCancelled) {
          generatePreviews();
        }
      }, 100);

      return () => {
        isCancelled = true;
        clearTimeout(timeoutId);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [previewNewsletters]);

  const templates = [
    {
      id: 1 as const,
      name: "Classic Newsletter",
      description:
        "Traditional newsletter layout with header, image, content, and footer",
      features: [
        "Header with title & subtitle",
        "Hero image",
        "Rich text content",
        "Footer with links",
      ],
    },
    {
      id: 2 as const,
      name: "Marketing Newsletter",
      description: "Perfect for promotions and marketing campaigns",
      features: [
        "Hero image",
        "Compelling header",
        "Rich content",
        "Email signup CTA",
        "Footer",
      ],
    },
    {
      id: 3 as const,
      name: "Simple Newsletter",
      description: "Clean and minimal design for focused messaging",
      features: [
        "Simple header",
        "Content section",
        "Call-to-action button",
        "Social links",
        "Footer",
      ],
    },
  ];

  const renderTemplatePreview = (templateId: 1 | 2 | 3) => {
    const previewHtml = previewHtmls[templateId];

    if (!previewHtml) {
      return (
        <div className="w-full h-[600px] flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="w-full h-[600px] overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 relative">
        <div
          className="w-full flex justify-center pt-4"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="bg-white shadow-sm"
            style={{
              width: "400px",
              transform: "scale(0.90)",
              transformOrigin: "top center",
              marginBottom: "20px",
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    );
  };

  const handleTemplateClick = (templateId: 1 | 2 | 3) => {
    setSelectedTemplate(templateId);
  };

  const handleNext = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSelect(selectedTemplate);
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose a Template
          </h2>
          <p className="text-gray-600">
            Select a newsletter template to get started with your design.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleTemplateClick(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 z-20 bg-blue-500 text-white rounded-full p-2 shadow-lg">
                  <Check className="h-5 w-5" />
                </div>
              )}

              {/* Live template preview */}
              {renderTemplatePreview(template.id)}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isCreating}
            size="lg"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedTemplate || isCreating}
            size="lg"
          >
            {isCreating ? "Creating..." : "Next: Start Editing"}
          </Button>
        </div>

        {selectedTemplate && !isCreating && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Selected:{" "}
              <span className="font-medium">
                {templates.find((t) => t.id === selectedTemplate)?.name}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
