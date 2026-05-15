import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  ArrowRight,
  TrendingUp,
  Calculator,
  FileText,
  Bell,
  LogOut,
  ChevronRight,
  Database
} from 'lucide-react';

/**
 * ZakaTax: Fintech Synergy Platform
 * Menggabungkan Kewajiban Agama (Zakat) & Negara (Pajak)
 * Berdasarkan Blueprint Versi 1.0
 */

// --- Komponen Login ---
const LoginPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 animate-fade-in">
    <div
      className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

      <div className="text-center mb-10 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="bg-lime-400/20 p-3 rounded-2xl">
            <ShieldCheck className="text-lime-400 w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Zaka<span className="text-lime-300">Tax</span></h1>
        <p className="text-slate-400 text-sm leading-relaxed italic">
          "Sucikan hartamu, tenangkan jiwamu. Karena dalam setiap rupiah hartamu, ada hak mereka yang
          membutuhkan."
        </p>
      </div>

      <div className="space-y-6 relative z-10">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Alamat
            Email</label>
          <input type="email"
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-lime-300/50 outline-none transition-all placeholder:text-slate-600"
            placeholder="muzakki@zakatax.id" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Kata
            Sandi</label>
          <input type="password"
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-lime-300/50 outline-none transition-all placeholder:text-slate-600"
            placeholder="••••••••" />
        </div>
        <button onClick={() => onNavigate('dashboard')}
          className="w-full bg-lime-300 hover:bg-lime-400 text-slate-950 font-bold py-4 rounded-2xl transition-all
          shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 group"
        >
          Masuk Sekarang
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-8 text-center relative z-10">
        <button onClick={() => onNavigate('register')} className="text-slate-500 text-sm hover:text-lime-300
          transition-colors">
          Belum punya akun? <span className="text-lime-300 font-semibold">Daftar di sini</span>
        </button>
      </div>
    </div>
  </div>
);

// --- Komponen Register ---
const RegisterPage = ({ onNavigate }) => (
  <div
    className="min-h-screen bg-slate-950 flex items-center justify-center p-6 animate-slide-in-bottom">
    <div
      className="max-w-xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Langkah <span className="text-emerald-400">Berkah</span>
        </h2>
        <p className="text-slate-400 text-sm">Gabung dalam ekosistem filantropi yang transparan dan akuntabel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nama
            Lengkap</label>
          <input type="text"
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-400/50"
            placeholder="Contoh: Ahmad Fauzi" />
        </div>
        <div>
          <label
            className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email</label>
          <input type="email"
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-400/50"
            placeholder="ahmad@email.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">NPWP
            (Untuk Tax Rebate)</label>
          <input type="text"
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-400/50"
            placeholder="00.000.000.0-000.000" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Kata
            Sandi Baru</label>
          <input type="password"
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-400/50"
            placeholder="Minimal 8 karakter" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <button onClick={() => onNavigate('dashboard')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl
            transition-all shadow-lg shadow-emerald-500/20"
          >
            Buat Akun Sekarang
          </button>
          <button onClick={() => onNavigate('login')} className="w-full text-center text-slate-500 text-sm
            hover:text-emerald-400 transition-colors">
            Sudah terdaftar? <span className="font-semibold">Masuk kembali</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Dashboard / BankInput Page ---
const DashboardPage = ({ onNavigate }) => {
  const [assets, setAssets] = useState(0);
  const [goldPrice] = useState(1285000); // Simulasi Harga Emas Terkini
  const nisab = 85 * goldPrice;
  const isWajibZakat = assets >= nisab;
  const zakatAmount = isWajibZakat ? assets * 0.025 : 0;
  const progressPercent = Math.min((assets / nisab) * 100, 100);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 font-['Urbanist'] selection:bg-lime-300 selection:text-slate-900">
      {/* Sidebar Nav (Desktop) */}
      <nav
        className="fixed top-0 left-0 h-full w-20 bg-slate-900 border-r border-white/5 hidden md:flex flex-col items-center py-8 gap-8 z-50">
        <div className="text-lime-300 font-bold text-xl mb-4">Z<span className="text-white">T</span></div>
        <button className="p-3 bg-lime-300/10 text-lime-300 rounded-2xl transition-all">
          <TrendingUp className="w-6 h-6" />
        </button>
        <button className="p-3 text-slate-500 hover:text-white transition-all">
          <Wallet className="w-6 h-6" />
        </button>
        <button className="p-3 text-slate-500 hover:text-white transition-all">
          <FileText className="w-6 h-6" />
        </button>
        <div className="mt-auto">
          <button onClick={() => onNavigate('login')} className="p-3 text-slate-500 hover:text-red-400 transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <main className="md:ml-20 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-slide-in-top">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard <span
                className="text-lime-300">Muzakki</span></h1>
              <p className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Kepatuhan Zakat-Pajak Terintegrasi
                (Blueprint v1.0)
              </p>
            </div>
            <div className="flex gap-4">
              <div
                className="bg-slate-900/80 backdrop-blur border border-white/5 px-6 py-3 rounded-2xl shadow-sm">
                <span
                  className="text-[10px] text-slate-500 block uppercase font-bold tracking-tighter mb-1">Live
                  Gold Price (85gr Nisab)</span>
                <span className="text-lime-300 font-bold font-mono">Rp {goldPrice.toLocaleString()}/gr</span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur border border-white/5 p-3 rounded-2xl relative">
                <Bell className="w-6 h-6 text-slate-400" />
                <span
                  className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Section: Progress & Assets */}
            <div className="lg:col-span-8 space-y-8 animate-slide-in-left">

              {/* Zakat Progress Card */}
              <section
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group">
                <div
                  className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32">
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Auto-Nisab Engine</h3>
                      <p className="text-slate-400 text-sm">Monitoring Haul (1 Tahun Hijriah) secara
                        real-time</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-4xl font-black ${isWajibZakat ? 'text-lime-300'
                        : 'text-slate-400'}`}>
                        {Math.floor(progressPercent)}%
                      </span>
                    </div>
                  </div>

                  <div
                    className="relative w-full h-5 bg-slate-900/80 rounded-full overflow-hidden mb-10 border border-white/5">
                    <div className={`h-full transition-all duration-1000 ease-out flex items-center
                      justify-end pr-2 ${isWajibZakat ? 'bg-gradient-to-r from-emerald-500 to-lime-300'
                      : 'bg-slate-700'}`} style={{ width: `${progressPercent}%` }}>
                      {progressPercent > 10 && <div
                        className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm shadow-white">
                      </div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl group-hover:border-lime-300/20 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="w-4 h-4 text-lime-300" />
                        <span className="text-xs text-slate-500 font-bold uppercase">Total Kekayaan
                          (Aset)</span>
                      </div>
                      <span className="text-3xl font-bold text-white">Rp {assets.toLocaleString()}</span>
                    </div>
                    <div
                      className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl group-hover:border-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-500 font-bold uppercase">Ambang Batas
                          Nisab</span>
                      </div>
                      <span className="text-3xl font-bold text-white">Rp {nisab.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Multi-Bank Input Section */}
              <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Database className="text-lime-300 w-5 h-5" /> Konsolidasi Aset Manual
                  </h3>
                  <button className="text-xs text-lime-300 font-bold hover:underline">Link Bank API (Coming
                    Soon)</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-500">Rp</span>
                  </div>
                  <input type="number" onChange={(e) => setAssets(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/5 rounded-3xl pl-16 pr-8 py-6 text-3xl
                    font-black text-white focus:ring-2 focus:ring-lime-300/50 outline-none transition-all
                    placeholder:text-slate-800"
                    placeholder="0"
                  />
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800 text-[10px] px-3 py-1.5 rounded-full text-slate-400 font-bold">
                    MUTASI TERKINI</div>
                </div>
                <p className="mt-4 text-slate-500 text-xs text-center italic">
                  *Aset meliputi tabungan, perhiasan emas, investasi lancar, dan piutang yang diharapkan
                  kembali.
                </p>
              </section>
            </div>

            {/* Right Section: Zakat Summary & Tax Offset */}
            <div className="lg:col-span-4 space-y-8 animate-slide-in-right">
              {/* Payment Card */}
              <div className={`rounded-[2.5rem] p-8 lg:p-10 transition-all shadow-xl relative overflow-hidden
                ${isWajibZakat ? 'bg-gradient-to-br from-lime-300 to-emerald-400 text-slate-950'
                : 'bg-slate-900 border border-white/5 text-white opacity-90'}`}>
                {isWajibZakat && <div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 blur-2xl rounded-full"></div>}

                <h3 className="text-xl font-black mb-1 flex items-center gap-2 uppercase tracking-tight">
                  <Calculator className="w-5 h-5" /> Kalkulasi Zakat
                </h3>
                <p className="text-sm opacity-60 mb-8 font-medium">Berdasarkan Kepemilikan 1 Tahun (Haul)</p>

                <div className="mb-10">
                  <span className="text-xs font-bold uppercase opacity-50 block mb-1">Total Wajib Bayar</span>
                  <div className="text-5xl font-black tracking-tighter">Rp {zakatAmount.toLocaleString()}
                  </div>
                </div>

                <button disabled={!isWajibZakat} className={`w-full py-5 rounded-[1.5rem] font-bold text-lg
                  transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg
                  ${isWajibZakat ? 'bg-slate-950 text-white hover:bg-black shadow-slate-950/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'}`}>
                  {isWajibZakat ? (
                    <>Tunaikan Zakat Sekarang
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>Belum Mencapai Nisab</>
                  )}
                </button>
              </div>

              {/* Tax Offset Generator Badge */}
              <div
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-8 relative group cursor-help">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400">Tax Offset Generator</h4>
                    <span
                      className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-black">COMPLIANCE
                      READY</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ZakaTax mengonversi Bukti Setor Zakat (BSZ) Anda menjadi pengurang PKP Pajak Penghasilan
                  (PPh) secara otomatis sesuai <strong>UU No. 23 Tahun 2011</strong>.
                </p>
                <div
                  className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>DJP Validated</span>
                  <span>AES-256 Encrypted</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="px-6 py-4 bg-white/5 rounded-3xl flex items-center gap-4 border border-white/5">
                <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-300">Arsip Laporan SPT 2025 Tersedia</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Entry Point Application ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');

  // Simple Router — FIX: return and JSX must be on the SAME line
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      default:
        return <LoginPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="antialiased text-slate-200">
      {renderPage()}
    </div>
  );
}
