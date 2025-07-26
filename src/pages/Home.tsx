import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Wrench, BookOpen, Puzzle, Star, Download, Users, Shield } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Code,
      title: 'Website Templates',
      description: 'Premium UI kits, admin panels, and complete website templates ready to use.',
      link: '/templates',
      color: 'bg-blue-500'
    },
    {
      icon: Wrench,
      title: 'Productivity Tools',
      description: 'Resume generator, Markdown to PDF converter, BMI calculator, and more.',
      link: '/tools',
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: 'Tech Blog',
      description: 'In-depth articles, tutorials, and downloadable tech notes and PDFs.',
      link: '/blog',
      color: 'bg-purple-500'
    },
    {
      icon: Puzzle,
      title: 'Chrome Extensions',
      description: 'Useful browser extensions to boost your productivity and workflow.',
      link: '/extensions',
      color: 'bg-orange-500'
    }
  ]

  const stats = [
    { icon: Download, label: 'Downloads', value: '10K+' },
    { icon: Users, label: 'Happy Users', value: '2K+' },
    { icon: Star, label: 'Rating', value: '4.9' },
    { icon: Shield, label: 'Secure', value: '100%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              Developed by Sachin
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Welcome to{' '}
              <span className="text-primary">Trustme</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Your one-stop platform for premium website templates, productivity tools, 
              tech resources, and Chrome extensions. Everything you need to build amazing projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/templates">Explore Templates</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tools">Try Tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive collection of resources designed to accelerate your development workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={feature.link}>Explore</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of developers and creators who trust our platform for their projects. 
            Start exploring our resources today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/templates">Browse Templates</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/blog">Read Blog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home