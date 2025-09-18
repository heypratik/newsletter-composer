"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Calendar, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionEditor } from "./SectionEditor";
import { useNewsletter } from "@/hooks/useNewsletter";
import { Newsletter, Section } from "@/types/newsletter";
import { render } from "@react-email/render";
import Template1 from "@/components/email/templates/Template1";
import Template2 from "@/components/email/templates/Template2";
import Template3 from "@/components/email/templates/Template3";

interface NewsletterEditorProps {
  onBack: () => void;
}

export function NewsletterEditor({ onBack }: NewsletterEditorProps) {
  const { currentNewsletter, saveNewsletter } = useNewsletter();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(
    currentNewsletter
  );
  const [previewHtml, setPreviewHtml] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!currentNewsletter);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    if (currentNewsletter && !newsletter) {
      setNewsletter(currentNewsletter);
      setIsLoading(false);
    }
  }, [currentNewsletter, newsletter]);

  useEffect(() => {
    if (newsletter) {
      generatePreview();
      setIsLoading(false);
    }
  }, [newsletter]);

  useEffect(() => {
    if (!newsletter) return;

    const autoSaveInterval = setInterval(() => {
      saveNewsletter(newsletter);
      console.log("Auto-saved at", new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [newsletter, saveNewsletter]);

  const generatePreview = async () => {
    if (!newsletter) return;

    try {
      let html = "";
      switch (newsletter.templateId) {
        case 1:
          html = await render(React.createElement(Template1, { newsletter }));
          break;
        case 2:
          html = await render(React.createElement(Template2, { newsletter }));
          break;
        case 3:
          html = await render(React.createElement(Template3, { newsletter }));
          break;
      }
      setPreviewHtml(html);
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewHtml("<div>Error generating preview</div>");
    }
  };

  const handleSave = async () => {
    if (!newsletter) return;

    setIsSaving(true);
    try {
      saveNewsletter(newsletter);
      // Show success message
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error("Error saving newsletter:", error);
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!newsletter || !scheduledDate) return;

    try {
      const scheduleDateTime = new Date(scheduledDate);
      const updatedNewsletter = {
        ...newsletter,
        status: "scheduled" as const,
        scheduledDate: scheduleDateTime,
        updatedAt: new Date(),
      };
      setNewsletter(updatedNewsletter);
      saveNewsletter(updatedNewsletter);
      setIsScheduleDialogOpen(false);
      setScheduledDate("");
      alert("Newsletter scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling newsletter:", error);
    }
  };

  const updateNewsletter = (updates: Partial<Newsletter>) => {
    if (!newsletter) return;
    setNewsletter({ ...newsletter, ...updates });
  };

  const updateSection = (sectionId: string, updatedSection: Section) => {
    if (!newsletter) return;
    const sections = newsletter.sections.map((section) =>
      section.id === sectionId ? updatedSection : section
    );
    updateNewsletter({ sections });
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    if (!newsletter) return;
    const sections = [...newsletter.sections];
    const currentIndex = sections.findIndex((s) => s.id === sectionId);

    if (direction === "up" && currentIndex > 0) {
      [sections[currentIndex], sections[currentIndex - 1]] = [
        sections[currentIndex - 1],
        sections[currentIndex],
      ];
      sections[currentIndex].order = currentIndex;
      sections[currentIndex - 1].order = currentIndex - 1;
    } else if (direction === "down" && currentIndex < sections.length - 1) {
      [sections[currentIndex], sections[currentIndex + 1]] = [
        sections[currentIndex + 1],
        sections[currentIndex],
      ];
      sections[currentIndex].order = currentIndex;
      sections[currentIndex + 1].order = currentIndex + 1;
    }

    updateNewsletter({ sections });
  };

  const deleteSection = (sectionId: string) => {
    if (!newsletter) return;
    const sections = newsletter.sections.filter((s) => s.id !== sectionId);
    sections.forEach((section, index) => {
      section.order = index;
    });
    updateNewsletter({ sections });
  };

  const addSection = (sectionType: Section["type"]) => {
    if (!newsletter) return;

    const newSection: Section = {
      id: Date.now().toString(),
      type: sectionType,
      order: 0,
      content: getDefaultContentForSectionType(sectionType),
      styling: getDefaultStylingForSectionType(
        sectionType,
        newsletter.templateId
      ),
    };

    const sections = [newSection, ...newsletter.sections];
    updateNewsletter({ sections });
  };

  const getDefaultContentForSectionType = (sectionType: Section["type"]) => {
    switch (sectionType) {
      case "header":
        return { title: "New Header", subtitle: "Add your subtitle here" };
      case "image":
        return {
          url: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
          alt: "Placeholder image",
        };
      case "body":
        return { markdown: "Add your content here..." };
      case "cta":
        return { text: "Click Here", url: "https://example.com" };
      case "signup":
        return {
          heading: "Subscribe to our newsletter",
          placeholder: "Enter your email",
          buttonText: "Subscribe",
        };
      case "social":
        return { facebook: "", twitter: "", instagram: "" };
      case "footer":
        return { copyright: "© 2024 Your Company", links: [] };
      default:
        return {};
    }
  };

  const getDefaultStylingForSectionType = (
    sectionType: Section["type"],
    templateId: number
  ) => {
    const baseStyle = {
      textColor: "#333333",
      backgroundColor: "#ffffff",
      fontSize: "md" as const,
      alignment: "center" as const,
      paddingTop: templateId === 3 ? 24 : 32,
      paddingRight: templateId === 1 ? 0 : 24,
      paddingBottom: templateId === 3 ? 24 : 32,
      paddingLeft: templateId === 1 ? 0 : 24,
      marginTop: 0,
      marginBottom: 0,
    };

    switch (sectionType) {
      case "signup":
        return {
          ...baseStyle,
          backgroundColor: "#f8f9fa",
          buttonColor: "#007bff",
          buttonRadius: 4,
        };
      case "footer":
        return {
          ...baseStyle,
          backgroundColor: templateId === 3 ? "#f8f9fa" : "#ffffff",
        };
      case "cta":
        return { ...baseStyle, buttonColor: "#007bff", buttonRadius: 6 };
      default:
        return baseStyle;
    }
  };

  if (isLoading || !newsletter) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loading Editor...
              </h2>
              <p className="text-gray-900">
                Setting up your newsletter template
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Newsletter Selected
              </h2>
              <p className="text-gray-700 mb-6">
                Please select a newsletter to edit.
              </p>
              <Button onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="bg-secondary border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col lg:flex-row items-start space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-0 lg:p-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Newsletter Editor
                </h1>
                <p className="text-sm text-gray-500">
                  Template {newsletter.templateId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-col lg:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>

              <Dialog
                open={isScheduleDialogOpen}
                onOpenChange={(open) => {
                  setIsScheduleDialogOpen(open);
                  if (open && newsletter?.scheduledDate) {
                    setScheduledDate(
                      new Date(newsletter.scheduledDate)
                        .toISOString()
                        .split("T")[0]
                    );
                  } else if (!open) {
                    setScheduledDate("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    {newsletter?.status === "scheduled"
                      ? "Reschedule"
                      : "Schedule"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Newsletter</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsScheduleDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSchedule}
                        disabled={!scheduledDate}
                      >
                        Schedule
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Newsletter Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <Input
                    value={newsletter.subject}
                    onChange={(e) =>
                      updateNewsletter({ subject: e.target.value })
                    }
                    placeholder="Enter newsletter subject"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Content Sections
                </h3>
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(value) =>
                      addSection(value as Section["type"])
                    }
                  >
                    <SelectTrigger className="w-[150px] bg-white border border-gray-300">
                      <Plus className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Add Section" />
                    </SelectTrigger>
                    <SelectContent className="bg-white cursor-pointer">
                      <SelectItem value="header">Header Section</SelectItem>
                      <SelectItem value="image">Image Section</SelectItem>
                      <SelectItem value="body">Content Section</SelectItem>
                      <SelectItem value="cta">
                        Call-to-Action Section
                      </SelectItem>
                      <SelectItem value="signup">
                        Email Signup Section
                      </SelectItem>
                      <SelectItem value="social">
                        Social Links Section
                      </SelectItem>
                      <SelectItem value="footer">Footer Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {newsletter.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdate={(updatedSection) =>
                      updateSection(section.id, updatedSection)
                    }
                    onMoveUp={() => moveSection(section.id, "up")}
                    onMoveDown={() => moveSection(section.id, "down")}
                    onDelete={() => deleteSection(section.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < newsletter.sections.length - 1}
                  />
                ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
            <div className="bg-white rounded-lg shadow h-full flex flex-col border-gray-300 border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Live Preview
                </h3>
                <p className="text-sm text-gray-500">
                  How your newsletter will look in email clients
                </p>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-lg mx-auto">
                  <div
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    style={{ maxWidth: "600px", margin: "0 auto" }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
