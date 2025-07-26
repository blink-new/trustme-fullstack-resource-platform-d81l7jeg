import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, User, Download, FileText, Clock, Filter } from 'lucide-react'

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Complete Guide to React Hooks',
      excerpt: 'Master React Hooks with practical examples and best practices. Includes useState, useEffect, useContext, and custom hooks.',
      content: 'Full article content here...',
      category: 'react',
      author: 'Sachin',
      publishDate: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      tags: ['React', 'JavaScript', 'Frontend'],
      downloadable: {
        title: 'React Hooks Cheat Sheet',
        type: 'PDF',
        size: '2.5 MB',
        isPremium: false
      }
    },
    {
      id: 2,
      title: 'Node.js Performance Optimization',
      excerpt: 'Learn advanced techniques to optimize your Node.js applications for better performance and scalability.',
      content: 'Full article content here...',
      category: 'nodejs',
      author: 'Sachin',
      publishDate: '2024-01-10',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      tags: ['Node.js', 'Backend', 'Performance'],
      downloadable: {
        title: 'Node.js Optimization Guide',
        type: 'PDF',
        size: '4.1 MB',
        isPremium: true,
        price: 4.99
      }
    },
    {
      id: 3,
      title: 'CSS Grid vs Flexbox: When to Use What',
      excerpt: 'Comprehensive comparison of CSS Grid and Flexbox with practical examples and use cases.',
      content: 'Full article content here...',
      category: 'css',
      author: 'Sachin',
      publishDate: '2024-01-05',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      tags: ['CSS', 'Layout', 'Frontend'],
      downloadable: {
        title: 'CSS Layout Reference',
        type: 'PDF',
        size: '1.8 MB',
        isPremium: false
      }
    },
    {
      id: 4,
      title: 'MongoDB Aggregation Pipeline Mastery',
      excerpt: 'Deep dive into MongoDB aggregation pipelines with real-world examples and performance tips.',
      content: 'Full article content here...',
      category: 'database',
      author: 'Sachin',
      publishDate: '2023-12-28',
      readTime: '15 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
      tags: ['MongoDB', 'Database', 'Backend'],
      downloadable: {
        title: 'MongoDB Aggregation Examples',
        type: 'PDF',
        size: '3.2 MB',
        isPremium: true,
        price: 6.99
      }
    },
    {
      id: 5,
      title: 'TypeScript Best Practices 2024',
      excerpt: 'Modern TypeScript patterns and practices for building robust applications.',
      content: 'Full article content here...',
      category: 'typescript',
      author: 'Sachin',
      publishDate: '2023-12-20',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
      tags: ['TypeScript', 'JavaScript', 'Best Practices'],
      downloadable: {
        title: 'TypeScript Style Guide',
        type: 'PDF',
        size: '2.9 MB',
        isPremium: false
      }
    },
    {
      id: 6,
      title: 'Docker for Developers: Complete Guide',
      excerpt: 'Everything you need to know about Docker for development and deployment.',
      content: 'Full article content here...',
      category: 'devops',
      author: 'Sachin',
      publishDate: '2023-12-15',
      readTime: '18 min read',
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop',
      tags: ['Docker', 'DevOps', 'Deployment'],
      downloadable: {
        title: 'Docker Commands Reference',
        type: 'PDF',
        size: '5.1 MB',
        isPremium: true,
        price: 7.99
      }
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'react', label: 'React' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'css', label: 'CSS' },
    { value: 'database', label: 'Database' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'devops', label: 'DevOps' }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Tech Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In-depth articles, tutorials, and downloadable resources to help you stay ahead in tech.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur capitalize">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Downloadable Resource */}
                {post.downloadable && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{post.downloadable.title}</span>
                      </div>
                      {post.downloadable.isPremium && (
                        <Badge variant="secondary">
                          ${post.downloadable.price}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.downloadable.type} • {post.downloadable.size}
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-2" />
                      {post.downloadable.isPremium ? `Buy $${post.downloadable.price}` : 'Download Free'}
                    </Button>
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  Read Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog