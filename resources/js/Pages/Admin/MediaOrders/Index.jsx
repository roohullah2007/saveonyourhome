import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Camera, Calendar, DollarSign, User, MapPin, Clock, Search,
  Eye, CheckCircle, XCircle, MoreVertical, Filter, ChevronDown,
  Globe, Shield, Phone, Mail, FileText
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function Index({ orders, counts, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/media-orders', {
      search: searchTerm,
      status: selectedStatus,
    }, { preserveState: true });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    router.get('/admin/media-orders', {
      search: searchTerm,
      status: status,
    }, { preserveState: true });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tabs = [
    { key: 'all', label: 'All', count: counts?.all || 0 },
    { key: 'pending', label: 'Pending', count: counts?.pending || 0 },
    { key: 'confirmed', label: 'Confirmed', count: counts?.confirmed || 0 },
    { key: 'scheduled', label: 'Scheduled', count: counts?.scheduled || 0 },
    { key: 'in_progress', label: 'In Progress', count: counts?.in_progress || 0 },
    { key: 'completed', label: 'Completed', count: counts?.completed || 0 },
  ];

  return (
    <>
      <Head title="Media Orders - Admin" />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Media Orders</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage photo, video, and MLS order requests from sellers.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{counts?.pending || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-semibold text-gray-900">{counts?.scheduled || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Camera className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{counts?.in_progress || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{counts?.completed || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusFilter(tab.key)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedStatus === tab.key
                    ? 'border-[#0891B2] text-[#0891B2]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                  selectedStatus === tab.key
                    ? 'bg-[#0891B2]/10 text-[#0891B2]'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by address, email, or name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.data?.length > 0 ? (
                orders.data.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#EEEDEA] rounded-lg flex items-center justify-center">
                            <Camera className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.address}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.user?.name || `${order.first_name} ${order.last_name}`}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {order.email}
                      </div>
                      {order.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <Camera className="w-3 h-3 mr-1" />
                          {order.photo_package === 'photosDrone' ? 'Photos + Drone' : 'Photos'}
                        </span>
                        {order.mls_package && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Globe className="w-3 h-3 mr-1" />
                            MLS {order.mls_package === 'deluxe' ? 'Deluxe' : 'Basic'}
                          </span>
                        )}
                        {order.broker_assisted && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Broker Assisted
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(order.status)}
                        {order.is_paid ? (
                          <div className="flex items-center text-green-600 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Paid
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400 text-xs">
                            <XCircle className="w-3 h-3 mr-1" />
                            Unpaid
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${parseFloat(order.total_price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/media-orders/${order.id}`}
                        className="text-[#0891B2] hover:text-[#0E7490] font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Camera className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">No orders found</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? 'Try adjusting your search terms' : 'Orders will appear here when customers place them'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {orders?.data?.length > 0 && orders.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{orders.from}</span> to{' '}
              <span className="font-medium">{orders.to}</span> of{' '}
              <span className="font-medium">{orders.total}</span> orders
            </div>
            <nav className="flex gap-2">
              {orders.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    link.active
                      ? 'bg-[#0891B2] text-white'
                      : link.url
                      ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Index;
