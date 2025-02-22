"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";

export default function EditButton() {
  const params = useParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarExpand = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={handleSidebarExpand} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <div className="flex-1 relative">
          <PageHeader title="Edit Verification Button" description="Modify your verification button settings" />

          <div className="container mx-auto px-6 py-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Button name</label>
                    <Input placeholder="Enter button name" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Verification category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="address">Address</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sub category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="download">Download</SelectItem>
                        <SelectItem value="upload">Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Allow resubmission with same track ID</label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Allow multi-download</label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Live feedback</label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Image Upload</label>
                      <Switch />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
