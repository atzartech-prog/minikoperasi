// Koperasi Keuangan App - Core Script
document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE WRAPPER & STATE ---
  const DB = {
    get: (key, defaultVal) => {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    },
    set: (key, val) => {
      localStorage.setItem(key, JSON.stringify(val));
    }
  };

  // State elements
  let members = [];
  let savings = [];
  let loans = [];
  let repayments = [];
  let settings = {};

  // Default Settings
  const DEFAULT_SETTINGS = {
    coopName: "Koperasi Artha Mulia",
    initialCash: 100000000,
    simpananPokok: 500000,
    simpananWajib: 50000,
    defaultBunga: 1.5
  };

  // Initialize DB from LocalStorage or Dummy Data
  function initDatabase(forceReset = false) {
    if (forceReset || !localStorage.getItem("koperasi_members")) {
      DB.set("koperasi_members", window.INITIAL_MEMBERS || []);
      DB.set("koperasi_savings", window.INITIAL_SAVINGS || []);
      DB.set("koperasi_loans", window.INITIAL_LOANS || []);
      DB.set("koperasi_repayments", window.INITIAL_REPAYMENTS || []);
      DB.set("koperasi_settings", DEFAULT_SETTINGS);
      showToast("Database berhasil diinisialisasi dengan data demo!", "success");
    }

    members = DB.get("koperasi_members", []);
    savings = DB.get("koperasi_savings", []);
    loans = DB.get("koperasi_loans", []);
    repayments = DB.get("koperasi_repayments", []);
    settings = DB.get("koperasi_settings", DEFAULT_SETTINGS);

    // Apply settings values to form
    const settingsCoopName = document.getElementById("settings-coop-name");
    const settingsInitialCash = document.getElementById("settings-initial-cash");
    const settingsSimpananPokok = document.getElementById("settings-simpanan-pokok");
    const settingsSimpananWajib = document.getElementById("settings-simpanan-wajib");
    const settingsDefaultBunga = document.getElementById("settings-default-bunga");
    
    if (settingsCoopName) settingsCoopName.value = settings.coopName;
    if (settingsInitialCash) settingsInitialCash.value = settings.initialCash;
    if (settingsSimpananPokok) settingsSimpananPokok.value = settings.simpananPokok;
    if (settingsSimpananWajib) settingsSimpananWajib.value = settings.simpananWajib;
    if (settingsDefaultBunga) settingsDefaultBunga.value = settings.defaultBunga;

    // Update Brand Name
    document.querySelector(".brand-name").textContent = settings.coopName;
  }

  // Save State to LocalStorage
  function saveState() {
    DB.set("koperasi_members", members);
    DB.set("koperasi_savings", savings);
    DB.set("koperasi_loans", loans);
    DB.set("koperasi_repayments", repayments);
    DB.set("koperasi_settings", settings);
  }

  // Initialize
  initDatabase();

  // --- HELPERS ---
  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).slice(0, 3).join("").toUpperCase() : "USR";
  };

  // Toast Notification
  function showToast(message, type = "info") {
    const wrapper = document.getElementById("toast-wrapper");
    if (!wrapper) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";
    if (type === "danger") icon = "fa-exclamation-circle";

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div class="toast-message">${message}</div>
      <i class="fa-solid fa-xmark toast-close"></i>
    `;
    wrapper.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  // --- SPA ROUTING ---
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  const sections = document.querySelectorAll(".view-section");
  const viewTitle = document.getElementById("current-view-title");
  const viewSubtitle = document.getElementById("current-view-subtitle");

  const viewsConfig = {
    dashboard: { title: "Dashboard Keuangan", subtitle: "Ringkasan aktivitas dan grafik performa koperasi" },
    anggota: { title: "Daftar Anggota Koperasi", subtitle: "Manajemen keanggotaan, data diri, dan status rekening" },
    simpanan: { title: "Transaksi Simpanan", subtitle: "Catatan setoran awal (pokok), wajib bulanan, dan simpanan sukarela" },
    pinjaman: { title: "Sistem Pinjaman & Angsuran", subtitle: "Pengajuan pembiayaan baru dan monitoring cicilan anggota" },
    laporan: { title: "Laporan Keuangan Koperasi", subtitle: "Arus kas buku jurnal, mutasi kas, SHU, ekspor data, & cetak laporan" },
    pengaturan: { title: "Pengaturan & Konfigurasi", subtitle: "Kustomisasi sistem koperasi, reset data, backup & restore database" }
  };

  function switchView(viewName) {
    sidebarItems.forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    sections.forEach(sec => {
      if (sec.id === `view-${viewName}`) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    // Update Title/Subtitle
    if (viewsConfig[viewName]) {
      viewTitle.textContent = viewsConfig[viewName].title;
      viewSubtitle.textContent = viewsConfig[viewName].subtitle;
    }

    // Trigger specific render functions
    if (viewName === "dashboard") renderDashboard();
    if (viewName === "anggota") renderAnggota();
    if (viewName === "simpanan") renderSimpanan();
    if (viewName === "pinjaman") renderPinjaman();
    if (viewName === "laporan") renderLaporan();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar if open
    document.getElementById("app-sidebar").classList.remove("active");
  }

  sidebarItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = item.getAttribute("data-view");
      switchView(viewName);
    });
  });

  // Mobile menu toggle
  document.getElementById("sidebar-toggle").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.toggle("active");
  });

  // --- CALCULATION UTILITIES ---

  // Get single member's savings summary
  function getMemberSavings(memberId) {
    const memberSavings = savings.filter(s => s.anggotaId === memberId);
    let pokok = 0, wajib = 0, sukarela = 0;
    
    memberSavings.forEach(s => {
      const amount = Number(s.jumlah);
      if (s.tipe === "Setoran") {
        if (s.jenis === "Pokok") pokok += amount;
        else if (s.jenis === "Wajib") wajib += amount;
        else if (s.jenis === "Sukarela") sukarela += amount;
      } else { // Penarikan
        if (s.jenis === "Sukarela") sukarela -= amount;
      }
    });

    return {
      pokok,
      wajib,
      sukarela,
      total: pokok + wajib + sukarela
    };
  }

  // Get single member's active loan summary
  function getMemberActiveLoan(memberId) {
    // Find loans that are not settled (not "Lunas" and not "Pengajuan")
    const active = loans.filter(l => l.anggotaId === memberId && (l.status === "Aktif" || l.status === "Terlambat"));
    if (active.length === 0) return null;
    return active[0]; // Koperasi usually allows 1 active loan at a time
  }

  // --- RENDER 1: DASHBOARD ---
  let mainChartInstance = null;
  let distChartInstance = null;

  function renderDashboard() {
    // Calculations
    const totalMembers = members.length;
    
    // Total savings
    let totalSavingsSetor = savings.filter(s => s.tipe === "Setoran").reduce((sum, s) => sum + Number(s.jumlah), 0);
    let totalSavingsTarik = savings.filter(s => s.tipe === "Penarikan").reduce((sum, s) => sum + Number(s.jumlah), 0);
    const totalSavingsVal = totalSavingsSetor - totalSavingsTarik;

    // Total loans disbursed
    const totalLoansDisbursed = loans
      .filter(l => l.status === "Aktif" || l.status === "Lunas" || l.status === "Terlambat")
      .reduce((sum, l) => sum + Number(l.jumlah), 0);

    // Total Repayments & Denda
    const totalRepayments = repayments.reduce((sum, r) => sum + Number(r.jumlah), 0);
    const totalDenda = repayments.reduce((sum, r) => sum + Number(r.denda || 0), 0);

    // Active loans outstanding = sum of (totalWajibBayar - jumlahDibayar) for active/late loans
    const activeLoansOutstanding = loans
      .filter(l => l.status === "Aktif" || l.status === "Terlambat")
      .reduce((sum, l) => sum + (Number(l.totalWajibBayar) - Number(l.jumlahDibayar)), 0);

    // Cash balance = Initial Cash + Savings In - Savings Out - Loans Out + Repayments In + Denda In
    const totalKasVal = Number(settings.initialCash) + totalSavingsSetor - totalSavingsTarik - totalLoansDisbursed + totalRepayments + totalDenda;

    // Update stats text
    document.getElementById("stat-total-kas").textContent = formatRupiah(totalKasVal);
    document.getElementById("stat-total-simpanan").textContent = formatRupiah(totalSavingsVal);
    document.getElementById("stat-total-pinjaman").textContent = formatRupiah(activeLoansOutstanding);
    document.getElementById("stat-total-anggota").textContent = `${totalMembers} Org`;

    // Render Recent Activities Table
    // Combines Savings, Loans, and Repayments
    let activities = [];

    savings.forEach(s => {
      const m = members.find(mem => mem.id === s.anggotaId);
      activities.push({
        tanggal: s.tanggal,
        id: s.id,
        nama: m ? m.nama : "Anggota dihapus",
        jenis: `Simpanan ${s.jenis}`,
        tipe: s.tipe,
        jumlah: s.jumlah,
        keterangan: s.keterangan
      });
    });

    loans.forEach(l => {
      const m = members.find(mem => mem.id === l.anggotaId);
      activities.push({
        tanggal: l.tanggal,
        id: l.id,
        nama: m ? m.nama : "Anggota dihapus",
        jenis: `Pengajuan Pinjaman`,
        tipe: `Pengeluaran`,
        jumlah: l.jumlah,
        keterangan: `${l.keterangan} (${l.status})`
      });
    });

    repayments.forEach(r => {
      const l = loans.find(loan => loan.id === r.pinjamanId);
      const m = l ? members.find(mem => mem.id === l.anggotaId) : null;
      activities.push({
        tanggal: r.tanggal,
        id: r.id,
        nama: m ? m.nama : "Anggota dihapus",
        jenis: `Angsuran Pinjaman`,
        tipe: `Setoran`,
        jumlah: r.jumlah + (r.denda || 0),
        keterangan: r.keterangan + (r.denda ? ` (Denda: ${formatRupiah(r.denda)})` : "")
      });
    });

    // Sort: Newest first
    activities.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Display Top 5
    const recentTbody = document.getElementById("dashboard-recent-transactions-tbody");
    recentTbody.innerHTML = "";
    
    activities.slice(0, 5).forEach(act => {
      const isDeposit = act.tipe === "Setoran";
      const isWithdraw = act.tipe === "Penarikan";
      const isLoanDisburse = act.jenis === "Pengajuan Pinjaman";

      let typeBadge = "";
      if (isDeposit) {
        typeBadge = `<span class="badge badge-success"><i class="fa-solid fa-circle-arrow-down"></i> Masuk</span>`;
      } else if (isWithdraw) {
        typeBadge = `<span class="badge badge-danger"><i class="fa-solid fa-circle-arrow-up"></i> Keluar</span>`;
      } else if (isLoanDisburse) {
        typeBadge = `<span class="badge badge-warning"><i class="fa-solid fa-handshake"></i> Kredit</span>`;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDate(act.tanggal)}</td>
        <td><strong>${act.id.toUpperCase()}</strong></td>
        <td>${act.nama}</td>
        <td>${act.jenis}</td>
        <td>${typeBadge}</td>
        <td style="font-weight: 700; color: ${isDeposit ? 'var(--color-success)' : 'var(--color-danger)'}">
          ${isDeposit ? '+' : '-'}${formatRupiah(act.jumlah)}
        </td>
        <td><span style="font-size: 12px; color: var(--color-text-muted);">${act.keterangan}</span></td>
      `;
      recentTbody.appendChild(tr);
    });

    if (recentTbody.innerHTML === "") {
      recentTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted);">Belum ada riwayat transaksi.</td></tr>`;
    }

    // --- CHARTS GENERATION ---
    const monthsName = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const currentYear = 2025; // Base year of dummy data

    // Group savings and loans monthly
    const monthlySavings = Array(12).fill(0);
    const monthlyLoans = Array(12).fill(0);

    savings.forEach(s => {
      const d = new Date(s.tanggal);
      if (d.getFullYear() === currentYear) {
        const m = d.getMonth();
        if (s.tipe === "Setoran") {
          monthlySavings[m] += Number(s.jumlah);
        } else {
          monthlySavings[m] -= Number(s.jumlah);
        }
      }
    });

    loans.forEach(l => {
      const d = new Date(l.tanggal);
      if (d.getFullYear() === currentYear && (l.status === "Aktif" || l.status === "Lunas" || l.status === "Terlambat")) {
        const m = d.getMonth();
        monthlyLoans[m] += Number(l.jumlah);
      }
    });

    // Destroy existing charts to prevent canvas ghosting
    if (mainChartInstance) mainChartInstance.destroy();
    if (distChartInstance) distChartInstance.destroy();

    const chartFilterMonths = Number(document.getElementById("dashboard-chart-filter").value);
    const slicedLabels = monthsName.slice(0, chartFilterMonths);
    const slicedSavings = monthlySavings.slice(0, chartFilterMonths);
    const slicedLoans = monthlyLoans.slice(0, chartFilterMonths);

    // Main Chart (Savings vs Loans Line Chart)
    const ctxMain = document.getElementById("dashboard-main-chart").getContext("2d");
    const isLightTheme = document.body.classList.contains("light-theme");
    const gridColor = isLightTheme ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
    const labelColor = isLightTheme ? "#475569" : "#94a3b8";

    mainChartInstance = new Chart(ctxMain, {
      type: 'line',
      data: {
        labels: slicedLabels,
        datasets: [
          {
            label: 'Simpanan Masuk (Neto)',
            data: slicedSavings,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Pinjaman Disalurkan',
            data: slicedLoans,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: labelColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { family: 'Plus Jakarta Sans' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: labelColor,
              font: { family: 'Plus Jakarta Sans' },
              callback: (value) => formatRupiah(value).replace(/Rp\s?/, '')
            }
          }
        }
      }
    });

    // Distribution Doughnut Chart
    let totalPokok = 0, totalWajib = 0, totalSukarela = 0;
    savings.forEach(s => {
      const amount = Number(s.jumlah);
      if (s.tipe === "Setoran") {
        if (s.jenis === "Pokok") totalPokok += amount;
        else if (s.jenis === "Wajib") totalWajib += amount;
        else if (s.jenis === "Sukarela") totalSukarela += amount;
      } else {
        if (s.jenis === "Sukarela") totalSukarela -= amount;
      }
    });

    const ctxDist = document.getElementById("dashboard-distribution-chart").getContext("2d");
    distChartInstance = new Chart(ctxDist, {
      type: 'doughnut',
      data: {
        labels: ['Pokok', 'Wajib', 'Sukarela'],
        datasets: [{
          data: [totalPokok, totalWajib, totalSukarela],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
          borderWidth: 2,
          borderColor: isLightTheme ? '#ffffff' : '#0f172a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: labelColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
          }
        }
      }
    });
  }

  // Bind chart filter changes
  document.getElementById("dashboard-chart-filter").addEventListener("change", renderDashboard);
  document.getElementById("btn-view-all-transactions").addEventListener("click", () => {
    switchView("laporan");
  });

  // --- RENDER 2: ANGGOTA (MEMBERS) ---
  function renderAnggota() {
    const searchVal = document.getElementById("anggota-search").value.toLowerCase();
    const statusVal = document.getElementById("anggota-filter-status").value;

    const tbody = document.getElementById("anggota-table-tbody");
    tbody.innerHTML = "";

    const filtered = members.filter(m => {
      const matchSearch = m.nama.toLowerCase().includes(searchVal) || m.noAnggota.toLowerCase().includes(searchVal);
      const matchStatus = statusVal === "Semua" || m.status === statusVal;
      return matchSearch && matchStatus;
    });

    filtered.forEach(m => {
      const savInfo = getMemberSavings(m.id);
      const activeLoan = getMemberActiveLoan(m.id);

      let loanBadge = `<span class="badge badge-success">Tidak Ada</span>`;
      if (activeLoan) {
        const remaining = activeLoan.totalWajibBayar - activeLoan.jumlahDibayar;
        loanBadge = `<span class="badge ${activeLoan.status === 'Terlambat' ? 'badge-danger' : 'badge-warning'}">
          Active: ${formatRupiah(remaining)}
        </span>`;
      }

      const isStatusAktif = m.status === "Aktif";
      const statusBadge = `<span class="badge ${isStatusAktif ? 'badge-success' : 'badge-danger'}">${m.status}</span>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${m.noAnggota}</strong></td>
        <td>
          <div style="font-weight:600;">${m.nama}</div>
          <div style="font-size:11px; color:var(--color-text-muted);">${m.alamat.substring(0, 30)}...</div>
        </td>
        <td>${m.telepon}</td>
        <td>${formatDate(m.tanggalBergabung)}</td>
        <td style="font-weight:600; color:var(--color-success);">${formatRupiah(savInfo.total)}</td>
        <td>${loanBadge}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="card-actions">
            <button class="btn btn-secondary btn-icon" title="Detail Anggota" onclick="viewMemberDetail('${m.id}')">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-primary btn-icon" title="Edit Anggota" onclick="editMember('${m.id}')">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="btn btn-danger btn-icon" title="Hapus Anggota" onclick="deleteMember('${m.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--color-text-muted);">Data anggota tidak ditemukan.</td></tr>`;
    }
  }

  // Filter Event Listeners
  document.getElementById("anggota-search").addEventListener("input", renderAnggota);
  document.getElementById("anggota-filter-status").addEventListener("change", renderAnggota);

  // --- RENDER 3: SIMPANAN ---
  function renderSimpanan() {
    const searchVal = document.getElementById("simpanan-search").value.toLowerCase();
    const jenisVal = document.getElementById("simpanan-filter-jenis").value;

    const tbody = document.getElementById("simpanan-table-tbody");
    tbody.innerHTML = "";

    // Map list of savings with member details
    const mapped = savings.map(s => {
      const mem = members.find(m => m.id === s.anggotaId);
      return {
        ...s,
        namaAnggota: mem ? mem.nama : "Tidak Ditemukan",
        noAnggota: mem ? mem.noAnggota : "-"
      };
    });

    const filtered = mapped.filter(s => {
      const matchSearch = s.namaAnggota.toLowerCase().includes(searchVal) || s.noAnggota.toLowerCase().includes(searchVal) || s.keterangan.toLowerCase().includes(searchVal);
      const matchJenis = jenisVal === "Semua" || s.jenis === jenisVal;
      return matchSearch && matchJenis;
    });

    // Sort newest first
    filtered.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

    filtered.forEach(s => {
      const isDeposit = s.tipe === "Setoran";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDate(s.tanggal)}</td>
        <td><strong>${s.noAnggota}</strong></td>
        <td>${s.namaAnggota}</td>
        <td>Simpanan ${s.jenis}</td>
        <td>
          <span class="badge ${isDeposit ? 'badge-success' : 'badge-danger'}">
            ${isDeposit ? 'Setoran' : 'Penarikan'}
          </span>
        </td>
        <td style="font-weight: 700; color: ${isDeposit ? 'var(--color-success)' : 'var(--color-danger)'}">
          ${isDeposit ? '+' : '-'}${formatRupiah(s.jumlah)}
        </td>
        <td>${s.keterangan}</td>
        <td>
          <button class="btn btn-danger btn-icon" title="Hapus Transaksi" onclick="deleteSavingsTransaction('${s.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--color-text-muted);">Data transaksi simpanan tidak ditemukan.</td></tr>`;
    }
  }

  document.getElementById("simpanan-search").addEventListener("input", renderSimpanan);
  document.getElementById("simpanan-filter-jenis").addEventListener("change", renderSimpanan);

  // --- RENDER 4: PINJAMAN ---
  function renderPinjaman() {
    const searchVal = document.getElementById("pinjaman-search").value.toLowerCase();
    const statusVal = document.getElementById("pinjaman-filter-status").value;

    const tbody = document.getElementById("pinjaman-table-tbody");
    tbody.innerHTML = "";

    const mapped = loans.map(l => {
      const mem = members.find(m => m.id === l.anggotaId);
      return {
        ...l,
        namaAnggota: mem ? mem.nama : "Tidak Ditemukan"
      };
    });

    const filtered = mapped.filter(l => {
      const matchSearch = l.namaAnggota.toLowerCase().includes(searchVal);
      const matchStatus = statusVal === "Semua" || l.status === statusVal;
      return matchSearch && matchStatus;
    });

    filtered.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

    filtered.forEach(l => {
      const remaining = l.status === "Pengajuan" ? l.jumlah : (l.totalWajibBayar - l.jumlahDibayar);
      
      let statusBadge = "";
      if (l.status === "Pengajuan") statusBadge = `<span class="badge badge-info">Pengajuan</span>`;
      else if (l.status === "Aktif") statusBadge = `<span class="badge badge-warning">Aktif</span>`;
      else if (l.status === "Lunas") statusBadge = `<span class="badge badge-success">Lunas</span>`;
      else if (l.status === "Terlambat") statusBadge = `<span class="badge badge-danger">Terlambat</span>`;

      // Aksi Button
      let actionBtn = "";
      if (l.status === "Pengajuan") {
        actionBtn = `
          <button class="btn btn-success btn-icon" title="Setujui & Cairkan" onclick="approveLoan('${l.id}')">
            <i class="fa-solid fa-circle-check"></i> Setujui
          </button>
          <button class="btn btn-danger btn-icon" title="Tolak Pengajuan" onclick="rejectLoan('${l.id}')">
            <i class="fa-solid fa-circle-xmark"></i> Tolak
          </button>
        `;
      } else if (l.status === "Aktif" || l.status === "Terlambat") {
        actionBtn = `
          <button class="btn btn-success btn-icon" title="Bayar Angsuran" onclick="openRepaymentModal('${l.id}')">
            <i class="fa-solid fa-receipt"></i> Angsuran
          </button>
        `;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDate(l.tanggal)}</td>
        <td>
          <div style="font-weight:600;">${l.namaAnggota}</div>
          <div style="font-size:11px; color:var(--color-text-muted);">${l.keterangan}</div>
        </td>
        <td style="font-weight:600;">${formatRupiah(l.jumlah)}</td>
        <td>
          <div>${l.bunga}% / bulan</div>
          <div style="font-size:11px; color:var(--color-text-muted);">${l.durasi} Bulan</div>
        </td>
        <td style="font-weight:600; color:var(--color-warning);">${formatRupiah(l.angsuranBulanan)}</td>
        <td style="font-weight:700; color:${l.status === 'Lunas' ? 'var(--color-success)' : 'var(--color-danger)'}">
          ${formatRupiah(remaining)}
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="card-actions">
            ${actionBtn}
            <button class="btn btn-secondary btn-icon" title="Detail Riwayat" onclick="viewLoanDetail('${l.id}')">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--color-text-muted);">Data pinjaman tidak ditemukan.</td></tr>`;
    }
  }

  document.getElementById("pinjaman-search").addEventListener("input", renderPinjaman);
  document.getElementById("pinjaman-filter-status").addEventListener("change", renderPinjaman);

  // --- RENDER 5: LAPORAN KEUANGAN & MUTASI BUKU KAS ---
  function renderLaporan() {
    const startDateVal = document.getElementById("report-start-date").value;
    const endDateVal = document.getElementById("report-end-date").value;

    const tbody = document.getElementById("report-table-tbody");
    tbody.innerHTML = "";

    // Generate chronological history of cash flow
    const entries = [];

    // 1. Initial balance
    const startCash = Number(settings.initialCash);

    // 2. Savings entries
    savings.forEach(s => {
      const mem = members.find(m => m.id === s.anggotaId);
      entries.push({
        tanggal: s.tanggal,
        uraian: `Setoran Simpanan ${s.jenis} - ${mem ? mem.noAnggota : ''}`,
        nama: mem ? mem.nama : "Dihapus",
        debit: s.tipe === "Setoran" ? Number(s.jumlah) : 0,
        kredit: s.tipe === "Penarikan" ? Number(s.jumlah) : 0,
        kategori: "Simpanan",
        id: s.id
      });
    });

    // 3. Approved Loans (loans that are approved, actively running or paid)
    loans.forEach(l => {
      if (l.status === "Aktif" || l.status === "Lunas" || l.status === "Terlambat") {
        const mem = members.find(m => m.id === l.anggotaId);
        entries.push({
          tanggal: l.tanggal,
          uraian: `Penyaluran Pinjaman - Kontrak ${l.id.toUpperCase()}`,
          nama: mem ? mem.nama : "Dihapus",
          debit: 0,
          kredit: Number(l.jumlah),
          kategori: "Pinjaman Keluar",
          id: l.id
        });
      }
    });

    // 4. Repayments (Angsuran + Denda)
    repayments.forEach(r => {
      const l = loans.find(loan => loan.id === r.pinjamanId);
      const mem = l ? members.find(m => m.id === l.anggotaId) : null;
      entries.push({
        tanggal: r.tanggal,
        uraian: `${r.keterangan} - Kontrak ${l ? l.id.toUpperCase() : ''}`,
        nama: mem ? mem.nama : "Dihapus",
        debit: Number(r.jumlah) + Number(r.denda || 0),
        kredit: 0,
        kategori: "Angsuran",
        id: r.id
      });
    });

    // Sort chronologically (oldest first for running balance calculation)
    entries.sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);
      if (dateA - dateB !== 0) return dateA - dateB;
      return a.id.localeCompare(b.id);
    });

    // Filter by date if specified
    const filteredEntries = entries.filter(e => {
      const date = new Date(e.tanggal);
      let matchStart = true;
      let matchEnd = true;
      if (startDateVal) matchStart = date >= new Date(startDateVal);
      if (endDateVal) matchEnd = date <= new Date(endDateVal);
      return matchStart && matchEnd;
    });

    // Reset date range print subtitle
    const printRange = document.getElementById("print-date-range");
    if (startDateVal || endDateVal) {
      printRange.textContent = `Periode: ${startDateVal ? formatDate(startDateVal) : 'Awal'} s.d ${endDateVal ? formatDate(endDateVal) : 'Akhir'}`;
    } else {
      printRange.textContent = "Periode: Semua Transaksi";
    }

    // Recalculate totals
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalRevenueFromInterest = 0; // revenue generated from repayments interest share

    // Loop through all chronological entries to compute running balance
    let runningBalance = startCash;
    
    // Add row for Initial Cash
    const trStart = document.createElement("tr");
    trStart.innerHTML = `
      <td>-</td>
      <td><strong>Saldo Modal Kas Awal Koperasi</strong></td>
      <td>-</td>
      <td style="color:var(--color-success); font-weight:600;">${formatRupiah(startCash)}</td>
      <td>-</td>
      <td style="font-weight:700;">${formatRupiah(startCash)}</td>
      <td><span class="badge badge-info">Modal</span></td>
    `;
    tbody.appendChild(trStart);

    entries.forEach(e => {
      // Calculate running balance
      runningBalance = runningBalance + e.debit - e.kredit;
      e.runningBalance = runningBalance;
    });

    // Renders filtered entries
    filteredEntries.forEach(e => {
      totalInflow += e.debit;
      totalOutflow += e.kredit;

      let categoryBadge = "";
      if (e.kategori === "Simpanan") categoryBadge = `<span class="badge badge-success">Simpanan</span>`;
      else if (e.kategori === "Pinjaman Keluar") categoryBadge = `<span class="badge badge-danger">Disbursal</span>`;
      else if (e.kategori === "Angsuran") categoryBadge = `<span class="badge badge-warning">Angsuran</span>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDate(e.tanggal)}</td>
        <td>${e.uraian}</td>
        <td>${e.nama}</td>
        <td style="color: var(--color-success); font-weight:600;">${e.debit > 0 ? formatRupiah(e.debit) : '-'}</td>
        <td style="color: var(--color-danger); font-weight:600;">${e.kredit > 0 ? formatRupiah(e.kredit) : '-'}</td>
        <td style="font-weight:700;">${formatRupiah(e.runningBalance)}</td>
        <td>${categoryBadge}</td>
      `;
      tbody.appendChild(tr);
    });

    // Compute revenue from interest & penalty portion
    // For repayments, interest earned = (RepaymentAmount - Denda) * (BungaPerBulan / InstallmentPerBulan)
    repayments.forEach(r => {
      const l = loans.find(loan => loan.id === r.pinjamanId);
      if (l) {
        const bungaSatuBulan = l.jumlah * (l.bunga / 100);
        // Ratio of interest relative to monthly payment
        const ratio = bungaSatuBulan / l.angsuranBulanan;
        const interestShare = (r.jumlah) * ratio;
        totalRevenueFromInterest += interestShare;
      }
      totalRevenueFromInterest += (r.denda || 0); // Penalties go 100% into cooperative revenue
    });

    // Show stats in reports view
    document.getElementById("report-total-inflow").textContent = formatRupiah(totalInflow);
    document.getElementById("report-total-outflow").textContent = formatRupiah(totalOutflow);
    document.getElementById("report-total-revenue").textContent = formatRupiah(totalRevenueFromInterest);
    
    // SHU is interest revenue + penalties (operational cooperative revenue)
    document.getElementById("report-shu").textContent = formatRupiah(totalRevenueFromInterest);

    if (filteredEntries.length === 0) {
      tbody.innerHTML += `<tr><td colspan="7" style="text-align:center; color:var(--color-text-muted);">Tidak ada mutasi kas untuk periode ini.</td></tr>`;
    }
  }

  document.getElementById("btn-filter-report").addEventListener("click", renderLaporan);
  
  // Print functionality
  document.getElementById("btn-print-report").addEventListener("click", () => {
    window.print();
  });

  // Export to CSV
  document.getElementById("btn-export-csv").addEventListener("click", () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tanggal;Uraian;Nama Anggota;Debit (Masuk);Kredit (Keluar);Kategori\r\n";
    
    // Get financial data
    const entries = [];
    savings.forEach(s => {
      const mem = members.find(m => m.id === s.anggotaId);
      entries.push([s.tanggal, `Simpanan ${s.jenis}`, mem ? mem.nama : "Dihapus", s.tipe === "Setoran" ? s.jumlah : 0, s.tipe === "Penarikan" ? s.jumlah : 0, "Simpanan"]);
    });

    loans.forEach(l => {
      if (l.status !== "Pengajuan") {
        const mem = members.find(m => m.id === l.anggotaId);
        entries.push([l.tanggal, `Penyaluran Pinjaman ${l.id}`, mem ? mem.nama : "Dihapus", 0, l.jumlah, "Pinjaman"]);
      }
    });

    repayments.forEach(r => {
      const l = loans.find(loan => loan.id === r.pinjamanId);
      const mem = l ? members.find(m => m.id === l.anggotaId) : null;
      entries.push([r.tanggal, r.keterangan, mem ? mem.nama : "Dihapus", r.jumlah + (r.denda || 0), 0, "Angsuran"]);
    });

    entries.sort((a, b) => new Date(a[0]) - new Date(b[0]));

    entries.forEach(rowArray => {
      let row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kas_Koperasi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Berkas CSV berhasil diunduh!", "success");
  });

  // --- MODALS OPEN/CLOSE ACTIONS ---

  function openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
  }

  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  }

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close");
      closeModal(modalId);
    });
  });

  // --- MEMBER FORM ACTIONS ---
  
  document.getElementById("btn-add-anggota").addEventListener("click", () => {
    document.getElementById("modal-anggota-title").textContent = "Registrasi Anggota Baru";
    document.getElementById("form-anggota").reset();
    document.getElementById("anggota-id").value = "";
    
    // Auto-generate No Anggota
    const maxNo = members.reduce((max, m) => {
      const num = parseInt(m.noAnggota.split("-")[1]);
      return num > max ? num : max;
    }, 0);
    const nextNo = String(maxNo + 1).padStart(3, "0");
    document.getElementById("anggota-no").value = `KOP-${nextNo}`;
    
    // Set date to today
    document.getElementById("anggota-tgl").value = new Date().toISOString().slice(0, 10);
    
    // Hide status selector for new members (auto active)
    document.getElementById("anggota-status-wrapper").style.display = "none";
    document.getElementById("anggota-status").value = "Aktif";

    openModal("modal-anggota");
  });

  document.getElementById("btn-save-anggota").addEventListener("click", () => {
    const id = document.getElementById("anggota-id").value;
    const no = document.getElementById("anggota-no").value;
    const nama = document.getElementById("anggota-nama").value.trim();
    const telepon = document.getElementById("anggota-telepon").value.trim();
    const tgl = document.getElementById("anggota-tgl").value;
    const alamat = document.getElementById("anggota-alamat").value.trim();
    const status = document.getElementById("anggota-status").value;

    if (!nama || !telepon || !tgl) {
      showToast("Harap isi semua kolom wajib (*)", "warning");
      return;
    }

    if (!id) {
      // New member
      const newId = `m-${Date.now()}`;
      const newMember = { id: newId, noAnggota: no, nama, telepon, tanggalBergabung: tgl, alamat, status: "Aktif" };
      members.push(newMember);

      // Auto-charge Simpanan Pokok
      const spAmount = Number(settings.simpananPokok);
      const newSavings = {
        id: `s-${Date.now()}`,
        anggotaId: newId,
        tanggal: tgl,
        jenis: "Pokok",
        jumlah: spAmount,
        tipe: "Setoran",
        keterangan: "Simpanan Pokok awal keanggotaan (Otomatis)"
      };
      savings.push(newSavings);

      showToast(`Anggota baru berhasil didaftarkan. Simpanan Pokok ${formatRupiah(spAmount)} dicatat.`, "success");
    } else {
      // Edit Member
      const index = members.findIndex(m => m.id === id);
      if (index !== -1) {
        members[index] = { ...members[index], nama, telepon, tanggalBergabung: tgl, alamat, status };
        showToast("Informasi anggota berhasil diperbarui.", "success");
      }
    }

    saveState();
    closeModal("modal-anggota");
    renderAnggota();
  });

  // Edit / Delete global window scope helper bindings
  window.editMember = (id) => {
    const m = members.find(mem => mem.id === id);
    if (!m) return;

    document.getElementById("modal-anggota-title").textContent = "Ubah Informasi Anggota";
    document.getElementById("anggota-id").value = m.id;
    document.getElementById("anggota-no").value = m.noAnggota;
    document.getElementById("anggota-nama").value = m.nama;
    document.getElementById("anggota-telepon").value = m.telepon;
    document.getElementById("anggota-tgl").value = m.tanggalBergabung;
    document.getElementById("anggota-alamat").value = m.alamat;
    document.getElementById("anggota-status").value = m.status;
    
    // Show status selector
    document.getElementById("anggota-status-wrapper").style.display = "block";

    openModal("modal-anggota");
  };

  window.deleteMember = (id) => {
    const mem = members.find(m => m.id === id);
    if (!mem) return;

    // Validate if member has active loans or savings
    const activeLoan = getMemberActiveLoan(id);
    if (activeLoan) {
      showToast(`Tidak dapat menghapus. Anggota ${mem.nama} masih memiliki pinjaman aktif!`, "danger");
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus anggota ${mem.nama}? Semua histori simpanan juga akan terhapus.`)) {
      members = members.filter(m => m.id !== id);
      savings = savings.filter(s => s.anggotaId !== id);
      saveState();
      renderAnggota();
      showToast("Anggota berhasil dihapus dari sistem.", "success");
    }
  };

  // --- SAVINGS TRANSACTIONS ---
  
  function populateMembersDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">-- Pilih Anggota Koperasi --</option>';
    
    // Only active members can perform savings/loans
    members.filter(m => m.status === "Aktif").forEach(m => {
      dropdown.innerHTML += `<option value="${m.id}">${m.noAnggota} - ${m.nama}</option>`;
    });
  }

  // Setoran (Deposit) Button
  document.getElementById("btn-deposit").addEventListener("click", () => {
    document.getElementById("modal-simpanan-title").textContent = "Form Setoran Simpanan";
    document.getElementById("form-simpanan").reset();
    document.getElementById("simpanan-type").value = "Setoran";
    document.getElementById("simpanan-tgl").value = new Date().toISOString().slice(0, 10);
    
    // Enable all types
    document.getElementById("simpanan-jenis").innerHTML = `
      <option value="Wajib">Simpanan Wajib (${formatRupiah(settings.simpananWajib)})</option>
      <option value="Sukarela">Simpanan Sukarela</option>
      <option value="Pokok">Simpanan Pokok (${formatRupiah(settings.simpananPokok)})</option>
    `;

    populateMembersDropdown("simpanan-anggota-id");
    
    // Setup default amount on dropdown switch
    document.getElementById("simpanan-jenis").addEventListener("change", (e) => {
      const type = e.target.value;
      const amtInput = document.getElementById("simpanan-jumlah");
      if (type === "Wajib") amtInput.value = settings.simpananWajib;
      else if (type === "Pokok") amtInput.value = settings.simpananPokok;
      else amtInput.value = "";
    });

    document.getElementById("simpanan-jumlah").value = settings.simpananWajib; // default
    openModal("modal-simpanan");
  });

  // Penarikan (Withdrawal) Button
  document.getElementById("btn-withdraw").addEventListener("click", () => {
    document.getElementById("modal-simpanan-title").textContent = "Form Tarik Simpanan Sukarela";
    document.getElementById("form-simpanan").reset();
    document.getElementById("simpanan-type").value = "Penarikan";
    document.getElementById("simpanan-tgl").value = new Date().toISOString().slice(0, 10);
    
    // Withdrawal only allowed for voluntary (Sukarela)
    document.getElementById("simpanan-jenis").innerHTML = `
      <option value="Sukarela">Simpanan Sukarela</option>
    `;

    populateMembersDropdown("simpanan-anggota-id");
    document.getElementById("simpanan-jumlah").value = "";
    openModal("modal-simpanan");
  });

  document.getElementById("btn-save-simpanan").addEventListener("click", () => {
    const memId = document.getElementById("simpanan-anggota-id").value;
    const type = document.getElementById("simpanan-type").value;
    const jenis = document.getElementById("simpanan-jenis").value;
    const tgl = document.getElementById("simpanan-tgl").value;
    const jumlah = Number(document.getElementById("simpanan-jumlah").value);
    const ket = document.getElementById("simpanan-keterangan").value.trim();

    if (!memId || !tgl || !jumlah || jumlah <= 0) {
      showToast("Harap lengkapi semua input form secara valid.", "warning");
      return;
    }

    // Validation: Withdrawal must not exceed voluntary balance
    if (type === "Penarikan") {
      const sav = getMemberSavings(memId);
      if (jumlah > sav.sukarela) {
        showToast(`Penarikan gagal. Batas saldo sukarela anggota ini adalah ${formatRupiah(sav.sukarela)}`, "danger");
        return;
      }
    }

    const newTrans = {
      id: `s-${Date.now()}`,
      anggotaId: memId,
      tanggal: tgl,
      jenis,
      jumlah,
      tipe: type,
      keterangan: ket || `${type} Simpanan ${jenis}`
    };

    savings.push(newTrans);
    saveState();
    closeModal("modal-simpanan");
    renderSimpanan();
    showToast(`Transaksi Simpanan berhasil dicatat!`, "success");
  });

  window.deleteSavingsTransaction = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan transaksi simpanan ini?")) {
      savings = savings.filter(s => s.id !== id);
      saveState();
      renderSimpanan();
      showToast("Transaksi berhasil dihapus.", "success");
    }
  };

  // --- LOANS MANAGEMENT (PINJAMAN) ---

  // Ajukan Pinjaman Button click
  document.getElementById("btn-apply-loan").addEventListener("click", () => {
    document.getElementById("form-pinjaman").reset();
    document.getElementById("pinjaman-tgl").value = new Date().toISOString().slice(0, 10);
    document.getElementById("pinjaman-bunga").value = settings.defaultBunga;
    
    populateMembersDropdown("pinjaman-anggota-id");
    calculateLoanSimulation(); // trigger simulation update
    openModal("modal-pinjaman");
  });

  // Calculate live simulations
  const calculateLoanSimulation = () => {
    const jumlah = Number(document.getElementById("pinjaman-jumlah").value) || 0;
    const durasi = Number(document.getElementById("pinjaman-durasi").value) || 3;
    const bungaBln = Number(document.getElementById("pinjaman-bunga").value) || 1.5;

    // Simple flat interest cooperative loan calculation:
    // Pokok angsuran = Jumlah / Durasi
    // Bunga / bulan = Jumlah * (Bunga% / 100)
    // Angsuran total = Pokok + Bunga
    const pokokBulanan = Math.round(jumlah / durasi);
    const bungaBulanan = Math.round(jumlah * (bungaBln / 100));
    const totalBulanan = pokokBulanan + bungaBulanan;
    const totalPengembalian = totalBulanan * durasi;

    document.getElementById("sim-pokok-bulanan").textContent = formatRupiah(pokokBulanan);
    document.getElementById("sim-bunga-bulanan").textContent = formatRupiah(bungaBulanan);
    document.getElementById("sim-total-bulanan").textContent = formatRupiah(totalBulanan);
    document.getElementById("sim-total-pengembalian").textContent = formatRupiah(totalPengembalian);

    return { totalBulanan, totalPengembalian };
  };

  // Bind live loan simulation input events
  ["pinjaman-jumlah", "pinjaman-durasi", "pinjaman-bunga"].forEach(id => {
    document.getElementById(id).addEventListener("input", calculateLoanSimulation);
  });

  document.getElementById("btn-save-pinjaman").addEventListener("click", () => {
    const memId = document.getElementById("pinjaman-anggota-id").value;
    const tgl = document.getElementById("pinjaman-tgl").value;
    const jumlah = Number(document.getElementById("pinjaman-jumlah").value);
    const durasi = Number(document.getElementById("pinjaman-durasi").value);
    const bunga = Number(document.getElementById("pinjaman-bunga").value);
    const ket = document.getElementById("pinjaman-keterangan").value.trim();

    if (!memId || !tgl || !jumlah || jumlah <= 0 || !ket) {
      showToast("Harap lengkapi semua kolom bertanda (*).", "warning");
      return;
    }

    // Validate duplicate active loans
    const active = getMemberActiveLoan(memId);
    if (active) {
      showToast("Anggota ini masih memiliki pengajuan atau pinjaman aktif yang belum lunas!", "danger");
      return;
    }

    // Run simulation to get final amounts
    const sim = calculateLoanSimulation();

    const newLoan = {
      id: `l-${Date.now()}`,
      anggotaId: memId,
      tanggal: tgl,
      jumlah,
      bunga,
      durasi,
      angsuranBulanan: sim.totalBulanan,
      totalWajibBayar: sim.totalPengembalian,
      jumlahDibayar: 0,
      status: "Pengajuan", // pending administrator approval
      keterangan: ket
    };

    loans.push(newLoan);
    saveState();
    closeModal("modal-pinjaman");
    renderPinjaman();
    showToast("Pengajuan pinjaman berhasil didaftarkan. Menunggu persetujuan pengurus.", "success");
  });

  // Approve & Disburse Loan
  window.approveLoan = (id) => {
    const idx = loans.findIndex(l => l.id === id);
    if (idx === -1) return;

    if (confirm(`Apakah Anda yakin ingin MENYETUJUI dan MENCAIRKAN dana pinjaman sebesar ${formatRupiah(loans[idx].jumlah)}?`)) {
      loans[idx].status = "Aktif";
      saveState();
      renderPinjaman();
      showToast("Pinjaman disetujui! Dana berhasil dikreditkan ke anggota.", "success");
    }
  };

  // Reject / Cancel Loan application
  window.rejectLoan = (id) => {
    if (confirm("Apakah Anda yakin ingin menolak pengajuan pinjaman ini?")) {
      loans = loans.filter(l => l.id !== id);
      saveState();
      renderPinjaman();
      showToast("Pengajuan pinjaman ditolak dan dihapus.", "warning");
    }
  };

  // --- REPAYMENTS (ANGSURAN) ---
  
  window.openRepaymentModal = (loanId) => {
    const l = loans.find(loan => loan.id === loanId);
    if (!l) return;

    const mem = members.find(m => m.id === l.anggotaId);
    if (!mem) return;

    document.getElementById("form-angsuran").reset();
    document.getElementById("angsuran-pinjaman-id").value = l.id;
    document.getElementById("angsuran-tgl").value = new Date().toISOString().slice(0, 10);
    
    // Fill text labels
    document.getElementById("angsuran-nama-peminjam").textContent = mem.nama;
    document.getElementById("angsuran-pokok-total").textContent = formatRupiah(l.jumlah);
    
    const remaining = l.totalWajibBayar - l.jumlahDibayar;
    document.getElementById("angsuran-sisa-tagihan").textContent = formatRupiah(remaining);
    document.getElementById("angsuran-kewajiban-bulanan").textContent = `${formatRupiah(l.angsuranBulanan)} / bln`;

    // Prepopulate inputs
    document.getElementById("angsuran-jumlah").value = l.angsuranBulanan;
    document.getElementById("angsuran-denda").value = 0;
    
    // Suggested instalment label note
    const orderNo = Math.round((l.jumlahDibayar / l.angsuranBulanan) + 1);
    document.getElementById("angsuran-keterangan").value = `Angsuran Ke-${orderNo}`;

    openModal("modal-angsuran");
  };

  document.getElementById("btn-save-angsuran").addEventListener("click", () => {
    const loanId = document.getElementById("angsuran-pinjaman-id").value;
    const tgl = document.getElementById("angsuran-tgl").value;
    const jumlah = Number(document.getElementById("angsuran-jumlah").value);
    const denda = Number(document.getElementById("angsuran-denda").value) || 0;
    const ket = document.getElementById("angsuran-keterangan").value.trim();

    if (!loanId || !tgl || !jumlah || jumlah <= 0) {
      showToast("Harap isi input pembayaran dengan nominal valid.", "warning");
      return;
    }

    const loanIdx = loans.findIndex(l => l.id === loanId);
    if (loanIdx === -1) return;

    const activeLoan = loans[loanIdx];
    const remaining = activeLoan.totalWajibBayar - activeLoan.jumlahDibayar;

    if (jumlah > remaining) {
      showToast(`Jumlah bayar melebihi sisa pinjaman sebesar ${formatRupiah(remaining)}`, "warning");
      return;
    }

    // Save Repayment record
    const repId = `r-${Date.now()}`;
    const newRepayment = {
      id: repId,
      pinjamanId: loanId,
      tanggal: tgl,
      jumlah,
      denda,
      keterangan: ket || `Pembayaran Angsuran`
    };

    repayments.push(newRepayment);

    // Update Loan paid amounts
    loans[loanIdx].jumlahDibayar += jumlah;

    // Check if fully paid
    if (loans[loanIdx].jumlahDibayar >= loans[loanIdx].totalWajibBayar) {
      loans[loanIdx].status = "Lunas";
      showToast(`Selamat! Pinjaman atas nama anggota telah LUNAS terbayar.`, "success");
    } else {
      showToast(`Pembayaran angsuran sebesar ${formatRupiah(jumlah)} berhasil dicatat!`, "success");
    }

    saveState();
    closeModal("modal-angsuran");
    renderPinjaman();
  });

  // --- DETAIL VIEW: MODAL DETAIL ANGGOTA & PINJAMAN ---

  window.viewMemberDetail = (id) => {
    const mem = members.find(m => m.id === id);
    if (!mem) return;

    const sav = getMemberSavings(id);
    const active = getMemberActiveLoan(id);
    
    // Get member's detailed transactions history
    const memSavings = savings.filter(s => s.anggotaId === id).sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
    const memLoans = loans.filter(l => l.anggotaId === id).sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

    document.getElementById("modal-detail-title").textContent = `Profil Keanggotaan: ${mem.nama}`;
    
    let savingsHtml = memSavings.map(s => `
      <div class="info-row" style="font-size:12px;">
        <span>${formatDate(s.tanggal)} - Setoran ${s.jenis}</span>
        <span style="font-weight:700; color: ${s.tipe === 'Setoran' ? 'var(--color-success)' : 'var(--color-danger)'}">
          ${s.tipe === 'Setoran' ? '+' : '-'}${formatRupiah(s.jumlah)}
        </span>
      </div>
    `).join("");

    if (savingsHtml === "") {
      savingsHtml = `<p style="font-size:12px; color:var(--color-text-muted); text-align:center;">Belum ada simpanan.</p>`;
    }

    let loansHtml = memLoans.map(l => {
      const rem = l.status === "Pengajuan" ? l.jumlah : (l.totalWajibBayar - l.jumlahDibayar);
      return `
        <div style="border-bottom:1px dashed var(--glass-border); padding:8px 0; font-size:12px;">
          <div style="display:flex; justify-content:space-between; font-weight:600;">
            <span>Pinjaman ${formatRupiah(l.jumlah)} (${l.status})</span>
            <span>Tagihan: ${formatRupiah(rem)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--color-text-muted); font-size:11px; margin-top:2px;">
            <span>Tgl: ${formatDate(l.tanggal)} | Durasi: ${l.durasi} bln</span>
            <span>Angsuran: ${formatRupiah(l.angsuranBulanan)}/bln</span>
          </div>
        </div>
      `;
    }).join("");

    if (loansHtml === "") {
      loansHtml = `<p style="font-size:12px; color:var(--color-text-muted); text-align:center;">Belum pernah mengajukan pinjaman.</p>`;
    }

    const bodyHtml = `
      <div class="detail-grid">
        <div class="profile-card">
          <div class="profile-avatar">${getInitials(mem.nama)}</div>
          <h3>${mem.nama}</h3>
          <span class="badge ${mem.status === 'Aktif' ? 'badge-success' : 'badge-danger'}" style="margin-top:-8px;">${mem.status}</span>
          
          <div class="info-list" style="margin-top:16px;">
            <div class="info-row"><span class="info-label">No Anggota:</span><span class="info-value">${mem.noAnggota}</span></div>
            <div class="info-row"><span class="info-label">No HP:</span><span class="info-value">${mem.telepon}</span></div>
            <div class="info-row"><span class="info-label">Join Date:</span><span class="info-value">${formatDate(mem.tanggalBergabung)}</span></div>
            <div class="info-row"><span class="info-label">Alamat:</span><span class="info-value" style="text-align:right; font-size:11px; max-width:150px;">${mem.alamat}</span></div>
          </div>
        </div>
        
        <div>
          <h4 style="margin-bottom:12px; font-weight:700;"><i class="fa-solid fa-piggy-bank" style="color:var(--color-success); margin-right:8px;"></i>Ringkasan Simpanan</h4>
          <div class="info-list" style="margin-bottom:20px; background:rgba(255,255,255,0.02); padding:12px; border-radius:var(--border-radius-md); border:1px solid var(--glass-border);">
            <div class="info-row"><span class="info-label">Simpanan Pokok:</span><span class="info-value">${formatRupiah(sav.pokok)}</span></div>
            <div class="info-row"><span class="info-label">Simpanan Wajib:</span><span class="info-value">${formatRupiah(sav.wajib)}</span></div>
            <div class="info-row"><span class="info-label">Simpanan Sukarela:</span><span class="info-value">${formatRupiah(sav.sukarela)}</span></div>
            <div class="info-row" style="font-weight:700; border-top:1px solid var(--glass-border); padding-top:8px;"><span class="info-label">Total Saldo:</span><span class="info-value" style="color:var(--color-success);">${formatRupiah(sav.total)}</span></div>
          </div>
          
          <h4 style="margin-bottom:12px; font-weight:700;"><i class="fa-solid fa-hand-holding-dollar" style="color:var(--color-warning); margin-right:8px;"></i>Histori Pinjaman</h4>
          <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:var(--border-radius-md); border:1px solid var(--glass-border); max-height:160px; overflow-y:auto;">
            ${loansHtml}
          </div>
        </div>
      </div>

      <div style="margin-top:24px;">
        <h4 style="margin-bottom:12px; font-weight:700;"><i class="fa-solid fa-receipt" style="color:var(--color-info); margin-right:8px;"></i>Riwayat Setoran/Penarikan Rekening</h4>
        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:var(--border-radius-md); border:1px solid var(--glass-border); max-height:160px; overflow-y:auto;">
          ${savingsHtml}
        </div>
      </div>
    `;

    document.getElementById("modal-detail-body").innerHTML = bodyHtml;
    openModal("modal-detail");
  };

  window.viewLoanDetail = (loanId) => {
    const l = loans.find(loan => loan.id === loanId);
    if (!l) return;

    const mem = members.find(m => m.id === l.anggotaId);
    const hist = repayments.filter(r => r.pinjamanId === loanId).sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

    document.getElementById("modal-detail-title").textContent = `Detail Pinjaman: ${mem ? mem.nama : 'Dihapus'}`;

    let histHtml = hist.map(r => `
      <div class="info-row" style="font-size:12px;">
        <span>${formatDate(r.tanggal)} - ${r.keterangan}</span>
        <span style="font-weight:700; color:var(--color-success);">
          ${formatRupiah(r.jumlah)} ${r.denda ? `(+ Denda: ${formatRupiah(r.denda)})` : ''}
        </span>
      </div>
    `).join("");

    if (histHtml === "") {
      histHtml = `<p style="font-size:12px; color:var(--color-text-muted); text-align:center;">Belum ada pembayaran angsuran.</p>`;
    }

    const remaining = l.status === "Pengajuan" ? l.jumlah : (l.totalWajibBayar - l.jumlahDibayar);

    const bodyHtml = `
      <div class="detail-grid">
        <div>
          <h4 style="margin-bottom:12px; font-weight:700;"><i class="fa-solid fa-circle-info" style="color:var(--color-primary); margin-right:8px;"></i>Kontrak Pembiayaan</h4>
          <div class="info-list" style="background:rgba(255,255,255,0.02); padding:12px; border-radius:var(--border-radius-md); border:1px solid var(--glass-border);">
            <div class="info-row"><span class="info-label">No Kontrak:</span><span class="info-value">${l.id.toUpperCase()}</span></div>
            <div class="info-row"><span class="info-label">Anggota:</span><span class="info-value">${mem ? mem.nama : 'Dihapus'}</span></div>
            <div class="info-row"><span class="info-label">Tanggal Cair:</span><span class="info-value">${formatDate(l.tanggal)}</span></div>
            <div class="info-row"><span class="info-label">Pinjaman Pokok:</span><span class="info-value">${formatRupiah(l.jumlah)}</span></div>
            <div class="info-row"><span class="info-label">Suku Bunga:</span><span class="info-value">${l.bunga}% / bulan</span></div>
            <div class="info-row"><span class="info-label">Tenor / Durasi:</span><span class="info-value">${l.durasi} Bulan</span></div>
            <div class="info-row"><span class="info-label">Tujuan Pinjaman:</span><span class="info-value" style="font-size:11px;">${l.keterangan}</span></div>
          </div>
        </div>

        <div>
          <h4 style="margin-bottom:12px; font-weight:700;"><i class="fa-solid fa-money-bill-transfer" style="color:var(--color-warning); margin-right:8px;"></i>Status Angsuran</h4>
          <div class="info-list" style="background:rgba(255,255,255,0.02); padding:12px; border-radius:var(--border-radius-md); border:1px solid var(--glass-border);">
            <div class="info-row"><span class="info-label">Wajib Bayar Total:</span><span class="info-value">${formatRupiah(l.totalWajibBayar)}</span></div>
            <div class="info-row"><span class="info-label">Total Terbayar:</span><span class="info-value" style="color:var(--color-success);">${formatRupiah(l.jumlahDibayar)}</span></div>
            <div class="info-row" style="font-weight:700; border-top:1px solid var(--glass-border); padding-top:8px;"><span class="info-label">Sisa Tagihan:</span><span class="info-value" style="color:var(--color-danger);">${formatRupiah(remaining)}</span></div>
            <div class="info-row"><span class="info-label">Angsuran Bulanan:</span><span class="info-value" style="color:var(--color-warning);">${formatRupiah(l.angsuranBulanan)}</span></div>
            <div class="info-row"><span class="info-label">Status Pinjaman:</span><span class="info-value"><span class="badge ${l.status === 'Lunas' ? 'badge-success' : (l.status === 'Terlambat' ? 'badge-danger' : 'badge-warning')}">${l.status}</span></span></div>
          </div>
        </div>
      </div>

      <div style="margin-top:24px;">
        <h4 style="margin-bottom:12px; font-weight:700;"><i class="fa-solid fa-clock-rotate-left" style="color:var(--color-success); margin-right:8px;"></i>Riwayat Pembayaran Angsuran</h4>
        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:var(--border-radius-md); border:1px solid var(--glass-border); max-height:200px; overflow-y:auto;">
          ${histHtml}
        </div>
      </div>
    `;

    document.getElementById("modal-detail-body").innerHTML = bodyHtml;
    openModal("modal-detail");
  };

  // --- CONFIGURATION & DATABASE MANAGEMENT ---

  // Save Settings
  document.getElementById("btn-save-settings").addEventListener("click", () => {
    settings.coopName = document.getElementById("settings-coop-name").value.trim();
    settings.initialCash = Number(document.getElementById("settings-initial-cash").value) || 0;
    settings.simpananPokok = Number(document.getElementById("settings-simpanan-pokok").value) || 0;
    settings.simpananWajib = Number(document.getElementById("settings-simpanan-wajib").value) || 0;
    settings.defaultBunga = Number(document.getElementById("settings-default-bunga").value) || 1.5;

    saveState();
    
    // Update Brand Name
    document.querySelector(".brand-name").textContent = settings.coopName;

    showToast("Pengaturan koperasi berhasil diperbarui!", "success");
    renderDashboard(); // trigger recalculations
  });

  // Seed Dummy Data
  document.getElementById("btn-seed-dummy").addEventListener("click", () => {
    if (confirm("Ingin mengisi ulang database dengan data uji coba (anggota, simpanan, pinjaman)? Data lama Anda tidak akan hilang tetapi digabung, kecuali Anda reset terlebih dahulu.")) {
      initDatabase(true);
      showToast("Data sampel uji coba berhasil diisi!", "success");
      renderDashboard();
    }
  });

  document.getElementById("btn-quick-reset").addEventListener("click", () => {
    initDatabase(true);
    switchView("dashboard");
  });

  // Reset DB
  document.getElementById("btn-reset-db").addEventListener("click", () => {
    if (confirm("PERINGATAN! Seluruh data anggota, transaksi simpanan, pinjaman, dan pengaturan akan dihapus secara permanen. Apakah Anda yakin?")) {
      localStorage.removeItem("koperasi_members");
      localStorage.removeItem("koperasi_savings");
      localStorage.removeItem("koperasi_loans");
      localStorage.removeItem("koperasi_repayments");
      localStorage.removeItem("koperasi_settings");
      
      initDatabase(true);
      switchView("dashboard");
      showToast("Database berhasil dikosongkan ke pengaturan awal.", "warning");
    }
  });

  // Export Data JSON
  document.getElementById("btn-backup-data").addEventListener("click", () => {
    const backupData = {
      members,
      savings,
      loans,
      repayments,
      settings,
      exportDate: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `Backup_Koperasi_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    showToast("Pencadangan database JSON berhasil diunduh!", "success");
  });

  // Import Data JSON
  document.getElementById("btn-import-trigger").addEventListener("click", () => {
    document.getElementById("file-import-data").click();
  });

  document.getElementById("file-import-data").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const data = JSON.parse(event.target.result);
        if (data.members && data.savings && data.loans && data.repayments && data.settings) {
          members = data.members;
          savings = data.savings;
          loans = data.loans;
          repayments = data.repayments;
          settings = data.settings;
          
          saveState();
          initDatabase(); // refresh state
          renderDashboard();
          showToast("Data Koperasi berhasil diimpor & dipulihkan dari cadangan!", "success");
        } else {
          showToast("Berkas JSON tidak sesuai format data Koperasi.", "danger");
        }
      } catch (err) {
        showToast("Gagal membaca berkas JSON. Format tidak valid.", "danger");
      }
    };
    reader.readAsText(file);
  });

  // --- THEME TOGGLE (LIGHT / DARK) ---
  const themeToggle = document.getElementById("theme-toggle");
  
  // Set theme from localStorage or default dark
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    
    showToast(`Mode ${isLight ? 'Terang' : 'Gelap'} diaktifkan`, "info");
    
    // Re-render dashboard charts to update their text/grid colors
    if (document.getElementById("view-dashboard").classList.contains("active")) {
      renderDashboard();
    }
  });

  // Bell icon notifications
  document.getElementById("notification-bell").addEventListener("click", () => {
    // Check if there are loans pending approval (status = Pengajuan) or overdue repayments
    const pendingLoans = loans.filter(l => l.status === "Pengajuan");
    const alerts = [];
    
    if (pendingLoans.length > 0) {
      alerts.push(`${pendingLoans.length} pengajuan pinjaman baru memerlukan persetujuan.`);
    }

    // Check overdue loans (if any loan repayment has denda or simple date check, but we have a status flag)
    const overdueLoans = loans.filter(l => l.status === "Terlambat");
    if (overdueLoans.length > 0) {
      alerts.push(`${overdueLoans.length} kontrak pinjaman berada dalam status terlambat bayar.`);
    }

    if (alerts.length > 0) {
      alerts.forEach(msg => showToast(msg, "warning"));
    } else {
      showToast("Tidak ada pemberitahuan baru hari ini. Semua aktivitas berjalan lancar.", "success");
    }
  });

  // Header date display live update
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("header-date").textContent = today.toLocaleDateString('id-ID', dateOptions);

  // --- INITIAL VIEW RENDER ---
  renderDashboard();

});
