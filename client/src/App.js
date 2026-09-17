import React, { useState, useEffect } from 'react';
import { 
  HiOutlineServer, 
  HiOutlineDatabase, 
  HiOutlineShieldCheck, 
  HiOutlineRefresh, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle 
} from 'react-icons/hi';
import api from './services/api';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/health');
      setHealthData(data);
    } catch (err) {
      setError(err.message || 'Cannot reach Backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
              SH
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">SmartHotel</h1>
              <span className="text-xs text-slate-500 font-medium">MERN Management System</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              MERN Stack Ready
            </span>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Hệ thống SmartHotel đã sẵn sàng!
          </h2>
          <p className="text-indigo-100 max-w-2xl text-sm sm:text-base leading-relaxed">
            Nền tảng Fullstack MERN (MongoDB, Express, React, Node.js) đã được thiết lập thành công.
            Bạn có thể bắt đầu xây dựng các module Quản lý phòng (Rooms), Đặt phòng (Bookings), Khách hàng (Users) và Tích hợp AI.
          </p>
        </div>

        {/* System Health Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <HiOutlineShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Trạng thái kết nối Hệ thống (System Status)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* React Client Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Frontend</span>
                  <HiOutlineCheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-base font-semibold text-slate-800">React Client</h4>
                <p className="text-sm text-slate-500 mt-1">React 19 + Tailwind CSS</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Port: 3000</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">Running</span>
              </div>
            </div>

            {/* Express Server Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Backend</span>
                  {loading ? (
                    <span className="text-xs font-medium text-slate-400">Checking...</span>
                  ) : healthData?.success ? (
                    <HiOutlineCheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <HiOutlineXCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <HiOutlineServer className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-base font-semibold text-slate-800">Express API Server</h4>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {loading ? 'Đang kết nối...' : healthData?.message || error}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Port: 5000</span>
                <span className={`px-2 py-0.5 rounded font-medium ${
                  healthData?.success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {healthData?.success ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>

            {/* MongoDB Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database</span>
                  {loading ? (
                    <span className="text-xs font-medium text-slate-400">Checking...</span>
                  ) : healthData?.database?.connected ? (
                    <HiOutlineCheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <HiOutlineXCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <HiOutlineDatabase className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-base font-semibold text-slate-800">MongoDB</h4>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {loading ? 'Đang kiểm tra...' : `Status: ${healthData?.database?.status || 'Unknown'}`}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>mongodb://localhost:27017</span>
                <span className={`px-2 py-0.5 rounded font-medium ${
                  healthData?.database?.connected ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {healthData?.database?.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Guide / Next Steps */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3">Thư mục & Cấu trúc đã sẵn sàng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-1">server/config</span>
              <span className="text-slate-500">db.js (Mongoose connection)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-1">server/middlewares</span>
              <span className="text-slate-500">errorHandler, auth, validation</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-1">server/modules</span>
              <span className="text-slate-500">Rooms, Bookings, Users, AI</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-indigo-600 block mb-1">client/src/services</span>
              <span className="text-slate-500">api.js (Axios Client ready)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        SmartHotel Management System &copy; {new Date().getFullYear()} - SDN302 FPT
      </footer>
    </div>
  );
}

export default App;
