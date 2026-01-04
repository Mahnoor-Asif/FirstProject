import React, { useState } from 'react';
import { Search, Eye, Check, X, FileText, Image, ZoomIn } from 'lucide-react';

const Verification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'providers' | 'shops'>('providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);

  // ---------------- Providers Data ----------------
  const [pendingProviders, setPendingProviders] = useState([
    {
      id: 1,
      name: 'Muhammad Tariq',
      email: 'tariq@example.com',
      phone: '+92-300-5555555',
      service: 'Electrician',
      submittedDate: '2024-12-20',
      documents: {
        cnic: { front: true, back: true },
        certificate: true,
        clearance: true
      },
      experience: '5 years',
      location: 'Lahore'
    },
    {
      id: 2,
      name: 'Aisha Malik',
      email: 'aisha@example.com',
      phone: '+92-301-6666666',
      service: 'House Cleaning',
      submittedDate: '2024-12-19',
      documents: {
        cnic: { front: true, back: true },
        certificate: false,
        clearance: true
      },
      experience: '3 years',
      location: 'Karachi'
    }
  ]);

  // ---------------- Shops Data ----------------
  const [pendingShops, setPendingShops] = useState([
    {
      id: 101,
      name: 'FixIt Electronics',
      email: 'fixit@example.com',
      phone: '+92-311-1234567',
      service: 'Electronics Repair',
      submittedDate: '2024-12-18',
      documents: {
        cnic: { front: true, back: true },
        certificate: true,
        clearance: true
      },
      experience: '10 years',
      location: 'Islamabad'
    },
    {
      id: 102,
      name: 'CleanPro Services',
      email: 'cleanpro@example.com',
      phone: '+92-322-7654321',
      service: 'Cleaning',
      submittedDate: '2024-12-17',
      documents: {
        cnic: { front: true, back: true },
        certificate: true,
        clearance: false
      },
      experience: '6 years',
      location: 'Lahore'
    }
  ]);

  // ---------------- Handlers ----------------
  const handleView = (entity: any) => {
    setSelectedEntity(entity);
    setShowModal(true);
  };

  const handleApprove = (entityId: number) => {
    if (activeTab === 'providers') {
      setPendingProviders(pendingProviders.filter(p => p.id !== entityId));
    } else {
      setPendingShops(pendingShops.filter(s => s.id !== entityId));
    }
    alert('Approved successfully!');
    setShowModal(false);
  };

  const handleReject = (entityId: number) => {
    if (activeTab === 'providers') {
      setPendingProviders(pendingProviders.filter(p => p.id !== entityId));
    } else {
      setPendingShops(pendingShops.filter(s => s.id !== entityId));
    }
    alert('Rejected!');
    setShowModal(false);
  };

  const viewDocument = (docType: string) => {
     setShowModal(false);
    setViewingDocument(docType);
  };

  const DocumentStatus = ({ available }: { available: boolean }) => (
    <div className={`flex items-center space-x-1 ${available ? 'text-green-600' : 'text-red-600'}`}>
      {available ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span className="text-xs">{available ? 'Available' : 'Missing'}</span>
    </div>
  );

  // ---------------- Filtering ----------------
  const filteredEntities =
    activeTab === 'providers'
      ? pendingProviders.filter(e =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.service.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : pendingShops.filter(e =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.service.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>
          Verification Center
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white border border-gray-200 rounded-lg p-2">
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'providers'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Providers ({pendingProviders.length})
        </button>
        <button
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'shops'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Shops ({pendingShops.length})
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search pending ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredEntities.map((entity) => (
          <div key={entity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>{entity.name}</h3>
                    <p className="text-gray-600">{entity.email}</p>
                    <p className="text-gray-600">{entity.phone}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {entity.service}
                      </span>
                      <span className="text-sm text-gray-500">{entity.experience} experience</span>
                      <span className="text-sm text-gray-500">📍 {entity.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-sm font-medium">{new Date(entity.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Document Verification</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CNIC Front</span>
                      <DocumentStatus available={entity.documents.cnic.front} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CNIC Back</span>
                      <DocumentStatus available={entity.documents.cnic.back} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Certificate</span>
                      <DocumentStatus available={entity.documents.certificate} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Clearance</span>
                      <DocumentStatus available={entity.documents.clearance} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:w-64 space-y-3">
                <button
                  onClick={() => handleView(entity)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Documents</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(entity.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(entity.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
                <textarea
                  placeholder="Add verification notes or rejection reason..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-200 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntities.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No {activeTab} found matching your search criteria.</p>
        </div>
      )}

      {/* Full Modal View (All Docs) */}
      {showModal && selectedEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>
                Verification Details - {selectedEntity.name}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-sm text-gray-600">Name</p><p className="font-medium">{selectedEntity.name}</p></div>
                <div><p className="text-sm text-gray-600">Email</p><p className="font-medium">{selectedEntity.email}</p></div>
                <div><p className="text-sm text-gray-600">Phone</p><p className="font-medium">{selectedEntity.phone}</p></div>
                <div><p className="text-sm text-gray-600">Service</p><p className="font-medium">{selectedEntity.service}</p></div>
                <div><p className="text-sm text-gray-600">Experience</p><p className="font-medium">{selectedEntity.experience}</p></div>
                <div><p className="text-sm text-gray-600">Location</p><p className="font-medium">{selectedEntity.location}</p></div>
              </div>

              {/* Docs Grid */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {['cnic-front', 'cnic-back', 'certificate', 'clearance'].map((docType) => (
                    <div key={docType} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{docType.replace('-', ' ').toUpperCase()}</p>
                        <button
                          onClick={() => viewDocument(docType)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => viewDocument(docType)}
                      >
                        {docType.includes('front') && selectedEntity.documents.cnic.front ? (
                          <FileText className="w-8 h-8 text-green-600" />
                        ) : docType.includes('back') && selectedEntity.documents.cnic.back ? (
                          <FileText className="w-8 h-8 text-green-600" />
                        ) : docType === 'certificate' && selectedEntity.documents.certificate ? (
                          <Image className="w-8 h-8 text-green-600" />
                        ) : docType === 'clearance' && selectedEntity.documents.clearance ? (
                          <FileText className="w-8 h-8 text-green-600" />
                        ) : (
                          <span className="text-red-600 text-sm">Missing</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleReject(selectedEntity.id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedEntity.id)}
                  className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#05f51d' }}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>
                {viewingDocument.replace('-', ' ').toUpperCase()}
              </h3>
              
              <button onClick={() => {setViewingDocument(null);  setShowModal(true);}} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Document Preview</p>
                  <p className="text-sm text-gray-500">({viewingDocument})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
