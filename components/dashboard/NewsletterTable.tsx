"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Eye, Edit, Copy, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/types/newsletter";

interface NewsletterTableProps {
  newsletters: Newsletter[];
  onPreview: (newsletter: Newsletter) => void;
  onEdit: (newsletter: Newsletter) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NewsletterTable({
  newsletters,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
}: NewsletterTableProps) {
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

  if (newsletters.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No newsletters yet
        </h3>
        <p className="text-gray-500">
          Create your first newsletter to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-300">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsletters.map((newsletter) => (
            <TableRow
              key={newsletter.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onPreview(newsletter)}
            >
              <TableCell className="font-medium">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {newsletter.subject}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(newsletter.status)}</TableCell>
              <TableCell className="text-sm text-gray-900">
                {getTemplateName(newsletter.templateId)}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {format(new Date(newsletter.updatedAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {newsletter.scheduledDate
                  ? format(new Date(newsletter.scheduledDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div
                  className="flex justify-end space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(newsletter)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(newsletter)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicate(newsletter.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(newsletter.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
