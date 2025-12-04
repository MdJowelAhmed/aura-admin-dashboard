"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Eye, FileText } from "lucide-react";
import { TiptapEditor } from "@/components/share/TiptapEditor";
import {
  useGetAllGuidelinesQuery,
  useCreateGuidelineMutation,
  useUpdateGuidelineStatusMutation,
} from "@/lib/store/guidlines/guidelinesApi";

const CommunityGuidelinesEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [guidelineId, setGuidelineId] = useState<string | null>(null);

  // API hooks
  const { data: guidelinesData, isLoading: isFetching } = useGetAllGuidelinesQuery();
  const [createGuideline, { isLoading: isCreating }] = useCreateGuidelineMutation();
  const [updateGuideline, { isLoading: isUpdating }] = useUpdateGuidelineStatusMutation();

  // Load existing guidelines
  useEffect(() => {
    if (guidelinesData?.data) {
      setContent(guidelinesData.data.content || "");
      setGuidelineId(guidelinesData.data._id || null);
    }
  }, [guidelinesData]);

  const handleSave = async (): Promise<void> => {
    try {
      if (guidelineId) {
        // Update existing guideline
        await updateGuideline({
          id: guidelineId,
           content,
        }).unwrap();
        alert("Guidelines updated successfully!");
      } else {
        // Create new guideline
        const response = await createGuideline(content ).unwrap();
        setGuidelineId(response.data._id);
        alert("Guidelines created successfully!");
      }
    } catch (error) {
      console.error("Error saving guidelines:", error);
      alert("Error saving guidelines. Please try again.");
    }
  };

  const getWordCount = (html: string): number => {
    const text = html.replace(/<[^>]*>/g, "");
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharCount = (html: string): number => {
    return html.replace(/<[^>]*>/g, "").length;
  };

  const isLoading = isCreating || isUpdating;

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading guidelines...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-semibold text-white">
                Community Guidelines Editor
              </h1>
            </div>
            <p className="text-white/70">
              Create and format your community guidelines with our modern rich text editor
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPreview(false)}
                variant={!showPreview ? "default" : "ghost"}
                className={`px-4 py-2 rounded-lg transition-all ${
                  !showPreview
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setShowPreview(true)}
                variant={showPreview ? "default" : "ghost"}
                disabled={!content.trim()}
                className={`px-4 py-2 rounded-lg transition-all ${
                  showPreview
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Editor Container */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
            {showPreview ? (
              <div className="p-8">
                <div className="bg-white/10 rounded-lg p-6 min-h-[500px]">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </h3>
                  {content ? (
                    <div
                      className="text-white leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <FileText className="w-16 h-16 text-white/20 mb-4" />
                      <p className="text-white/50 text-lg">No content to preview</p>
                      <p className="text-white/30 text-sm mt-2">
                        Switch to edit mode to start writing
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your community guidelines here... Use the toolbar above to format your content with headings, lists, links, and more!"
              />
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex justify-between items-center mt-6 p-4 bg-white/5 rounded-lg">
            <div className="flex gap-6 text-sm text-white/60">
              <span>
                Characters:{" "}
                <span className="text-white/80 font-medium">{getCharCount(content)}</span>
              </span>
              <span>
                Words:{" "}
                <span className="text-white/80 font-medium">{getWordCount(content)}</span>
              </span>
              <span>
                Status:{" "}
                <span
                  className={`font-medium ${
                    content.trim() ? "text-green-400" : "text-orange-400"
                  }`}
                >
                  {content.trim() ? "Draft Ready" : "Empty"}
                </span>
              </span>
            </div>

            <Button
              onClick={handleSave}
              disabled={!content.trim() || isLoading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                !content.trim() || isLoading
                  ? "bg-white/20 text-white/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {guidelineId ? "Update Guidelines" : "Save Guidelines"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelinesEditor;