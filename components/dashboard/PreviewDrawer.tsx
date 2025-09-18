"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Edit, Copy, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/types/newsletter";
import { render } from "@react-email/render";
import Template1 from "@/components/email/templates/Template1";
import Template2 from "@/components/email/templates/Template2";
import Template3 from "@/components/email/templates/Template3";

interface PreviewDrawerProps {
  newsletter: Newsletter | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (newsletter: Newsletter) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PreviewDrawer({
  newsletter,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
}: PreviewDrawerProps) {
  const [previewHtml, setPreviewHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getTemplateName = (templateId: 1 | 2 | 3) => {
    switch (templateId) {
      case 1:
        return "Classic Newsletter";
      case 2:
        return "Marketing Newsletter";
      case 3:
        return "Simple Newsletter";
      default:
        return "Unknown";
    }
  };

  const getStatusBadge = (status: "draft" | "scheduled") => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === "draft"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {status === "draft" ? "Draft" : "Scheduled"}
      </span>
    );
  };

  useEffect(() => {
    if (!newsletter || !isOpen) return;

    const generatePreview = async () => {
      setIsLoading(true);
      try {
        let html = "";
        switch (newsletter.templateId) {
          case 1:
            html = await render(<Template1 newsletter={newsletter} />);
            break;
          case 2:
            html = await render(<Template2 newsletter={newsletter} />);
            break;
          case 3:
            html = await render(<Template3 newsletter={newsletter} />);
            break;
        }
        setPreviewHtml(html);
      } catch (error) {
        console.error("Error generating preview:", error);
        setPreviewHtml(
          '<div style="padding: 20px; text-align: center;">Error generating preview</div>'
        );
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [newsletter, isOpen]);

  if (!newsletter) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger style={{ display: "none" }} />
      <SheetContent className="w-[650px] max-w-[90vw] flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-semibold">
                {newsletter.subject}
              </SheetTitle>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{getTemplateName(newsletter.templateId)}</span>
                {getStatusBadge(newsletter.status)}
                {newsletter.scheduledDate && (
                  <>
                    <span>
                      Scheduled:{" "}
                      {format(
                        new Date(newsletter.scheduledDate),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              onClick={() => onEdit(newsletter)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onDuplicate(newsletter.id)}
              className="flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Duplicate</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onDelete(newsletter.id);
                onClose();
              }}
              className="flex items-center space-x-2 text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto bg-gray-100 p-6 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              <div
                className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden"
                style={{ maxWidth: "600px", margin: "0 auto" }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
