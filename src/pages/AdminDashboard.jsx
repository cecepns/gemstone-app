import { BarChart2, Users, Gem, UserCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Card from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { getAdminStats } from '../utils/api';

/**
 * ANCHOR: AdminDashboard
 * Menampilkan statistik dasar untuk dashboard admin
 */
const AdminDashboard = () => {
  const { getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async() => {
      try {
        setLoading(true);
        const authHeader = getAuthHeader();
        const res = await getAdminStats(authHeader);
        if (!isMounted) {
          return;
        }
        setStats(res.data);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || 'Gagal memuat statistik');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [getAuthHeader]);

  const totals = stats?.totals || {};
  const distributions = stats?.distributions || {};
  const recent = stats?.recent || {};

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Batu Mulia</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">{loading ? '…' : totals.totalGemstones ?? 0}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-purple-50 text-purple-600">
              <Gem className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Dengan Pemilik Aktif</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">{loading ? '…' : totals.gemstonesWithCurrentOwner ?? 0}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-50 text-green-600">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Tanpa Pemilik</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">{loading ? '…' : totals.gemstonesWithoutOwner ?? 0}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-amber-50 text-amber-600">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Record Pemilik</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">{loading ? '…' : totals.totalOwnersRecords ?? 0}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-600">
              <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card padding="lg">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Top Warna</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {(distributions.byColor || []).map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-gray-600 truncate max-w-[70%]">{row.name}</span>
                <span className="font-medium text-gray-900 flex-none">{row.count}</span>
              </li>
            ))}
            {!loading && (!distributions.byColor || distributions.byColor.length === 0) && (
              <li className="text-xs sm:text-sm text-gray-500">Tidak ada data</li>
            )}
          </ul>
        </Card>
        <Card padding="lg">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Top Asal</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {(distributions.byOrigin || []).map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-gray-600 truncate max-w-[70%]">{row.name}</span>
                <span className="font-medium text-gray-900 flex-none">{row.count}</span>
              </li>
            ))}
            {!loading && (!distributions.byOrigin || distributions.byOrigin.length === 0) && (
              <li className="text-xs sm:text-sm text-gray-500">Tidak ada data</li>
            )}
          </ul>
        </Card>
        <Card padding="lg">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Top Treatment</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {(distributions.byTreatment || []).map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-gray-600 truncate max-w-[70%]">{row.name}</span>
                <span className="font-medium text-gray-900 flex-none">{row.count}</span>
              </li>
            ))}
            {!loading && (!distributions.byTreatment || distributions.byTreatment.length === 0) && (
              <li className="text-xs sm:text-sm text-gray-500">Tidak ada data</li>
            )}
          </ul>
        </Card>
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card padding="lg">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Batu Mulia Terbaru</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {(recent.gemstones || []).map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-gray-600 truncate max-w-[65%]">{g.name || g.unique_id_number}</span>
                <span className="text-gray-500 flex-none whitespace-nowrap text-[11px] sm:text-xs">{new Date(g.created_at).toLocaleString()}</span>
              </li>
            ))}
            {!loading && (!recent.gemstones || recent.gemstones.length === 0) && (
              <li className="text-xs sm:text-sm text-gray-500">Belum ada data</li>
            )}
          </ul>
        </Card>
        <Card padding="lg">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Perubahan Kepemilikan Terbaru</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {(recent.ownerships || []).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-gray-600 truncate max-w-[65%]">{o.gemstone_name} → {o.owner_name}{o.is_current_owner ? ' (aktif)' : ''}</span>
                <span className="text-gray-500 flex-none whitespace-nowrap text-[11px] sm:text-xs">{new Date(o.created_at).toLocaleString()}</span>
              </li>
            ))}
            {!loading && (!recent.ownerships || recent.ownerships.length === 0) && (
              <li className="text-xs sm:text-sm text-gray-500">Belum ada data</li>
            )}
          </ul>
        </Card>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
};

export default AdminDashboard;
