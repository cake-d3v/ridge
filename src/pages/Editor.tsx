import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Edit3,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Type,
  Image,
  Link as LinkIcon,
  Trash2,
  Move,
  Save,
  Loader2,
  Eye,
  X,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkAndAwardBadges } from "@/hooks/useBadges";
import ridgeLogo from "@/assets/ridge-logo.png";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_url: string | null;
  theme_color: string | null;
  is_public: boolean;
}

interface ProfileElement {
  id: string;
  profile_id: string;
  element_type: string;
  content: Record<string, unknown>;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  rotation: number | null;
  z_index: number | null;
  styles: Record<string, unknown> | null;
}

type ElementType = "text" | "image" | "link";

const Editor = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [elements, setElements] = useState<ProfileElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addingType, setAddingType] = useState<ElementType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<ProfileElement | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Form states for adding elements
  const [newText, setNewText] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      await fetchProfile(session.user.id);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);

        // Fetch elements
        const { data: elementsData, error: elementsError } = await supabase
          .from("profile_elements")
          .select("*")
          .eq("profile_id", profileData.id)
          .order("z_index", { ascending: true });

        if (elementsError) throw elementsError;
        setElements((elementsData || []) as ProfileElement[]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Could not load your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  const openAddDialog = (type: ElementType) => {
    setAddingType(type);
    setNewText("");
    setNewImageUrl("");
    setNewLinkUrl("");
    setNewLinkTitle("");
    setAddDialogOpen(true);
  };

  const handleAddElement = async () => {
    if (!profile || !addingType) return;

    let content: Record<string, unknown> = {};
    let width = 200;
    let height = 100;

    switch (addingType) {
      case "text":
        if (!newText.trim()) return;
        content = { text: newText };
        height = 60;
        break;
      case "image":
        if (!newImageUrl.trim()) return;
        content = { url: newImageUrl };
        width = 200;
        height = 200;
        break;
      case "link":
        if (!newLinkUrl.trim()) return;
        content = { url: newLinkUrl, title: newLinkTitle || newLinkUrl };
        height = 50;
        width = 250;
        break;
    }

    setSaving(true);
    try {
      const newElement = {
        profile_id: profile.id,
        element_type: addingType,
        content: content as unknown as Record<string, unknown>,
        position_x: 50,
        position_y: elements.length * 120 + 50,
        width,
        height,
        z_index: elements.length,
      };

      const { data, error } = await supabase
        .from("profile_elements")
        .insert(newElement as any)
        .select()
        .single();

      if (error) throw error;

      setElements([...elements, data as ProfileElement]);
      setAddDialogOpen(false);
      toast({
        title: "Element added!",
        description: "Your new element has been added to your profile.",
      });
      
      // Award customized_profile badge
      if (profile) {
        await checkAndAwardBadges(profile.id, profile.username);
      }
    } catch (error) {
      console.error("Error adding element:", error);
      toast({
        title: "Error",
        description: "Could not add the element.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    try {
      const { error } = await supabase
        .from("profile_elements")
        .delete()
        .eq("id", elementId);

      if (error) throw error;

      setElements(elements.filter((el) => el.id !== elementId));
      setSelectedElement(null);
      toast({
        title: "Element deleted",
        description: "The element has been removed from your profile.",
      });
    } catch (error) {
      console.error("Error deleting element:", error);
      toast({
        title: "Error",
        description: "Could not delete the element.",
        variant: "destructive",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(elementId);
    setSelectedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    setElements(
      elements.map((el) =>
        el.id === dragging
          ? { ...el, position_x: Math.max(0, newX), position_y: Math.max(0, newY) }
          : el
      )
    );
  };

  const handleMouseUp = async () => {
    if (!dragging) return;

    const element = elements.find((el) => el.id === dragging);
    if (element) {
      try {
        await supabase
          .from("profile_elements")
          .update({
            position_x: element.position_x,
            position_y: element.position_y,
          })
          .eq("id", element.id);
      } catch (error) {
        console.error("Error saving position:", error);
      }
    }

    setDragging(null);
  };

  const openEditDialog = (element: ProfileElement) => {
    setEditingElement(element);
    if (element.element_type === "text") {
      setNewText((element.content as { text?: string }).text || "");
    } else if (element.element_type === "image") {
      setNewImageUrl((element.content as { url?: string }).url || "");
    } else if (element.element_type === "link") {
      setNewLinkUrl((element.content as { url?: string }).url || "");
      setNewLinkTitle((element.content as { title?: string }).title || "");
    }
    setEditDialogOpen(true);
  };

  const handleUpdateElement = async () => {
    if (!editingElement) return;

    let content: Record<string, unknown> = {};

    switch (editingElement.element_type) {
      case "text":
        content = { text: newText };
        break;
      case "image":
        content = { url: newImageUrl };
        break;
      case "link":
        content = { url: newLinkUrl, title: newLinkTitle || newLinkUrl };
        break;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profile_elements")
        .update({ content: content as any })
        .eq("id", editingElement.id);

      if (error) throw error;

      setElements(
        elements.map((el) =>
          el.id === editingElement.id ? { ...el, content } : el
        )
      );
      setEditDialogOpen(false);
      toast({
        title: "Element updated!",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Error updating element:", error);
      toast({
        title: "Error",
        description: "Could not update the element.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderElement = (element: ProfileElement) => {
    const isSelected = selectedElement === element.id;
    const content = element.content as Record<string, string>;

    const baseClasses = `absolute cursor-move transition-shadow ${
      isSelected ? "ring-2 ring-primary shadow-lg" : "hover:ring-1 hover:ring-primary/50"
    }`;

    switch (element.element_type) {
      case "text":
        return (
          <div
            key={element.id}
            className={`${baseClasses} p-4 rounded-xl bg-card border border-border`}
            style={{
              left: element.position_x,
              top: element.position_y,
              width: element.width,
              minHeight: element.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => openEditDialog(element)}
          >
            <p className="text-sm">{content.text}</p>
            {isSelected && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteElement(element.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        );

      case "image":
        return (
          <div
            key={element.id}
            className={`${baseClasses} rounded-xl overflow-hidden bg-muted`}
            style={{
              left: element.position_x,
              top: element.position_y,
              width: element.width,
              height: element.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => openEditDialog(element)}
          >
            <img
              src={content.url}
              alt="Profile element"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            {isSelected && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteElement(element.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        );

      case "link":
        return (
          <div
            key={element.id}
            className={`${baseClasses} p-3 rounded-xl bg-card border border-border flex items-center gap-3`}
            style={{
              left: element.position_x,
              top: element.position_y,
              width: element.width,
              minHeight: element.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => openEditDialog(element)}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <LinkIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium truncate">{content.title}</span>
            {isSelected && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteElement(element.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const username = profile?.username || user?.user_metadata?.username || "user";
  const themeColor = profile?.theme_color || "#EC4899";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card p-6 flex flex-col z-50">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <img src={ridgeLogo} alt="Ridge" className="h-8 w-auto" />
          <span className="font-display text-xl font-bold gradient-text">Ridge</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { name: "Edit Profile", icon: Edit3, path: "/editor", active: true },
            { name: "Analytics", icon: BarChart3, path: "/analytics" },
            { name: "Settings", icon: Settings, path: "/settings" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? "bg-accent text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          className="justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Log out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex flex-col h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h1 className="font-display text-lg font-semibold">Profile Editor</h1>
            <p className="text-xs text-muted-foreground">
              Drag elements to reposition • Double-click to edit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/${username}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gradient-bg shadow-pink gap-2">
                  <Plus className="w-4 h-4" />
                  Add Element
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openAddDialog("text")}>
                  <Type className="w-4 h-4 mr-2" />
                  Text Block
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("image")}>
                  <Image className="w-4 h-4 mr-2" />
                  Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openAddDialog("link")}>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-8">
          <div
            ref={canvasRef}
            className="relative min-h-[800px] w-full max-w-2xl mx-auto rounded-2xl border-2 border-dashed border-border bg-card/50"
            style={{
              backgroundImage: profile?.background_url
                ? `url(${profile.background_url})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedElement(null);
              }
            }}
          >
            {/* Background overlay */}
            {profile?.background_url && (
              <div className="absolute inset-0 bg-background/60 rounded-2xl" />
            )}

            {/* Profile Header Preview */}
            <div className="relative p-8 text-center border-b border-border/50">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg overflow-hidden"
                style={
                  !profile?.avatar_url
                    ? { background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }
                    : undefined
                }
              >
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || username}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h2 className="font-display text-2xl font-bold mb-1">
                {profile?.display_name || `@${username}`}
              </h2>
              {profile?.display_name && (
                <p className="text-sm text-muted-foreground mb-2">@{username}</p>
              )}
              {profile?.bio && (
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Elements Area */}
            <div className="relative min-h-[500px] p-4">
              {elements.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Click "Add Element" to start building your profile
                    </p>
                  </div>
                </div>
              ) : (
                elements.map(renderElement)
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Element Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {addingType === "text" ? "Text Block" : addingType === "image" ? "Image" : "Link"}
            </DialogTitle>
            <DialogDescription>
              {addingType === "text" && "Add a text block to your profile."}
              {addingType === "image" && "Add an image to your profile using a URL."}
              {addingType === "link" && "Add a link button to your profile."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {addingType === "text" && (
              <div>
                <Label htmlFor="text">Text Content</Label>
                <Textarea
                  id="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            {addingType === "image" && (
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
            )}

            {addingType === "link" && (
              <>
                <div>
                  <Label htmlFor="linkTitle">Link Title</Label>
                  <Input
                    id="linkTitle"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="My Website"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">Link URL</Label>
                  <Input
                    id="linkUrl"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddElement}
              disabled={saving}
              className="gradient-bg shadow-pink"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Element
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Element Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Element</DialogTitle>
            <DialogDescription>
              Update the content of this element.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingElement?.element_type === "text" && (
              <div>
                <Label htmlFor="editText">Text Content</Label>
                <Textarea
                  id="editText"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            {editingElement?.element_type === "image" && (
              <div>
                <Label htmlFor="editImageUrl">Image URL</Label>
                <Input
                  id="editImageUrl"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
            )}

            {editingElement?.element_type === "link" && (
              <>
                <div>
                  <Label htmlFor="editLinkTitle">Link Title</Label>
                  <Input
                    id="editLinkTitle"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="My Website"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="editLinkUrl">Link URL</Label>
                  <Input
                    id="editLinkUrl"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateElement}
              disabled={saving}
              className="gradient-bg shadow-pink"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
