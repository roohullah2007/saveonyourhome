import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Camera, Calendar, DollarSign, User, MapPin, Clock, ArrowLeft,
  CheckCircle, XCircle, Phone, Mail, Home, Globe, Shield,
  FileText, Video, Box, Sun, Play, Layers, Edit, Trash2
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function Show({ order }) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: order.status,
    admin_notes: order.admin_notes || '',
  });
  const [paymentForm, setPaymentForm] = useState({
    payment_method: '',
    payment_reference: '',
  });
  const [scheduleForm, setScheduleForm] = useState({
    scheduled_at: '',
  });

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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    router.post(`/admin/media-orders/${order.id}/status`, statusForm, {
      onSuccess: () => setShowStatusModal(false),
    });
  };

  const handlePaymentUpdate = (e) => {
    e.preventDefault();
    router.post(`/admin/media-orders/${order.id}/paid`, paymentForm, {
      onSuccess: () => setShowPaymentModal(false),
    });
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    router.post(`/admin/media-orders/${order.id}/schedule`, scheduleForm, {
      onSuccess: () => setShowScheduleModal(false),
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      router.delete(`/admin/media-orders/${order.id}`);
    }
  };

  const additionalMedia = order.additional_media || {};
  const mlsSigners = order.mls_signers || [];

  return (
    <>
      <Head title={`Order #${order.id} - Admin`} />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/media-orders"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Order #{order.id}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Created on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
              {order.is_paid ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <XCircle className="w-4 h-4 mr-1" />
                  Unpaid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-gray-400" />
                Property Details
              </h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Address</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.address}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Square Footage</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.sqft_range}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Access Method</dt>
                  <dd className="text-sm font-medium text-gray-900 capitalize">{order.access_method}</dd>
                </div>
                {order.combo_code && (
                  <div>
                    <dt className="text-sm text-gray-500">Code</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.combo_code}</dd>
                  </div>
                )}
                {order.alarm_code && (
                  <div>
                    <dt className="text-sm text-gray-500">Alarm Code</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.alarm_code}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500">Occupancy</dt>
                  <dd className="text-sm font-medium text-gray-900 capitalize">{order.occupied_status}</dd>
                </div>
                {order.subdivision && (
                  <div>
                    <dt className="text-sm text-gray-500">Subdivision</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.subdivision}</dd>
                  </div>
                )}
              </dl>
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <dt className="text-sm text-gray-500 mb-1">Notes</dt>
                  <dd className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{order.notes}</dd>
                </div>
              )}
            </div>

            {/* Services Ordered */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-gray-400" />
                Services Ordered
              </h2>

              <div className="space-y-4">
                {/* Photo Package */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.photo_package === 'photosDrone' ? 'Photos + Drone' : 'Photos Only'}
                      </p>
                      <p className="text-sm text-gray-500">Professional real estate photography</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>

                {/* Additional Media */}
                {additionalMedia.zillow3D && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Layers className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Zillow 3D + Floor Plan</p>
                        <p className="text-sm text-gray-500">360 photo tour with 2D floor plan</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {additionalMedia.videoWalkthrough && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Video Walkthrough</p>
                        <p className="text-sm text-gray-500">Cinematic video tour</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {additionalMedia.matterport && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Box className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Matterport 3D Tour</p>
                        <p className="text-sm text-gray-500">Fully immersive 3D experience</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {additionalMedia.reelsTikTok && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Reels/TikTok Video</p>
                        <p className="text-sm text-gray-500">Social media optimized video</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {additionalMedia.floorPlan && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Basic 2D Floor Plan</p>
                        <p className="text-sm text-gray-500">Professional floor plan</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {additionalMedia.virtualTwilight && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Sun className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Virtual Twilight</p>
                        <p className="text-sm text-gray-500">{additionalMedia.virtualTwilightCount || 1} photo(s)</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {/* MLS Package */}
                {order.mls_package && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.mls_package === 'deluxe' ? 'MLS Deluxe' : 'Basic MLS'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.mls_package === 'deluxe'
                            ? 'MLS + ShowingTime + SentriLock + Yard Sign'
                            : '6-month MLS listing'}
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {/* Broker Assisted */}
                {order.broker_assisted && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Broker Assisted Program</p>
                        <p className="text-sm text-gray-500">0.5% or $2,000 minimum at closing</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* MLS Signers */}
            {mlsSigners.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">MLS Form Signers</h2>
                <div className="space-y-3">
                  {mlsSigners.map((signer, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{signer.name}</p>
                        <p className="text-sm text-gray-500">{signer.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {order.admin_notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Notes</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.admin_notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Customer
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.user?.name || `${order.first_name} ${order.last_name}`}
                    </p>
                    {order.user && (
                      <Link href={`/admin/users/${order.user.id}`} className="text-sm text-[#0891B2] hover:underline">
                        View Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${order.email}`} className="hover:text-[#0891B2]">{order.email}</a>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${order.phone}`} className="hover:text-[#0891B2]">{order.phone}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                Scheduling
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Preferred Date</p>
                  <p className="font-medium text-gray-900">
                    {order.preferred_date ? formatDate(order.preferred_date) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Time</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.preferred_time || 'Not specified'}
                  </p>
                </div>
                {order.scheduled_at && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Scheduled For</p>
                    <p className="font-medium text-green-600">{formatDate(order.scheduled_at)}</p>
                  </div>
                )}
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                Payment
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </span>
                </div>
                {order.broker_assisted && (
                  <p className="text-xs text-gray-500">+ Broker fee at closing</p>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  {order.is_paid ? (
                    <div>
                      <p className="font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </p>
                      <p className="text-sm text-gray-500">
                        via {order.payment_method} on {formatDate(order.paid_at)}
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium text-orange-600">Awaiting Payment</p>
                  )}
                </div>
                {!order.is_paid && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update Status
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h3>
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={statusForm.admin_notes}
                  onChange={(e) => setStatusForm({ ...statusForm, admin_notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                  placeholder="Add notes about this order..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mark as Paid</h3>
            <form onSubmit={handlePaymentUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                >
                  <option value="">Select payment method</option>
                  <option value="venmo">Venmo</option>
                  <option value="cashapp">CashApp</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference (optional)</label>
                <input
                  type="text"
                  value={paymentForm.payment_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                  placeholder="Transaction ID or check number"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Appointment</h3>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleForm.scheduled_at}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduled_at: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

Show.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Show;
