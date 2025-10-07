import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  PaperClipIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import Button from "../../components/ui/Button";
import Card from '../../components/ui/Card';
import { supportTicketCategories, supportTicketPriorities } from '../../data/mockData';

const CreateSupportTicket = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'Medium',
    description: '',
    orderId: '',
    attachments: []
  });
  const [formErrors, setFormErrors] = useState({});

  // Auto-save draft
  useEffect(() => {
    if (newTicket.subject || newTicket.description) {
      const timer = setTimeout(() => {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newTicket]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateTicketId = () => {
    const year = new Date().getFullYear();
    const count = Math.floor(Math.random() * 9999) + 1;
    return `TKT-${year}-${String(count).padStart(4, '0')}`;
  };

  const validateForm = () => {
    const errors = {};
    if (!newTicket.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!newTicket.category) {
      errors.category = 'Category is required';
    }
    if (!newTicket.description.trim()) {
      errors.description = 'Description is required';
    } else if (newTicket.description.trim().length < 50) {
      errors.description = 'Description must be at least 50 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTicket = () => {
    if (!validateForm()) {
      showNotification('Please fix form errors', 'error');
      return;
    }

    // In a real app, this would make an API call
    console.log('Creating ticket:', {
      id: generateTicketId(),
      ...newTicket,
      status: 'Open',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    setNewTicket({
      subject: '',
      category: '',
      priority: 'Medium',
      description: '',
      orderId: '',
      attachments: []
    });
    
    showNotification('Ticket created successfully!');
    
    // Navigate back to support dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard/support');
    }, 1500);
  };

  const breadcrumbItems = [
    { name: "Support", href: "/dashboard/support" },
    { name: "Create Ticket" }
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/support')}
              className="p-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
              <p className="text-sm text-gray-500">Fill out the form below to submit your support request</p>
            </div>
          </div>
          {draftSaved && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Draft saved
            </div>
          )}
        </div>
      </div>

      <Card>
        <Card.Content className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                  formErrors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.subject && (
                <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className={`appearance-none w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {supportTicketCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
                {formErrors.category && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="appearance-none w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    {supportTicketPriorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Order ID <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket({ ...newTicket, orderId: e.target.value })}
                placeholder="e.g., ORD-45678"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter order ID if this ticket is related to a specific order</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Please provide detailed information about your issue..."
                rows={8}
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {formErrors.description ? (
                  <p className="text-red-500 text-xs">{formErrors.description}</p>
                ) : (
                  <p className="text-xs text-gray-500">Minimum 50 characters</p>
                )}
                <p className="text-xs text-gray-500">{newTicket.description.length} characters</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Attachments <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <PaperClipIcon className="mx-auto text-gray-400 mb-2 h-8 w-8" />
                <p className="text-xs text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG, XLSX up to 10MB each</p>
                {newTicket.attachments.length > 0 && (
                  <div className="mt-4 text-left">
                    {newTicket.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded mb-2">
                        <span className="text-xs text-gray-700">{file}</span>
                        <button
                          onClick={() => setNewTicket({
                            ...newTicket,
                            attachments: newTicket.attachments.filter((_, i) => i !== idx)
                          })}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleCreateTicket}
                className="flex-1"
              >
                Submit Ticket
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/support')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateSupportTicket;