import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Download, Star, Users, Eye, Chrome, Shield, Zap } from 'lucide-react'

const Extensions = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Sample extensions data
  const extensions = [
    {
      id: 1,
      title: 'Productivity Tracker',
      description: 'Track your daily productivity and time spent on different websites',
      longDescription: 'A comprehensive productivity tracking extension that monitors your browsing habits, categorizes websites, and provides detailed analytics about your time usage. Features include website blocking, focus mode, and detailed reports.',
      category: 'productivity',
      version: '2.1.0',
      rating: 4.8,
      users: 15420,
      icon: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
      ],
      features: ['Time Tracking', 'Website Blocking', 'Analytics Dashboard', 'Focus Mode'],
      permissions: ['activeTab', 'storage', 'alarms'],
      isPremium: true,
      price: 2.99,
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Color Picker Pro',
      description: 'Advanced color picker tool for designers and developers',
      longDescription: 'Professional color picker extension with advanced features like color palette generation, gradient creation, and accessibility testing. Perfect for web designers and developers.',
      category: 'design',
      version: '1.5.2',
      rating: 4.9,
      users: 8930,
      icon: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=100&h=100&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'
      ],
      features: ['Color Picker', 'Palette Generator', 'Gradient Creator', 'Accessibility Check'],
      permissions: ['activeTab', 'storage'],
      isPremium: false,
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Password Manager Lite',
      description: 'Secure password management with auto-fill capabilities',
      longDescription: 'Lightweight password manager that securely stores your passwords and automatically fills login forms. Features end-to-end encryption and cross-device sync.',
      category: 'security',
      version: '3.0.1',
      rating: 4.7,
      users: 22150,
      icon: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'
      ],
      features: ['Password Storage', 'Auto-fill', 'Encryption', 'Sync Across Devices'],
      permissions: ['activeTab', 'storage', 'identity'],
      isPremium: true,
      price: 4.99,
      downloadUrl: '#'
    },
    {
      id: 4,
      title: 'Screenshot Annotator',
      description: 'Take screenshots and annotate them with ease',
      longDescription: 'Powerful screenshot tool with annotation features. Capture full pages, selected areas, or visible portions and add arrows, text, shapes, and highlights.',
      category: 'utility',
      version: '1.8.0',
      rating: 4.6,
      users: 12780,
      icon: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
      ],
      features: ['Full Page Capture', 'Annotation Tools', 'Cloud Upload', 'Sharing Options'],
      permissions: ['activeTab', 'storage', 'downloads'],
      isPremium: false,
      downloadUrl: '#'
    },
    {
      id: 5,
      title: 'Tab Manager Plus',
      description: 'Organize and manage your browser tabs efficiently',
      longDescription: 'Advanced tab management extension that helps you organize, search, and manage hundreds of tabs. Features include tab grouping, session saving, and duplicate detection.',
      category: 'productivity',
      version: '2.3.1',
      rating: 4.5,
      users: 9640,
      icon: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=100&h=100&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
      ],
      features: ['Tab Grouping', 'Session Management', 'Search Tabs', 'Duplicate Detection'],
      permissions: ['tabs', 'storage', 'sessions'],
      isPremium: true,
      price: 1.99,
      downloadUrl: '#'
    },
    {
      id: 6,
      title: 'JSON Formatter',
      description: 'Format and validate JSON data in your browser',
      longDescription: 'Developer tool for formatting, validating, and beautifying JSON data. Features syntax highlighting, error detection, and minification options.',
      category: 'developer',
      version: '1.2.5',
      rating: 4.8,
      users: 18920,
      icon: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=100&h=100&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop'
      ],
      features: ['JSON Formatting', 'Syntax Highlighting', 'Validation', 'Minification'],
      permissions: ['activeTab', 'storage'],
      isPremium: false,
      downloadUrl: '#'
    }
  ]

  const filteredExtensions = extensions.filter(extension =>
    extension.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extension.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extension.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return Zap
      case 'design': return Eye
      case 'security': return Shield
      case 'utility': return Chrome
      case 'developer': return Chrome
      default: return Chrome
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return 'bg-blue-500'
      case 'design': return 'bg-purple-500'
      case 'security': return 'bg-red-500'
      case 'utility': return 'bg-green-500'
      case 'developer': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Chrome Extensions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boost your productivity with our collection of custom Chrome extensions. 
            Built with modern web technologies and user experience in mind.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search extensions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Extensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExtensions.map((extension) => {
            const CategoryIcon = getCategoryIcon(extension.category)
            return (
              <Card key={extension.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={extension.icon}
                        alt={extension.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 ${getCategoryColor(extension.category)} rounded-full flex items-center justify-center`}>
                            <CategoryIcon className="h-3 w-3 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {extension.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {extension.isPremium && (
                      <Badge variant="secondary">
                        ${extension.price}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg">{extension.title}</CardTitle>
                  <CardDescription>{extension.description}</CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{extension.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{extension.users.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-xs">v{extension.version}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {extension.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <img
                              src={extension.icon}
                              alt={extension.title}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <span>{extension.title}</span>
                          </DialogTitle>
                          <DialogDescription>
                            {extension.longDescription}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Screenshots */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Screenshots</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {extension.screenshots.map((screenshot, index) => (
                                <img
                                  key={index}
                                  src={screenshot}
                                  alt={`${extension.title} screenshot ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg border"
                                />
                              ))}
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Features</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {extension.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Permissions */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Permissions</h3>
                            <div className="flex flex-wrap gap-2">
                              {extension.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      {extension.isPremium ? `Buy $${extension.price}` : 'Download'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredExtensions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No extensions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Extensions