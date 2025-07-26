const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API client with authentication
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const response = await this.request<{
      token: string;
      user: any;
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/profile');
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: any }>('/auth/verify');
  }

  // Templates
  async getTemplates(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      templates: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(endpoint);
  }

  async getFeaturedTemplates() {
    return this.request<any[]>('/templates/featured');
  }

  async getTemplate(id: string) {
    return this.request<any>(`/templates/${id}`);
  }

  async downloadTemplate(id: string, paymentData?: any) {
    return this.request<{ downloadUrl: string; message: string }>(`/templates/${id}/download`, {
      method: 'POST',
      body: JSON.stringify(paymentData || {}),
    });
  }

  // Tools
  async getTools(params?: {
    search?: string;
    category?: string;
    type?: string;
    isPremium?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/tools${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      tools: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(endpoint);
  }

  async getTool(id: string) {
    return this.request<any>(`/tools/${id}`);
  }

  async useTool(id: string, paymentData?: any) {
    return this.request<{ message: string; tool: any }>(`/tools/${id}/use`, {
      method: 'POST',
      body: JSON.stringify(paymentData || {}),
    });
  }

  // Blog
  async getBlogPosts(params?: {
    search?: string;
    category?: string;
    tags?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/blog${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      posts: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(endpoint);
  }

  async getBlogPost(slug: string) {
    return this.request<any>(`/blog/${slug}`);
  }

  async likeBlogPost(slug: string) {
    return this.request<{ message: string; likes: number }>(`/blog/${slug}/like`, {
      method: 'POST',
    });
  }

  async addComment(slug: string, comment: { name: string; email: string; comment: string }) {
    return this.request<{ message: string }>(`/blog/${slug}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async downloadBlogFile(slug: string, fileIndex: number, paymentData?: any) {
    return this.request<{ downloadUrl: string; message: string; fileName: string }>(`/blog/${slug}/download/${fileIndex}`, {
      method: 'POST',
      body: JSON.stringify(paymentData || {}),
    });
  }

  // Extensions
  async getExtensions(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/extensions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      extensions: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(endpoint);
  }

  async getExtension(id: string) {
    return this.request<any>(`/extensions/${id}`);
  }

  async downloadExtension(id: string, paymentData?: any) {
    return this.request<{ downloadUrl: string; message: string }>(`/extensions/${id}/download`, {
      method: 'POST',
      body: JSON.stringify(paymentData || {}),
    });
  }

  // Resume
  async getResumeTemplates() {
    return this.request<any[]>('/resume/templates');
  }

  async generateResume(templateId: string, resumeData: any, paymentVerified = false) {
    const response = await fetch(`${this.baseURL}/resume/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: JSON.stringify({ templateId, resumeData, paymentVerified }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Return blob for PDF download
    return response.blob();
  }

  // Payment
  async createPaymentOrder(amount: number, itemType: string, itemId: string) {
    return this.request<{
      orderId: string;
      amount: number;
      currency: string;
      key: string;
    }>('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `${itemType}_${itemId}_${Date.now()}`,
        itemType,
        itemId,
      }),
    });
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    itemType: string;
    itemId: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      paymentId: string;
      orderId: string;
    }>('/payment/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Admin methods
  async getAdminTemplates() {
    return this.request<any[]>('/templates/admin/all');
  }

  async createTemplate(formData: FormData) {
    return this.request<any>('/templates', {
      method: 'POST',
      headers: {
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: formData,
    });
  }

  async updateTemplate(id: string, formData: FormData) {
    return this.request<any>(`/templates/${id}`, {
      method: 'PUT',
      headers: {
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: formData,
    });
  }

  async deleteTemplate(id: string) {
    return this.request<{ message: string }>(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Similar methods for tools, blog, extensions...
  async getAdminTools() {
    return this.request<any[]>('/tools/admin/all');
  }

  async getAdminBlogPosts() {
    return this.request<any[]>('/blog/admin/all');
  }

  async getAdminExtensions() {
    return this.request<any[]>('/extensions/admin/all');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;