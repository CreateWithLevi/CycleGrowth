"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Lightbulb, Link as LinkIcon, Plus, Save, Tag, X } from "lucide-react";

interface ReflectionEntry {
  id: string;
  date: string;
  content: string;
  insights: string[];
  tags: string[];
  cyclePhase: string;
  domain: string;
}

export default function ReflectionTool() {
  const [activeTab, setActiveTab] = useState("new");
  const [newReflection, setNewReflection] = useState<Partial<ReflectionEntry>>({
    content: "",
    insights: [""],
    tags: [],
    cyclePhase: "planning",
    domain: "professional",
  });
  const [newTag, setNewTag] = useState("");

  // Sample reflection entries
  const [reflections, setReflections] = useState<ReflectionEntry[]>([
    {
      id: "1",
      date: "2023-10-10",
      content:
        "Today I practiced my presentation skills by delivering a mock presentation to my colleague. I noticed that I tend to speak too quickly when I'm nervous, and I need to work on maintaining eye contact with the audience.",
      insights: [
        "Speaking pace affects audience comprehension",
        "Eye contact builds trust and engagement",
        "Preparation reduces nervousness",
      ],
      tags: ["presentation", "communication", "feedback"],
      cyclePhase: "execution",
      domain: "professional",
    },
    {
      id: "2",
      date: "2023-10-05",
      content:
        "I've been researching different leadership styles and realized that I naturally lean toward a democratic approach. I value input from others and believe in collaborative decision-making, but I need to be more decisive in time-sensitive situations.",
      insights: [
        "Different leadership styles suit different situations",
        "Balance between collaboration and decisiveness is key",
        "Self-awareness of natural tendencies helps adaptation",
      ],
      tags: ["leadership", "research", "self-awareness"],
      cyclePhase: "planning",
      domain: "professional",
    },
  ]);

  const handleAddInsight = () => {
    setNewReflection({
      ...newReflection,
      insights: [...(newReflection.insights || []), ""],
    });
  };

  const handleRemoveInsight = (index: number) => {
    const newInsights = [...(newReflection.insights || [])];
    newInsights.splice(index, 1);
    setNewReflection({
      ...newReflection,
      insights: newInsights,
    });
  };

  const handleInsightChange = (index: number, value: string) => {
    const newInsights = [...(newReflection.insights || [])];
    newInsights[index] = value;
    setNewReflection({
      ...newReflection,
      insights: newInsights,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newReflection.tags?.includes(newTag.trim())) {
      setNewReflection({
        ...newReflection,
        tags: [...(newReflection.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewReflection({
      ...newReflection,
      tags: newReflection.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleSaveReflection = () => {
    if (!newReflection.content) return;

    const reflection: ReflectionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      content: newReflection.content || "",
      insights: newReflection.insights?.filter((i) => i.trim() !== "") || [],
      tags: newReflection.tags || [],
      cyclePhase: newReflection.cyclePhase || "planning",
      domain: newReflection.domain || "professional",
    };

    setReflections([reflection, ...reflections]);
    setNewReflection({
      content: "",
      insights: [""],
      tags: [],
      cyclePhase: "planning",
      domain: "professional",
    });
    setActiveTab("history");
  };

  // Reflection prompts based on cycle phase
  const reflectionPrompts = {
    planning: [
      "What specific skills or areas do you want to develop in this cycle?",
      "What resources or support will you need to achieve your goals?",
      "How will you measure success in this growth cycle?",
      "What potential obstacles might you face, and how can you prepare for them?",
    ],
    execution: [
      "What progress have you made toward your goals so far?",
      "What challenges are you encountering in the implementation phase?",
      "How effective are your current strategies and approaches?",
      "What adjustments might you need to make to your plan?",
    ],
    analysis: [
      "What patterns or trends do you notice in your performance data?",
      "What worked well in this cycle, and what didn't work as expected?",
      "What unexpected insights or learnings have emerged?",
      "How does this experience connect to previous growth cycles or other domains?",
    ],
    improvement: [
      "Based on your analysis, what specific changes will you make to your approach?",
      "How will you incorporate your new insights into your next cycle?",
      "What new goals or focus areas have emerged from this cycle?",
      "How has your understanding of this domain evolved through this cycle?",
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reflection & Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="new">New Reflection</TabsTrigger>
            <TabsTrigger value="history">Reflection History</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cycle-phase">Cycle Phase</Label>
                  <select
                    id="cycle-phase"
                    className="w-full p-2 border rounded-md"
                    value={newReflection.cyclePhase}
                    onChange={(e) =>
                      setNewReflection({
                        ...newReflection,
                        cyclePhase: e.target.value,
                      })
                    }
                  >
                    <option value="planning">Planning</option>
                    <option value="execution">Execution</option>
                    <option value="analysis">Analysis</option>
                    <option value="improvement">Improvement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <select
                    id="domain"
                    className="w-full p-2 border rounded-md"
                    value={newReflection.domain}
                    onChange={(e) =>
                      setNewReflection({
                        ...newReflection,
                        domain: e.target.value,
                      })
                    }
                  >
                    <option value="professional">Professional Skills</option>
                    <option value="personal">Personal Development</option>
                    <option value="health">Health & Fitness</option>
                    <option value="learning">Learning & Education</option>
                    <option value="creative">Creative Projects</option>
                  </select>
                </div>
              </div>

              {/* Reflection Prompts */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Reflection Prompts
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  {reflectionPrompts[
                    newReflection.cyclePhase as keyof typeof reflectionPrompts
                  ]?.map((prompt, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500">•</span> {prompt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reflection-content">Reflection</Label>
                <textarea
                  id="reflection-content"
                  className="w-full min-h-[150px] p-2 border rounded-md"
                  placeholder="Write your reflection here..."
                  value={newReflection.content}
                  onChange={(e) =>
                    setNewReflection({
                      ...newReflection,
                      content: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Key Insights
                </Label>
                <p className="text-sm text-gray-500 mb-2">
                  Extract the most important learnings from your reflection
                </p>

                {newReflection.insights?.map((insight, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder={`Insight ${index + 1}`}
                      value={insight}
                      onChange={(e) =>
                        handleInsightChange(index, e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInsight(index)}
                      disabled={newReflection.insights?.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddInsight}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Insight
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {newReflection.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveReflection}
                  disabled={!newReflection.content}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Reflection
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {reflections.length > 0 ? (
              reflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="p-6 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(reflection.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full capitalize">
                        {reflection.cyclePhase} Phase
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">
                        {reflection.domain}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{reflection.content}</p>

                  {reflection.insights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" /> Key
                        Insights
                      </h4>
                      <ul className="space-y-1 pl-6 list-disc">
                        {reflection.insights.map((insight, index) => (
                          <li key={index} className="text-sm">
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {reflection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {reflection.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" /> Add to Knowledge Hub
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No reflections yet. Start capturing your thoughts and
                  insights.
                </p>
                <Button
                  onClick={() => setActiveTab("new")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Reflection
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
