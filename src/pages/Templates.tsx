import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Eye, Download, Star, Filter, Loader2 } from 'lucide-react'
import { apiClient } from '@/services/api'

// Sample template data as fallback
const sampleTemplates = [
  {
    id: 1,
    title: 'Modern Dashboard',
    description: 'Clean and modern admin dashboard with dark mode support',
    category: 'admin',
    price: 29,
    rating: 4.8,
    downloads: 1250,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    tags: ['React', 'Tailwind', 'Dashboard'],
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  },
  {
    id: 2,
    title: 'E-commerce Store',
    description: 'Complete e-commerce solution with cart and payment integration',
    category: 'ecommerce',
    price: 49,
    rating: 4.9,
    downloads: 890,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    tags: ['Next.js', 'Stripe', 'E-commerce'],
    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'Stunning portfolio template for designers and developers',
    category: 'portfolio',
    price: 19,
    rating: 4.7,
    downloads: 2100,
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    tags: ['HTML', 'CSS', 'Portfolio'],
    preview: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop'
  },
  {
    id: 4,
    title: 'SaaS Landing Page',
    description: 'High-converting landing page template for SaaS products',
    category: 'landing',
    price: 39,
    rating: 4.8,
    downloads: 1560,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    tags: ['React', 'Landing Page', 'SaaS'],
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  },
  {
    id: 5,
    title: 'Blog Template',
    description: 'Clean and minimal blog template with SEO optimization',
    category: 'blog',
    price: 24,
    rating: 4.6,
    downloads: 980,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=400&h=300&fit=crop',
    tags: ['Gatsby', 'Blog', 'SEO'],
    preview: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=800&h=600&fit=crop'
  },
  {
    id: 6,
    title: 'Corporate Website',
    description: 'Professional corporate website template with CMS integration',
    category: 'corporate',
    price: 34,
    rating: 4.7,
    downloads: 750,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    tags: ['WordPress', 'Corporate', 'CMS'],
    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  }
]

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getTemplates({
          search: searchTerm || undefined,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          limit: 50
        })
        setTemplates(response.templates || [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch templates:', err)
        setError('Failed to load templates. Using sample data.')
        // Fallback to sample data
        setTemplates(sampleTemplates)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchTemplates, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedCategory])

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'admin', label: 'Admin Panels' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'landing', label: 'Landing Pages' },
    { value: 'blog', label: 'Blog' },
    { value: 'corporate', label: 'Corporate' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handlePurchase = async (template: any) => {
    try {
      // Create payment order
      const orderResponse = await apiClient.createPaymentOrder(
        template.price * 100, // Convert to paise
        'template',
        template.id.toString()
      )

      // Initialize Razorpay
      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Trustme Platform',
        description: `Purchase ${template.title}`,
        order_id: orderResponse.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await apiClient.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              itemType: 'template',
              itemId: template.id.toString()
            })

            if (verifyResponse.success) {
              // Download template
              const downloadResponse = await apiClient.downloadTemplate(template.id.toString(), {
                paymentVerified: true,
                paymentId: verifyResponse.paymentId
              })
              
              // Create download link
              const link = document.createElement('a')
              link.href = downloadResponse.downloadUrl
              link.download = `${template.title}.zip`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              
              alert('Payment successful! Download started.')
            }
          } catch (error) {
            console.error('Payment verification failed:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com'
        },
        theme: {
          color: '#6366F1'
        }
      }

      // @ts-expect-error - Razorpay is loaded via script tag
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment initiation failed:', error)
      alert('Failed to initiate payment. Please try again.')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Website Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium website templates and UI kits ready to use in your projects. 
            All templates come with source code and documentation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
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

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading templates...</span>
          </div>
        )}

        {/* Templates Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                      ${template.price}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                        <span>•</span>
                        <span>{template.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>{template.title}</DialogTitle>
                          <DialogDescription>
                            Preview of the template design and layout
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <img
                            src={template.preview}
                            alt={`${template.title} preview`}
                            className="w-full h-auto rounded-lg border"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePurchase(template)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Buy ${template.price}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground">No templates found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Templates