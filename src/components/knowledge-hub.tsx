"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Search,
  Plus,
  Lightbulb,
  Link as LinkIcon,
  Tag,
  X,
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  connections: string[];
  createdAt: string;
  source?: string;
}

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [""],
    connections: [],
  });

  // Sample knowledge items
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "Effective Public Speaking Techniques",
      content:
        "Research shows that the most effective public speakers use a combination of storytelling, pauses for emphasis, and varied vocal tones to engage their audience.",
      tags: ["communication", "public speaking", "leadership"],
      connections: ["2"],
      createdAt: "2023-06-20T14:30:00Z",
      source: "Professional Skill Development cycle",
    },
    {
      id: "2",
      title: "Active Listening Framework",
      content:
        "Active listening involves five key steps: paying attention, showing that you're listening, providing feedback, deferring judgment, and responding appropriately.",
      tags: ["communication", "listening", "interpersonal"],
      connections: ["1"],
      createdAt: "2023-06-25T09:15:00Z",
      source: "Professional Skill Development cycle",
    },
    {
      id: "3",
      title: "Growth Mindset Principles",
      content:
        "A growth mindset, coined by Carol Dweck, is the belief that abilities can be developed through dedication and hard work. This view creates a love of learning and resilience essential for achievement.",
      tags: ["mindset", "psychology", "learning"],
      connections: [],
      createdAt: "2023-07-02T11:45:00Z",
      source: "Learning Spanish cycle",
    },
  ]);

  // All unique tags from knowledge items
  const allTags = Array.from(
    new Set(knowledgeItems.flatMap((item) => item.tags)),
  );

  // Filter knowledge items based on search and tags
  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => item.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Handle adding a new tag to the new note
  const handleAddTag = () => {
    setNewNote({
      ...newNote,
      tags: [...newNote.tags, ""],
    });
  };

  // Handle removing a tag from the new note
  const handleRemoveTag = (index: number) => {
    const newTags = [...newNote.tags];
    newTags.splice(index, 1);
    setNewNote({
      ...newNote,
      tags: newTags,
    });
  };

  // Handle changing a tag in the new note
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...newNote.tags];
    newTags[index] = value;
    setNewNote({
      ...newNote,
      tags: newTags,
    });
  };

  // Handle saving a new note
  const handleSaveNote = () => {
    const newItem: KnowledgeItem = {
      id: (knowledgeItems.length + 1).toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.filter((tag) => tag.trim() !== ""),
      connections: newNote.connections,
      createdAt: new Date().toISOString(),
    };

    setKnowledgeItems([...knowledgeItems, newItem]);
    setNewNote({
      title: "",
      content: "",
      tags: [""],
      connections: [],
    });
    setActiveTab("browse");
  };

  // Toggle tag selection for filtering
  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Knowledge Integration Hub</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Browse Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Note</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search knowledge..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveTab("create")}
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" /> New Note
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTagSelection(tag)}
                  className={selectedTags.includes(tag) ? "bg-purple-600" : ""}
                >
                  {tag}
                </Button>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{item.content}</p>

                    {item.source && (
                      <div className="text-xs text-gray-500 mb-3">
                        Source: {item.source}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.connections.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <LinkIcon className="h-4 w-4" />
                        <span>
                          {item.connections.length} connection
                          {item.connections.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 border border-dashed rounded-lg text-center">
                  <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No knowledge items found. Try adjusting your search or
                    create a new note.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  placeholder="What did you learn?"
                  rows={6}
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </Label>

                {newNote.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Enter a tag"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="flex-1"
                      list="available-tags"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTag(index)}
                      disabled={newNote.tags.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <datalist id="available-tags">
                  {allTags.map((tag) => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Tag
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" /> Connections
                </Label>

                <select
                  multiple
                  className="w-full p-2 border rounded-md h-32"
                  value={newNote.connections}
                  onChange={(e) => {
                    const options = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value,
                    );
                    setNewNote({ ...newNote, connections: options });
                  }}
                >
                  {knowledgeItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple items
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setActiveTab("browse")}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={!newNote.title || !newNote.content}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Save Note
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
