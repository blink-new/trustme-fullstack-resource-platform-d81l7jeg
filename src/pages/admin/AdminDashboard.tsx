import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Code, 
  Wrench, 
  BookOpen, 
  Puzzle, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Users,
  Download,
  DollarSign,
  TrendingUp
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  // Sample data
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Downloads',
      value: '15,234',
      change: '+8%',
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Revenue',
      value: '$12,456',
      change: '+23%',
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Growth',
      value: '18.2%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const templates = [
    { id: 1, title: 'Modern Dashboard', category: 'Admin', downloads: 1250, revenue: '$2,890' },
    { id: 2, title: 'E-commerce Store', category: 'E-commerce', downloads: 890, revenue: '$4,360' },
    { id: 3, title: 'Portfolio Website', category: 'Portfolio', downloads: 2100, revenue: '$3,990' }
  ]

  const tools = [
    { id: 1, title: 'Resume Generator', category: 'Productivity', users: 5420, revenue: '$1,290' },
    { id: 2, title: 'Markdown to PDF', category: 'Converter', users: 3210, revenue: '$0' },
    { id: 3, title: 'BMI Calculator', category: 'Health', users: 1890, revenue: '$0' }
  ]

  const blogPosts = [
    { id: 1, title: 'Complete Guide to React Hooks', views: 8420, downloads: 340 },
    { id: 2, title: 'Node.js Performance Optimization', views: 6210, downloads: 180 },
    { id: 3, title: 'CSS Grid vs Flexbox', views: 4890, downloads: 290 }
  ]

  const extensions = [
    { id: 1, title: 'Productivity Tracker', users: 15420, revenue: '$4,610' },
    { id: 2, title: 'Color Picker Pro', users: 8930, revenue: '$0' },
    { id: 3, title: 'Password Manager Lite', users: 22150, revenue: '$11,075' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm shadow-lg border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Trustme Admin
                  </h1>
                  <p className="text-xs text-muted-foreground">Platform Management</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your Trustme platform content and analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Tools</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="extensions" className="flex items-center space-x-2">
              <Puzzle className="h-4 w-4" />
              <span>Extensions</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600 font-medium">{stat.change}</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Downloads</CardTitle>
                  <CardDescription>Latest template and tool downloads</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {templates.slice(0, 3).map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{template.title}</p>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                      <Badge variant="secondary">{template.downloads}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue Sources</CardTitle>
                  <CardDescription>Highest earning content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {extensions.slice(0, 3).map((extension) => (
                    <div key={extension.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{extension.title}</p>
                        <p className="text-sm text-muted-foreground">{extension.users.toLocaleString()} users</p>
                      </div>
                      <Badge variant="secondary">{extension.revenue}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Website Templates</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Downloads</th>
                        <th className="p-4 font-medium">Revenue</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((template) => (
                        <tr key={template.id} className="border-b">
                          <td className="p-4 font-medium">{template.title}</td>
                          <td className="p-4">
                            <Badge variant="outline">{template.category}</Badge>
                          </td>
                          <td className="p-4">{template.downloads.toLocaleString()}</td>
                          <td className="p-4">{template.revenue}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Productivity Tools</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Users</th>
                        <th className="p-4 font-medium">Revenue</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.map((tool) => (
                        <tr key={tool.id} className="border-b">
                          <td className="p-4 font-medium">{tool.title}</td>
                          <td className="p-4">
                            <Badge variant="outline">{tool.category}</Badge>
                          </td>
                          <td className="p-4">{tool.users.toLocaleString()}</td>
                          <td className="p-4">{tool.revenue}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Blog Posts</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Post
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Views</th>
                        <th className="p-4 font-medium">Downloads</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="border-b">
                          <td className="p-4 font-medium">{post.title}</td>
                          <td className="p-4">{post.views.toLocaleString()}</td>
                          <td className="p-4">{post.downloads}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extensions Tab */}
          <TabsContent value="extensions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Chrome Extensions</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Extension
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Users</th>
                        <th className="p-4 font-medium">Revenue</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extensions.map((extension) => (
                        <tr key={extension.id} className="border-b">
                          <td className="p-4 font-medium">{extension.title}</td>
                          <td className="p-4">{extension.users.toLocaleString()}</td>
                          <td className="p-4">{extension.revenue}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard