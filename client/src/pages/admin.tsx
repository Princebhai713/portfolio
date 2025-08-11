import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  insertProjectSchema, insertBlogPostSchema, insertTestimonialSchema,
  type Project, type BlogPost, type Message, type Testimonial,
  type InsertProject, type InsertBlogPost, type InsertTestimonial
} from "@shared/schema";
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, LogOut, Home, 
  MessageSquare, User, FileText, Briefcase, Star,
  Calendar, Clock, Mail, Phone, MapPin 
} from "lucide-react";
import { z } from "zod";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

// Auth hook
function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const login = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
    },
  });

  return {
    user: user?.user,
    isLoading,
    login: login.mutate,
    logout: logout.mutate,
    isLoggingIn: login.isPending,
    isLoggingOut: logout.isPending,
  };
}

// Login component
function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        data-testid="input-username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-2">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoggingIn}
                  data-testid="button-login"
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
                <Link href="/">
                  <Button type="button" variant="outline" className="flex-1">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Project form component
function ProjectForm({ project, onClose }: { project?: Project; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      longDescription: project?.longDescription || "",
      technologies: project?.technologies || [],
      categories: project?.categories || [],
      imageUrl: project?.imageUrl || "",
      liveUrl: project?.liveUrl || "",
      githubUrl: project?.githubUrl || "",
      featured: project?.featured || false,
    },
  });

  const createProject = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Project created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onClose();
    },
  });

  const updateProject = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("PUT", `/api/projects/${project!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Project updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onClose();
    },
  });

  const onSubmit = (data: InsertProject) => {
    // Convert comma-separated strings to arrays
    const processedData = {
      ...data,
      technologies: typeof data.technologies === 'string' 
        ? (data.technologies as string).split(',').map(t => t.trim()).filter(Boolean)
        : data.technologies,
      categories: typeof data.categories === 'string'
        ? (data.categories as string).split(',').map(c => c.trim()).filter(Boolean) 
        : data.categories,
    };

    if (project) {
      updateProject.mutate(processedData);
    } else {
      createProject.mutate(processedData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Project title" data-testid="input-project-title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description" data-testid="textarea-project-description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description" 
                  rows={4}
                  data-testid="textarea-project-long-description" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="React, TypeScript, Node.js" 
                    data-testid="input-project-technologies"
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="react, fullstack, api" 
                    data-testid="input-project-categories"
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" data-testid="input-project-live-url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." data-testid="input-project-github-url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" data-testid="input-project-image-url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                  data-testid="switch-project-featured"
                />
              </FormControl>
              <FormLabel>Featured Project</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={createProject.isPending || updateProject.isPending}
            data-testid="button-save-project"
          >
            {project ? "Update" : "Create"} Project
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Blog post form component  
function BlogPostForm({ post, onClose }: { post?: BlogPost; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      imageUrl: post?.imageUrl || "",
      tags: post?.tags || [],
      readTime: post?.readTime || 5,
      published: post?.published || false,
    },
  });

  const createPost = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest("POST", "/api/blog", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Blog post created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      onClose();
    },
  });

  const updatePost = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest("PUT", `/api/blog/${post!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Blog post updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      onClose();
    },
  });

  const onSubmit = (data: InsertBlogPost) => {
    // Convert comma-separated string to array
    const processedData = {
      ...data,
      tags: typeof data.tags === 'string' 
        ? (data.tags as string).split(',').map(t => t.trim()).filter(Boolean)
        : data.tags,
    };

    if (post) {
      updatePost.mutate(processedData);
    } else {
      createPost.mutate(processedData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Blog post title" data-testid="input-blog-title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt *</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief summary" data-testid="textarea-blog-excerpt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Full blog post content" 
                  rows={8}
                  data-testid="textarea-blog-content" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="React, JavaScript, Tutorial" 
                    data-testid="input-blog-tags"
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="readTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Read Time (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="5" 
                    data-testid="input-blog-read-time"
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" data-testid="input-blog-image-url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                  data-testid="switch-blog-published"
                />
              </FormControl>
              <FormLabel>Published</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={createPost.isPending || updatePost.isPending}
            data-testid="button-save-blog-post"
          >
            {post ? "Update" : "Create"} Post
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Testimonial form component
function TestimonialForm({ testimonial, onClose }: { testimonial?: Testimonial; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertTestimonial>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      name: testimonial?.name || "",
      position: testimonial?.position || "",
      company: testimonial?.company || "",
      content: testimonial?.content || "",
      rating: testimonial?.rating || 5,
      imageUrl: testimonial?.imageUrl || "",
      featured: testimonial?.featured || false,
    },
  });

  const createTestimonial = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      const response = await apiRequest("POST", "/api/testimonials", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Testimonial created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      onClose();
    },
  });

  const updateTestimonial = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      const response = await apiRequest("PUT", `/api/testimonials/${testimonial!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Testimonial updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      onClose();
    },
  });

  const onSubmit = (data: InsertTestimonial) => {
    if (testimonial) {
      updateTestimonial.mutate(data);
    } else {
      createTestimonial.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" data-testid="input-testimonial-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position *</FormLabel>
                <FormControl>
                  <Input placeholder="Job title" data-testid="input-testimonial-position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company *</FormLabel>
              <FormControl>
                <Input placeholder="Company name" data-testid="input-testimonial-company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Testimonial content" 
                  rows={4}
                  data-testid="textarea-testimonial-content" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (1-5)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5" 
                    placeholder="5" 
                    data-testid="input-testimonial-rating"
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Profile image URL" data-testid="input-testimonial-image-url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                  data-testid="switch-testimonial-featured"
                />
              </FormControl>
              <FormLabel>Featured Testimonial</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={createTestimonial.isPending || updateTestimonial.isPending}
            data-testid="button-save-testimonial"
          >
            {testimonial ? "Update" : "Create"} Testimonial
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Admin dashboard component
function AdminDashboard() {
  const { user, logout, isLoggingOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>();

  // Fetch data
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog/all"] });
  const { data: messages = [] } = useQuery<Message[]>({ queryKey: ["/api/messages"] });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials/all"] });

  // Delete mutations
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Project deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  const deleteBlogPost = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Blog post deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/messages/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Message deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/testimonials/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Testimonial deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PUT", `/api/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.username}
              </span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  View Site
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
            <TabsTrigger value="blog" data-testid="tab-blog">Blog</TabsTrigger>
            <TabsTrigger value="messages" className="relative" data-testid="tab-messages">
              Messages
              {unreadCount > 0 && (
                <Badge className="ml-2 h-4 w-4 p-0 text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {projects.filter(p => p.featured).length} featured
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogPosts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {blogPosts.filter(p => p.published).length} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testimonials.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {testimonials.filter(t => t.featured).length} featured
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.slice(0, 5).map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex items-start space-x-3 p-3 rounded-lg ${
                          !message.read ? 'bg-blue-50 dark:bg-blue-950' : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {message.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {message.subject || message.message}
                          </p>
                        </div>
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No messages yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {post.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {post.published ? (
                                <Eye className="h-3 w-3 text-green-500" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    ))}
                    {blogPosts.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No blog posts yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Projects</h3>
              <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-project">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                  </DialogHeader>
                  <ProjectForm 
                    project={editingProject} 
                    onClose={() => {
                      setProjectDialogOpen(false);
                      setEditingProject(undefined);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="relative">
                  <CardContent className="p-4">
                    {project.featured && (
                      <Badge className="absolute top-2 right-2">Featured</Badge>
                    )}
                    {project.imageUrl && (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProject(project);
                          setProjectDialogOpen(true);
                        }}
                        data-testid={`button-edit-project-${project.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProject.mutate(project.id)}
                        data-testid={`button-delete-project-${project.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {projects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No projects yet</p>
                  <p className="text-gray-400 text-sm">Add your first project to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Blog Posts</h3>
              <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-blog-post">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <BlogPostForm 
                    post={editingPost} 
                    onClose={() => {
                      setBlogDialogOpen(false);
                      setEditingPost(undefined);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{post.title}</h4>
                          {post.published ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime} min read
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(post);
                            setBlogDialogOpen(true);
                          }}
                          data-testid={`button-edit-blog-post-${post.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteBlogPost.mutate(post.id)}
                          data-testid={`button-delete-blog-post-${post.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {blogPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No blog posts yet</p>
                  <p className="text-gray-400 text-sm">Write your first blog post to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Contact Messages</h3>
              <div className="text-sm text-gray-500">
                {unreadCount} unread of {messages.length} total
              </div>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={!message.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{message.name}</h4>
                          {!message.read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${message.email}`} className="hover:underline">
                              {message.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {message.subject && (
                          <p className="font-medium text-sm mb-2">Subject: {message.subject}</p>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!message.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead.mutate(message.id)}
                            data-testid={`button-mark-read-${message.id}`}
                          >
                            Mark Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMessage.mutate(message.id)}
                          data-testid={`button-delete-message-${message.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No messages yet</p>
                  <p className="text-gray-400 text-sm">Messages from the contact form will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Testimonials</h3>
              <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-testimonial">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                    </DialogTitle>
                  </DialogHeader>
                  <TestimonialForm 
                    testimonial={editingTestimonial} 
                    onClose={() => {
                      setTestimonialDialogOpen(false);
                      setEditingTestimonial(undefined);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="relative">
                  <CardContent className="p-6">
                    {testimonial.featured && (
                      <Badge className="absolute top-2 right-2">Featured</Badge>
                    )}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      {testimonial.imageUrl ? (
                        <img 
                          src={testimonial.imageUrl} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingTestimonial(testimonial);
                          setTestimonialDialogOpen(true);
                        }}
                        data-testid={`button-edit-testimonial-${testimonial.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTestimonial.mutate(testimonial.id)}
                        data-testid={`button-delete-testimonial-${testimonial.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {testimonials.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No testimonials yet</p>
                  <p className="text-gray-400 text-sm">Add client testimonials to showcase your work</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Main admin component
export default function Admin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AdminDashboard />;
}
