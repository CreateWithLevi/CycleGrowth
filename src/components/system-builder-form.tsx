"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";

export default function SystemBuilderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "professional",
  });

  const router = useRouter();
  const supabase = createClient();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the relative function path from the file path
      const relativeFunctionFilePath =
        "supabase/functions/create-growth-system/index.ts";
      // Convert the path to a slug format that Supabase expects
      const slug = relativeFunctionFilePath
        .replace("/index.ts", "")
        .replace(/\//g, "-") // Replace all forward slashes with hyphens
        .replace(/[^A-Za-z0-9_-]/g, ""); // Remove any characters that aren't alphanumeric, underscore, or hyphen

      console.log("Invoking function with slug:", slug);
      const response = await supabase.functions.invoke(slug, {
        body: formData,
      });

      console.log("Function response:", response);

      if (response.error) {
        throw new Error(
          response.error.message || "Failed to create growth system",
        );
      }

      if (!response.data) {
        throw new Error("No data returned from function");
      }

      // Redirect to the dashboard or the new system page
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating growth system:", err);
      setError(err.message || "Failed to create growth system");
    } finally {
      setIsSubmitting(false);
    }
  };

  const domains = [
    { value: "professional", label: "Professional Skills" },
    { value: "personal", label: "Personal Development" },
    { value: "health", label: "Health & Fitness" },
    { value: "learning", label: "Learning & Education" },
    { value: "creative", label: "Creative Projects" },
    { value: "business", label: "Business Growth" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">System Name</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Professional Skill Development"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what you want to achieve with this growth system..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <select
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          {domains.map((domain) => (
            <option key={domain.value} value={domain.value}>
              {domain.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Growth System"}
      </Button>
    </form>
  );
}
