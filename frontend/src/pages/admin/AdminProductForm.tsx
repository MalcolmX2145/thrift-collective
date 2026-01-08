import AdminLayout from '@/components/layouts/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { toast } = useToast();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Clothing',
        sub_category: 'Tops',
        condition: 'Excellent',
        brand: '',
        stock_quantity: '1',
        images: '',
        sizes: '',
        is_new: false,
        is_trending: false,
        is_premium: false,
        is_deal: false,
    });

    const { data: product } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/products/${id}`);
            return response.data;
        },
        enabled: isEdit,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                category: product.category || 'Clothing',
                sub_category: product.subCategory || 'Tops',
                condition: product.condition || 'Excellent',
                brand: product.brand || '',
                stock_quantity: product.stock_quantity?.toString() || '1',
                images: product.images?.join(', ') || '',
                sizes: product.sizes?.join(', ') || '',
                is_new: product.isNew || false,
                is_trending: product.isTrending || false,
                is_premium: product.isPremium || false,
                is_deal: product.isDeal || false,
            });
        }
    }, [product]);

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                ...data,
                price: parseInt(data.price),
                stock_quantity: parseInt(data.stock_quantity),
                images: data.images.split(',').map((img: string) => img.trim()).filter(Boolean),
                sizes: data.sizes.split(',').map((size: string) => size.trim()).filter(Boolean),
            };

            if (isEdit) {
                await axios.put(`${API_URL}/products/${id}`, payload, {
                    headers: { 'x-user-id': user?.id },
                });
            } else {
                await axios.post(`${API_URL}/products`, payload, {
                    headers: { 'x-user-id': user?.id },
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast({
                title: 'Success',
                description: `Product ${isEdit ? 'updated' : 'created'} successfully`,
            });
            navigate('/admin/products');
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to save product',
                variant: 'destructive',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            const response = await axios.post(`${API_URL}/upload/image`, uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-user-id': user?.id, // Ensure admin auth
                },
            });

            const imageUrl = `http://localhost:5000${response.data.url}`;

            setFormData(prev => ({
                ...prev,
                images: prev.images ? `${prev.images}, ${imageUrl}` : imageUrl
            }));

            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Error',
                description: 'Failed to upload image',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
            // Clear input
            e.target.value = '';
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Products
                </button>

                <div className="bg-white rounded-lg border border-gray-200 p-8 text-gray-900">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (KES) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                                >
                                    <option value="Clothing">Clothing</option>
                                    <option value="Shoes">Shoes</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sub Category
                                </label>
                                <input
                                    type="text"
                                    name="sub_category"
                                    value={formData.sub_category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition *
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="New">New</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Images
                                </label>
                                <div className="space-y-4">
                                    {/* URL Input */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Add Image URLs (comma-separated)</p>
                                        <input
                                            type="text"
                                            name="images"
                                            value={formData.images}
                                            onChange={handleChange}
                                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                                        />
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Or Upload Image File</p>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-primary file:text-primary-foreground
                                                    hover:file:bg-primary/90"
                                            />
                                            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sizes (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleChange}
                                    placeholder="S, M, L, XL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="col-span-2 space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_new"
                                        checked={formData.is_new}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Mark as New Arrival</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_trending"
                                        checked={formData.is_trending}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Mark as Trending</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_premium"
                                        checked={formData.is_premium}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Mark as Premium</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_deal"
                                        checked={formData.is_deal}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Mark as Deal</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saveMutation.isPending}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                            >
                                {saveMutation.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
