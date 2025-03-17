"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { createKnowledgeItem, getKnowledgeItems } from "@/lib/api";
import { useToast } from "./ui/use-toast";
import { createClient } from "../../supabase/client";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source?: string;
  created_at: string;
  knowledge_tags: { tag: string }[];
  knowledge_connections: { target_id: string }[];
}

interface ApiError {
  message: string;
}

export default function KnowledgeHubConnected() {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { toast } = useToast();

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: [""],
    connections: [] as string[],
    source: "",
  });

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

  const fetchKnowledgeItems = async () => {
    setIsLoading(true);
    try {
      const { success, data, error } = await getKnowledgeItems();
      if (success && data) {
        setKnowledgeItems(data);

        // Extract all unique tags
        const tags = new Set<string>();
        data.forEach((item) => {
          item.knowledge_tags?.forEach((tagObj: { tag: string }) => {
            tags.add(tagObj.tag);
          });
        });
        setAllTags(Array.from(tags));
      } else {
        console.error("Error fetching knowledge items:", error);
        toast({
          title: "Error",
          description: "Failed to load knowledge items",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching knowledge items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter knowledge items based on search and tags
  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    const itemTags = item.knowledge_tags?.map((t) => t.tag) || [];
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => itemTags.includes(tag));

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
  const handleSaveNote = async () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Try direct database insertion first
      const supabase = createClient();
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Insert the knowledge item
      const { data: knowledgeItem, error: knowledgeError } = await supabase
        .from("knowledge_items")
        .insert({
          user_id: userId,
          title: newNote.title,
          content: newNote.content,
          source: newNote.source || null,
        })
        .select()
        .single();

      if (knowledgeError) {
        console.error("Direct insertion error:", knowledgeError);
        // Fall back to edge function
        const { success, data, error } = await createKnowledgeItem({
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags.filter((tag) => tag.trim() !== ""),
          connections: newNote.connections,
          source: newNote.source || undefined,
        });

        if (!success) {
          throw error || new Error("Failed to create knowledge item");
        }
      } else {
        // Add tags if provided
        if (newNote.tags && newNote.tags.length > 0) {
          const filteredTags = newNote.tags.filter((tag) => tag.trim() !== "");
          if (filteredTags.length > 0) {
            const tagInserts = filteredTags.map((tag) => ({
              knowledge_id: knowledgeItem.id,
              tag,
            }));

            await supabase.from("knowledge_tags").insert(tagInserts);
          }
        }

        // Add connections if provided
        if (newNote.connections && newNote.connections.length > 0) {
          const connectionInserts = newNote.connections.map((targetId) => ({
            source_id: knowledgeItem.id,
            target_id: targetId,
          }));

          await supabase
            .from("knowledge_connections")
            .insert(connectionInserts);
        }

        // Create an activity for the new knowledge item
        await supabase.from("growth_activities").insert({
          user_id: userId,
          action: "Created knowledge item",
          item: newNote.title,
          system_id: null,
        });
      }

      toast({
        title: "Success",
        description: "Knowledge item created successfully",
      });
      setNewNote({
        title: "",
        content: "",
        tags: [""],
        connections: [],
        source: "",
      });
      setActiveTab("browse");
      fetchKnowledgeItems();
    } catch (error) {
      console.error("Error creating knowledge item:", error);
      toast({
        title: "Error",
        description:
          (error as ApiError)?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : (
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
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{item.content}</p>

                      {item.source && (
                        <div className="text-xs text-gray-500 mb-3">
                          Source: {item.source}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.knowledge_tags?.map((tagObj) => (
                          <span
                            key={tagObj.tag}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {tagObj.tag}
                          </span>
                        ))}
                      </div>

                      {item.knowledge_connections?.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-purple-600">
                          <LinkIcon className="h-4 w-4" />
                          <span>
                            {item.knowledge_connections.length} connection
                            {item.knowledge_connections.length !== 1 ? "s" : ""}
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
            )}
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
                <Label htmlFor="note-source">Source (Optional)</Label>
                <Input
                  id="note-source"
                  placeholder="Where did you learn this? (e.g., book, course, experience)"
                  value={newNote.source}
                  onChange={(e) =>
                    setNewNote({ ...newNote, source: e.target.value })
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
                disabled={isLoading || !newNote.title || !newNote.content}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Note</>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
