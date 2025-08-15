// ANCHOR: OwnerDetailModal Component - Modal for displaying detailed owner information
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  UserCheck,
  UserX,
  X,
  Clock
} from 'lucide-react';
import { Button, Modal, Badge } from './ui';

/**
 * OwnerDetailModal component - Modal for displaying detailed owner information
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal function
 * @param {Object} props.owner - Owner data to display
 * @param {string} props.gemstoneName - Gemstone name for display
 * @returns {React.ReactElement} - Rendered modal component
 */
const OwnerDetailModal = ({ isOpen, onClose, owner, gemstoneName }) => {
  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!owner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Data Pemilik
              </h3>
              <p className="text-sm text-gray-600">{gemstoneName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

                 {/* Owner Information */}
         <div className="space-y-6">
           {/* Name and Status */}
           <div className="flex items-center justify-between">
             <div>
               <h4 className="text-xl font-semibold text-gray-900 mb-2">
                 {owner.owner_name}
               </h4>
               {owner.is_current_owner ? (
                 <Badge variant="success" className="flex items-center gap-1 w-fit">
                   <UserCheck className="w-3 h-3" />
                   Pemilik Aktif
                 </Badge>
               ) : (
                 <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                   <UserX className="w-3 h-3" />
                   Mantan Pemilik
                 </Badge>
               )}
             </div>
           </div>

                       {/* Single Column Layout */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Informasi Kontak
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Phone */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nomor Telepon</p>
                      <p className="text-gray-900">{owner.owner_phone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  {owner.owner_email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">{owner.owner_email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {owner.owner_address && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Alamat
                  </h5>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">{owner.owner_address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ownership Period */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Periode Kepemilikan
                </h5>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">Tanggal Mulai</p>
                      <p className="text-blue-900">{formatDate(owner.ownership_start_date)}</p>
                    </div>
                  </div>

                  {owner.ownership_end_date && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-orange-700">Tanggal Berakhir</p>
                        <p className="text-orange-900">{formatDate(owner.ownership_end_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {owner.notes && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Catatan
                  </h5>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <FileText className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-yellow-900">{owner.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
         </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OwnerDetailModal;
