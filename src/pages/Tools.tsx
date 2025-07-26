import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Play, ExternalLink, FileText, Calculator, Image, Code } from 'lucide-react'

const BMICalculatorDemo = () => {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)

  const calculateBMI = () => {
    const h = parseFloat(height) / 100 // convert cm to m
    const w = parseFloat(weight)
    if (h > 0 && w > 0) {
      setBmi(w / (h * h))
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' }
    return { category: 'Obese', color: 'text-red-600' }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Height (cm)</label>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
          />
        </div>
      </div>
      <Button onClick={calculateBMI} className="w-full">
        Calculate BMI
      </Button>
      {bmi && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
          <div className={`text-sm ${getBMICategory(bmi).color}`}>
            {getBMICategory(bmi).category}
          </div>
        </div>
      )}
    </div>
  )
}

const ColorPaletteDemo = () => {
  const [colors] = useState([
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
  ])

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, index) => (
          <div key={index} className="space-y-2">
            <div
              className="h-16 rounded-lg border"
              style={{ backgroundColor: color }}
            />
            <div className="text-xs text-center font-mono">{color}</div>
          </div>
        ))}
      </div>
      <Button className="w-full">Generate New Palette</Button>
    </div>
  )
}

const Tools = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Sample tools data
  const tools = [
    {
      id: 1,
      title: 'Resume Generator',
      description: 'Create ATS-friendly resumes with professional templates',
      category: 'productivity',
      icon: FileText,
      color: 'bg-blue-500',
      isInteractive: true,
      isPremium: true,
      price: 9.99,
      features: ['ATS-Optimized', 'Multiple Templates', 'PDF Export', 'Real-time Preview']
    },
    {
      id: 2,
      title: 'Markdown to PDF',
      description: 'Convert Markdown files to beautifully formatted PDFs',
      category: 'converter',
      icon: Code,
      color: 'bg-green-500',
      isInteractive: true,
      isPremium: false,
      features: ['Syntax Highlighting', 'Custom Styling', 'Batch Conversion', 'Cloud Storage']
    },
    {
      id: 3,
      title: 'BMI Calculator',
      description: 'Calculate Body Mass Index with health recommendations',
      category: 'health',
      icon: Calculator,
      color: 'bg-purple-500',
      isInteractive: true,
      isPremium: false,
      features: ['Imperial & Metric', 'Health Tips', 'Progress Tracking', 'Export Results']
    },
    {
      id: 4,
      title: 'Image Optimizer',
      description: 'Compress and optimize images for web use',
      category: 'media',
      icon: Image,
      color: 'bg-orange-500',
      isInteractive: true,
      isPremium: true,
      price: 4.99,
      features: ['Batch Processing', 'Multiple Formats', 'Quality Control', 'Size Reduction']
    },
    {
      id: 5,
      title: 'Color Palette Generator',
      description: 'Generate beautiful color palettes for your designs',
      category: 'design',
      icon: Image,
      color: 'bg-pink-500',
      isInteractive: true,
      isPremium: false,
      features: ['AI-Powered', 'Export Formats', 'Accessibility Check', 'Trending Colors']
    },
    {
      id: 6,
      title: 'QR Code Generator',
      description: 'Create custom QR codes with logos and styling',
      category: 'utility',
      icon: Code,
      color: 'bg-indigo-500',
      isInteractive: true,
      isPremium: false,
      features: ['Custom Design', 'Logo Integration', 'High Resolution', 'Bulk Generation']
    }
  ]

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const ToolDemo = ({ tool }: { tool: any }) => {
    if (tool.title === 'BMI Calculator') {
      return <BMICalculatorDemo />
    }
    if (tool.title === 'Color Palette Generator') {
      return <ColorPaletteDemo />
    }
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tool demo will be available here</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Productivity Tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful online tools to boost your productivity. Try them for free or unlock premium features.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {tool.isPremium && (
                      <Badge variant="secondary">
                        ${tool.price}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {tool.isInteractive && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Try Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{tool.title}</DialogTitle>
                            <DialogDescription>
                              Interactive demo of the tool
                            </DialogDescription>
                          </DialogHeader>
                          <ToolDemo tool={tool} />
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {tool.isPremium ? `Buy $${tool.price}` : 'Use Free'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tools