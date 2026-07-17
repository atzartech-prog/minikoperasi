const INITIAL_MEMBERS = [
  {
    id: "m-1",
    noAnggota: "KOP-001",
    nama: "Ahmad Subarjo",
    alamat: "Jl. Merdeka No. 45, Jakarta",
    telepon: "081234567890",
    tanggalBergabung: "2025-01-15",
    status: "Aktif"
  },
  {
    id: "m-2",
    noAnggota: "KOP-002",
    nama: "Siti Rahmawati",
    alamat: "Jl. Mawar Gg. 3 No. 12, Bandung",
    telepon: "082345678901",
    tanggalBergabung: "2025-02-10",
    status: "Aktif"
  },
  {
    id: "m-3",
    noAnggota: "KOP-003",
    nama: "Budi Santoso",
    alamat: "Jl. Sudirman Kav. 21, Surabaya",
    telepon: "085678901234",
    tanggalBergabung: "2025-03-01",
    status: "Aktif"
  },
  {
    id: "m-4",
    noAnggota: "KOP-004",
    nama: "Dewi Lestari",
    alamat: "Jl. Diponegoro No. 8, Yogyakarta",
    telepon: "087890123456",
    tanggalBergabung: "2025-05-20",
    status: "Aktif"
  },
  {
    id: "m-5",
    noAnggota: "KOP-005",
    nama: "Eko Prasetyo",
    alamat: "Jl. Gatot Subroto No. 99, Semarang",
    telepon: "089012345678",
    tanggalBergabung: "2025-06-02",
    status: "Nonaktif"
  }
];

const INITIAL_SAVINGS = [
  // Ahmad Subarjo
  { id: "s-1", anggotaId: "m-1", tanggal: "2025-01-15", jenis: "Pokok", jumlah: 500000, tipe: "Setoran", keterangan: "Simpanan awal keanggotaan" },
  { id: "s-2", anggotaId: "m-1", tanggal: "2025-02-15", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Februari" },
  { id: "s-3", anggotaId: "m-1", tanggal: "2025-03-15", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Maret" },
  { id: "s-4", anggotaId: "m-1", tanggal: "2025-03-20", jenis: "Sukarela", jumlah: 200000, tipe: "Setoran", keterangan: "Tabungan sukarela" },
  { id: "s-5", anggotaId: "m-1", tanggal: "2025-04-15", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib April" },
  { id: "s-6", anggotaId: "m-1", tanggal: "2025-05-15", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Mei" },
  { id: "s-7", anggotaId: "m-1", tanggal: "2025-06-15", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Juni" },
  { id: "s-8", anggotaId: "m-1", tanggal: "2025-07-01", jenis: "Sukarela", jumlah: 100000, tipe: "Penarikan", keterangan: "Keperluan mendesak" },

  // Siti Rahmawati
  { id: "s-9", anggotaId: "m-2", tanggal: "2025-02-10", jenis: "Pokok", jumlah: 500000, tipe: "Setoran", keterangan: "Simpanan awal keanggotaan" },
  { id: "s-10", anggotaId: "m-2", tanggal: "2025-03-10", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Maret" },
  { id: "s-11", anggotaId: "m-2", tanggal: "2025-04-10", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib April" },
  { id: "s-12", anggotaId: "m-2", tanggal: "2025-04-12", jenis: "Sukarela", jumlah: 1500000, tipe: "Setoran", keterangan: "Hasil bonus kerja" },
  { id: "s-13", anggotaId: "m-2", tanggal: "2025-05-10", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Mei" },
  { id: "s-14", anggotaId: "m-2", tanggal: "2025-06-10", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Juni" },
  { id: "s-15", anggotaId: "m-2", tanggal: "2025-07-10", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Juli" },

  // Budi Santoso
  { id: "s-16", anggotaId: "m-3", tanggal: "2025-03-01", jenis: "Pokok", jumlah: 500000, tipe: "Setoran", keterangan: "Simpanan awal keanggotaan" },
  { id: "s-17", anggotaId: "m-3", tanggal: "2025-04-01", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib April" },
  { id: "s-18", anggotaId: "m-3", tanggal: "2025-05-01", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Mei" },
  { id: "s-19", anggotaId: "m-3", tanggal: "2025-06-01", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Juni" },
  { id: "s-20", anggotaId: "m-3", tanggal: "2025-07-01", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Juli" },

  // Dewi Lestari
  { id: "s-21", anggotaId: "m-4", tanggal: "2025-05-20", jenis: "Pokok", jumlah: 500000, tipe: "Setoran", keterangan: "Simpanan awal keanggotaan" },
  { id: "s-22", anggotaId: "m-4", tanggal: "2025-06-20", jenis: "Wajib", jumlah: 50000, tipe: "Setoran", keterangan: "Simpanan wajib Juni" },
  { id: "s-23", anggotaId: "m-4", tanggal: "2025-07-10", jenis: "Sukarela", jumlah: 800000, tipe: "Setoran", keterangan: "Simpanan sukarela mandiri" },

  // Eko Prasetyo
  { id: "s-24", anggotaId: "m-5", tanggal: "2025-06-02", jenis: "Pokok", jumlah: 500000, tipe: "Setoran", keterangan: "Simpanan awal keanggotaan" }
];

const INITIAL_LOANS = [
  {
    id: "l-1",
    anggotaId: "m-1",
    tanggal: "2025-02-20",
    jumlah: 5000000,
    bunga: 1.5, // 1.5% per bulan
    durasi: 10, // 10 bulan
    angsuranBulanan: 575000, // (5.000.000 / 10) + (5.000.000 * 1.5%) = 500.000 + 75.000 = 575.000
    totalWajibBayar: 5750000,
    jumlahDibayar: 2875000, // 5 bulan angsuran dibayar
    status: "Aktif",
    keterangan: "Modal Usaha Sembako"
  },
  {
    id: "l-2",
    anggotaId: "m-3",
    tanggal: "2025-04-05",
    jumlah: 10000000,
    bunga: 1.2, // 1.2% per bulan
    durasi: 12, // 12 bulan
    angsuranBulanan: 953333, // 833.333 + 120.000 = 953.333
    totalWajibBayar: 11440000,
    jumlahDibayar: 2860000, // 3 bulan angsuran
    status: "Aktif",
    keterangan: "Renovasi Rumah"
  },
  {
    id: "l-3",
    anggotaId: "m-4",
    tanggal: "2025-07-02",
    jumlah: 3000000,
    bunga: 2.0,
    durasi: 6,
    angsuranBulanan: 560000, // 500.000 + 60.000 = 560.000
    totalWajibBayar: 3360000,
    jumlahDibayar: 0,
    status: "Pengajuan",
    keterangan: "Biaya Pendidikan Anak"
  }
];

const INITIAL_REPAYMENTS = [
  // Repayments for Loan l-1 (Ahmad Subarjo)
  { id: "r-1", pinjamanId: "l-1", tanggal: "2025-03-20", jumlah: 575000, denda: 0, keterangan: "Angsuran ke-1" },
  { id: "r-2", pinjamanId: "l-1", tanggal: "2025-04-20", jumlah: 575000, denda: 0, keterangan: "Angsuran ke-2" },
  { id: "r-3", pinjamanId: "l-1", tanggal: "2025-05-20", jumlah: 575000, denda: 0, keterangan: "Angsuran ke-3" },
  { id: "r-4", pinjamanId: "l-1", tanggal: "2025-06-20", jumlah: 575000, denda: 0, keterangan: "Angsuran ke-4" },
  { id: "r-5", pinjamanId: "l-1", tanggal: "2025-07-20", jumlah: 575000, denda: 0, keterangan: "Angsuran ke-5" },

  // Repayments for Loan l-2 (Budi Santoso)
  { id: "r-6", pinjamanId: "l-2", tanggal: "2025-05-05", jumlah: 953333, denda: 0, keterangan: "Angsuran ke-1" },
  { id: "r-7", pinjamanId: "l-2", tanggal: "2025-06-05", jumlah: 953333, denda: 0, keterangan: "Angsuran ke-2" },
  { id: "r-8", pinjamanId: "l-2", tanggal: "2025-07-05", jumlah: 953333, denda: 25000, keterangan: "Angsuran ke-3 (Terlambat 2 hari)" }
];

window.INITIAL_MEMBERS = INITIAL_MEMBERS;
window.INITIAL_SAVINGS = INITIAL_SAVINGS;
window.INITIAL_LOANS = INITIAL_LOANS;
window.INITIAL_REPAYMENTS = INITIAL_REPAYMENTS;
