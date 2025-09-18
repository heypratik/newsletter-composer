"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, Trash2, Settings } from "lucide-react";
import {
  Section,
  HeaderContent,
  ImageContent,
  BodyContent,
  CTAContent,
  SignupContent,
  FooterContent,
  SocialContent,
} from "@/types/newsletter";

interface SectionEditorProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SectionEditor({
  section,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: SectionEditorProps) {
  const [showStylePanel, setShowStylePanel] = useState(false);

  const updateContent = (newContent: any) => {
    onUpdate({ ...section, content: newContent });
  };

  const updateStyling = (key: string, value: any) => {
    onUpdate({
      ...section,
      styling: { ...section.styling, [key]: value },
    });
  };

  const renderContentEditor = () => {
    switch (section.type) {
      case "header":
        const headerContent = section.content as HeaderContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={headerContent.title}
                onChange={(e) =>
                  updateContent({ ...headerContent, title: e.target.value })
                }
                placeholder="Newsletter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Input
                value={headerContent.subtitle}
                onChange={(e) =>
                  updateContent({ ...headerContent, subtitle: e.target.value })
                }
                placeholder="Newsletter subtitle"
              />
            </div>
          </div>
        );

      case "image":
        const imageContent = section.content as ImageContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <Input
                value={imageContent.url}
                onChange={(e) =>
                  updateContent({ ...imageContent, url: e.target.value })
                }
                placeholder="https://example.com/imge.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alt Text</label>
              <Input
                value={imageContent.alt}
                onChange={(e) =>
                  updateContent({ ...imageContent, alt: e.target.value })
                }
                placeholder="Image description"
              />
            </div>
          </div>
        );

      case "body":
        const bodyContent = section.content as BodyContent;
        return (
          <div>
            <label className="block text-sm font-medium mb-2">
              Content (Markdown)
            </label>
            <textarea
              value={bodyContent.markdown || ""}
              onChange={(e) =>
                updateContent({ ...bodyContent, markdown: e.target.value })
              }
              placeholder="Enter your newsletter content in **Markdown**...
              Example:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
- List item
- Another item
[Link](https://example.com)"
              className="w-full h-40 p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              rows={8}
            />
            <div className="text-sm text-gray-500 mt-1 space-y-1">
              <p>Use Markdown for rich formatting:</p>
              <p className="text-xs">
                **bold** *italic* # heading [link](url) - list
              </p>
            </div>
          </div>
        );

      case "cta":
        const ctaContent = section.content as CTAContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Button Text
              </label>
              <Input
                value={ctaContent.text}
                onChange={(e) =>
                  updateContent({ ...ctaContent, text: e.target.value })
                }
                placeholder="Call to Action"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Button URL
              </label>
              <Input
                value={ctaContent.url}
                onChange={(e) =>
                  updateContent({ ...ctaContent, url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case "signup":
        const signupContent = section.content as SignupContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={signupContent.heading}
                onChange={(e) =>
                  updateContent({ ...signupContent, heading: e.target.value })
                }
                placeholder="Subscribe Now!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Placeholder Text
              </label>
              <Input
                value={signupContent.placeholder}
                onChange={(e) =>
                  updateContent({
                    ...signupContent,
                    placeholder: e.target.value,
                  })
                }
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Button Text
              </label>
              <Input
                value={signupContent.buttonText}
                onChange={(e) =>
                  updateContent({
                    ...signupContent,
                    buttonText: e.target.value,
                  })
                }
                placeholder="Subscribe"
              />
            </div>
          </div>
        );

      case "footer":
        const footerContent = section.content as FooterContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Copyright Text
              </label>
              <Input
                value={footerContent.copyright}
                onChange={(e) =>
                  updateContent({ ...footerContent, copyright: e.target.value })
                }
                placeholder="© 2024 Your Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Links</label>
              {footerContent.links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...footerContent.links];
                      newLinks[index] = { ...link, text: e.target.value };
                      updateContent({ ...footerContent, links: newLinks });
                    }}
                    placeholder="Link text"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...footerContent.links];
                      newLinks[index] = { ...link, url: e.target.value };
                      updateContent({ ...footerContent, links: newLinks });
                    }}
                    placeholder="URL"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLinks = footerContent.links.filter(
                        (_, i) => i !== index
                      );
                      updateContent({ ...footerContent, links: newLinks });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newLinks = [
                    ...footerContent.links,
                    { text: "", url: "" },
                  ];
                  updateContent({ ...footerContent, links: newLinks });
                }}
              >
                Add Link
              </Button>
            </div>
          </div>
        );

      case "social":
        const socialContent = section.content as SocialContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Facebook URL
              </label>
              <Input
                value={socialContent.facebook || ""}
                onChange={(e) =>
                  updateContent({ ...socialContent, facebook: e.target.value })
                }
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Twitter URL
              </label>
              <Input
                value={socialContent.twitter || ""}
                onChange={(e) =>
                  updateContent({ ...socialContent, twitter: e.target.value })
                }
                placeholder="https://twitter.com/youraccount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Instagram URL
              </label>
              <Input
                value={socialContent.instagram || ""}
                onChange={(e) =>
                  updateContent({ ...socialContent, instagram: e.target.value })
                }
                placeholder="https://instagram.com/youraccount"
              />
            </div>
          </div>
        );

      default:
        return <div>Unknown section type</div>;
    }
  };

  const renderStylePanel = () => {
    if (!showStylePanel) return null;

    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium mb-3">Styling Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <Input
              type="color"
              value={section.styling.textColor || "#333333"}
              onChange={(e) => updateStyling("textColor", e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Background Color
            </label>
            <Input
              type="color"
              value={section.styling.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyling("backgroundColor", e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Font Size</label>
            <Select
              value={section.styling.fontSize || "md"}
              onValueChange={(value) => updateStyling("fontSize", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alignment</label>
            <Select
              value={section.styling.alignment || "center"}
              onValueChange={(value) => updateStyling("alignment", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(section.type === "cta" || section.type === "signup") && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Button Color
                </label>
                <Input
                  type="color"
                  value={section.styling.buttonColor || "#007bff"}
                  onChange={(e) => updateStyling("buttonColor", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Button Radius
                </label>
                <Input
                  type="number"
                  value={section.styling.buttonRadius || 4}
                  onChange={(e) =>
                    updateStyling("buttonRadius", parseInt(e.target.value))
                  }
                  min="0"
                  max="20"
                />
              </div>
            </>
          )}
          {section.type === "image" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Image Radius
              </label>
              <Input
                type="number"
                value={section.styling.imageRadius || 0}
                onChange={(e) =>
                  updateStyling("imageRadius", parseInt(e.target.value))
                }
                min="0"
                max="20"
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <h5 className="font-medium mb-2">Padding (px)</h5>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Top</label>
              <Input
                type="number"
                value={section.styling.paddingTop || 0}
                onChange={(e) =>
                  updateStyling("paddingTop", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Right</label>
              <Input
                type="number"
                value={section.styling.paddingRight || 0}
                onChange={(e) =>
                  updateStyling("paddingRight", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Bottom</label>
              <Input
                type="number"
                value={section.styling.paddingBottom || 0}
                onChange={(e) =>
                  updateStyling("paddingBottom", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Left</label>
              <Input
                type="number"
                value={section.styling.paddingLeft || 0}
                onChange={(e) =>
                  updateStyling("paddingLeft", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="font-medium mb-2">Margin (px)</h5>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Top</label>
              <Input
                type="number"
                value={section.styling.marginTop || 0}
                onChange={(e) =>
                  updateStyling("marginTop", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Right</label>
              <Input
                type="number"
                value={section.styling.marginRight || 0}
                onChange={(e) =>
                  updateStyling("marginRight", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Bottom</label>
              <Input
                type="number"
                value={section.styling.marginBottom || 0}
                onChange={(e) =>
                  updateStyling("marginBottom", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Left</label>
              <Input
                type="number"
                value={section.styling.marginLeft || 0}
                onChange={(e) =>
                  updateStyling("marginLeft", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSectionTitle = () => {
    switch (section.type) {
      case "header":
        return "Header";
      case "image":
        return "Image";
      case "body":
        return "Content";
      case "cta":
        return "Call to Action";
      case "signup":
        return "Email Signup";
      case "footer":
        return "Footer";
      case "social":
        return "Social Links";
      default:
        return "Section";
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{getSectionTitle()}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStylePanel(!showStylePanel)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderContentEditor()}
        {renderStylePanel()}
      </CardContent>
    </Card>
  );
}
