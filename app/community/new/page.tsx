"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bold, Italic, Code, LinkIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [body, setBody] = useState("")

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "," || e.key === "Enter") && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/,+$/, "").toLowerCase()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput("")
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="size-4" />
          Back to Community
        </Link>

        <div className="border rounded-lg bg-card p-6">
          <h1 className="font-serif text-2xl font-bold tracking-tight mb-6">Create a New Post</h1>

          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Title
              </label>
              <Input
                id="title"
                placeholder="What's your post about?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="help">Help & Support</SelectItem>
                  <SelectItem value="show-tell">Show & Tell</SelectItem>
                  <SelectItem value="feature-request">Feature Request</SelectItem>
                  <SelectItem value="bug-report">Bug Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1.5">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-1.5 border rounded-md px-3 py-2 bg-transparent focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] dark:bg-input/30">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  id="tags"
                  type="text"
                  placeholder={tags.length === 0 ? "Add tags (comma separated)" : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground py-0.5"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Press comma or enter to add a tag
              </p>
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium mb-1.5">
                Body
              </label>
              <div className="flex items-center gap-1 mb-2 border rounded-md p-1 w-fit bg-muted/50">
                <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Bold">
                  <Bold className="size-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Italic">
                  <Italic className="size-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Code Block">
                  <Code className="size-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Link">
                  <LinkIcon className="size-4 text-muted-foreground" />
                </button>
              </div>
              <Textarea
                id="body"
                placeholder="Write your post... Markdown is supported"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-64"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                disabled={!title.trim() || !category || !body.trim()}
                onClick={() => {
                  toast.success("Post created", {
                    description: "Your post has been published to the community.",
                  })
                }}
              >
                Post
              </Button>
              <Link href="/community">
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
