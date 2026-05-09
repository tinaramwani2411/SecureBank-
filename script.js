if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    const radii = Array.isArray(r) ? r : [r, r, r, r];
    this.moveTo(x + radii[0], y);
    this.lineTo(x + w - radii[1], y);
    this.quadraticCurveTo(x + w, y, x + w, y + radii[1]);
    this.lineTo(x + w, y + h - radii[2]);
    this.quadraticCurveTo(x + w, y + h, x + w - radii[2], y + h);
    this.lineTo(x + radii[3], y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - radii[3]);
    this.lineTo(x, y + radii[0]);
    this.quadraticCurveTo(x, y, x + radii[0], y);
    this.closePath();
  };
}

const App = {
  state: { currentUser: null, currentPage: 'dashboard' },

  data() {
    if (!localStorage.getItem('bankApp')) {
      const initial = {
        users: [
          {
            id: 'USR001', name: 'Admin User', email: 'admin@bank.com',
            password: 'admin123', phone: '9876543210', address: 'Mumbai, India',
            role: 'admin', createdAt: new Date().toISOString(),
            accounts: [
              { id: 'ACC001', type: 'Savings', number: 'XXXX1234', balance: 125000, status: 'active', createdAt: new Date().toISOString() },
              { id: 'ACC002', type: 'Current', number: 'XXXX5678', balance: 45000, status: 'active', createdAt: new Date().toISOString() }
            ]
          },
          {
            id: 'USR002', name: 'John Doe', email: 'john@example.com',
            password: 'user123', phone: '9876543211', address: 'Delhi, India',
            role: 'user', createdAt: new Date().toISOString(),
            accounts: [
              { id: 'ACC003', type: 'Savings', number: 'XXXX9012', balance: 85000, status: 'active', createdAt: new Date().toISOString() },
              { id: 'ACC004', type: 'Fixed Deposit', number: 'XXXX3456', balance: 200000, status: 'active', createdAt: new Date().toISOString() }
            ]
          }
        ],
        transactions: [
          { id: 'TXN001', userId: 'USR001', accountId: 'ACC001', type: 'credit', amount: 50000, description: 'Salary Credit', date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'completed' },
          { id: 'TXN002', userId: 'USR001', accountId: 'ACC001', type: 'debit', amount: 15000, description: 'ATM Withdrawal', date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'completed' },
          { id: 'TXN003', userId: 'USR001', accountId: 'ACC002', type: 'debit', amount: 2500, description: 'Online Purchase - Amazon', date: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
          { id: 'TXN004', userId: 'USR001', accountId: 'ACC001', type: 'credit', amount: 10000, description: 'Refund - Travel Booking', date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'completed' },
          { id: 'TXN005', userId: 'USR001', accountId: 'ACC001', type: 'debit', amount: 5000, description: 'Electricity Bill Payment', date: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'completed' },
          { id: 'TXN006', userId: 'USR001', accountId: 'ACC002', type: 'credit', amount: 20000, description: 'Transfer from Savings', date: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'completed' },
          { id: 'TXN007', userId: 'USR002', type: 'credit', amount: 75000, description: 'Salary Credit', date: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
          { id: 'TXN008', userId: 'USR002', type: 'debit', amount: 12000, description: 'Rent Payment', date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'completed' },
          { id: 'TXN009', userId: 'USR002', type: 'credit', amount: 5000, description: 'Freelance Payment', date: new Date(Date.now() - 86400000 * 6).toISOString(), status: 'completed' },
          { id: 'TXN010', userId: 'USR002', type: 'debit', amount: 3500, description: 'Grocery Store', date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'completed' }
        ],
        loans: [
          { id: 'LOAN001', userId: 'USR001', type: 'Personal Loan', amount: 500000, approvedAmount: 450000, tenure: 24, interestRate: 10.5, status: 'approved', appliedDate: new Date(Date.now() - 86400000 * 30).toISOString(), approvedDate: new Date(Date.now() - 86400000 * 28).toISOString(), emi: 20850, paidEmis: 1, totalEmis: 24, purpose: 'Home Renovation' },
          { id: 'LOAN002', userId: 'USR002', type: 'Education Loan', amount: 800000, approvedAmount: 750000, tenure: 36, interestRate: 8.5, status: 'approved', appliedDate: new Date(Date.now() - 86400000 * 60).toISOString(), approvedDate: new Date(Date.now() - 86400000 * 55).toISOString(), emi: 23650, paidEmis: 2, totalEmis: 36, purpose: 'Higher Studies' }
        ],
        bills: [
          { id: 'BILL001', userId: 'USR001', type: 'Electricity', provider: 'Tata Power', amount: 2450, dueDate: new Date(Date.now() + 86400000 * 10).toISOString(), status: 'pending' },
          { id: 'BILL002', userId: 'USR001', type: 'Internet', provider: 'Jio Fiber', amount: 999, dueDate: new Date(Date.now() + 86400000 * 15).toISOString(), status: 'paid', paidDate: new Date(Date.now() - 86400000 * 20).toISOString() }
        ],
        notifications: [
          { id: 'NOTIF001', userId: 'USR001', message: 'Salary of ₹50,000 credited to Savings Account', type: 'credit', read: false, date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: 'NOTIF002', userId: 'USR001', message: 'Personal Loan of ₹4,50,000 approved', type: 'loan', read: false, date: new Date(Date.now() - 86400000 * 28).toISOString() },
          { id: 'NOTIF003', userId: 'USR001', message: 'Electricity bill of ₹2,450 due in 10 days', type: 'bill', read: true, date: new Date(Date.now() - 86400000 * 5).toISOString() }
        ],
        accountCounter: 5,
        transactionCounter: 11,
        loanCounter: 3,
        billCounter: 3,
        notifCounter: 4
      };
      localStorage.setItem('bankApp', JSON.stringify(initial));
    }
    return JSON.parse(localStorage.getItem('bankApp'));
  },

  saveData(data) { localStorage.setItem('bankApp', JSON.stringify(data)); },
  genId(prefix, counter) { const d = this.data(); const n = d[counter]; d[counter]++; this.saveData(d); return `${prefix}${String(n).padStart(3, '0')}`; },

  // ========== AUTH ==========
  register(name, email, phone, password) {
    const data = this.data();
    if (data.users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered' };
    const user = {
      id: this.genId('USR', 'accountCounter'), name, email, phone,
      password, address: '', role: 'user', createdAt: new Date().toISOString(),
      accounts: [
        { id: this.genId('ACC', 'accountCounter'), type: 'Savings', number: `XXXX${String(Math.floor(1000 + Math.random() * 9000))}`, balance: 10000, status: 'active', createdAt: new Date().toISOString() }
      ]
    };
    data.users.push(user);
    this.saveData(data);
    return { ok: true, msg: 'Account created! Welcome to SecureBank.' };
  },

  login(email, password) {
    const data = this.data();
    const user = data.users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password' };
    this.state.currentUser = user;
    localStorage.setItem('bankSession', JSON.stringify(user));
    return { ok: true, user };
  },

  logout() {
    this.state.currentUser = null;
    localStorage.removeItem('bankSession');
    this.showAuth();
  },

  checkSession() {
    const sess = localStorage.getItem('bankSession');
    if (sess) {
      const user = JSON.parse(sess);
      const data = this.data();
      const fresh = data.users.find(u => u.id === user.id);
      if (fresh) { this.state.currentUser = fresh; this.showApp(); return true; }
    }
    return false;
  },

  getUsers() { return this.data().users; },
  getUser(id) { return this.data().users.find(u => u.id === id); },
  getCurrentUser() { return this.state.currentUser; },

  // ========== ACCOUNTS ==========
  getUserAccounts() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    return fresh ? fresh.accounts : [];
  },

  getAccount(id) {
    const data = this.data();
    for (const u of data.users) {
      const a = u.accounts.find(ac => ac.id === id);
      if (a) return { account: a, user: u };
    }
    return null;
  },

  createAccount(type) {
    const user = this.getCurrentUser();
    if (!user) return { ok: false, msg: 'Not logged in' };
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    if (!fresh) return { ok: false, msg: 'User not found' };
    const existing = fresh.accounts.find(a => a.type === type);
    if (existing) return { ok: false, msg: `You already have a ${type} account` };
    const account = {
      id: this.genId('ACC', 'accountCounter'),
      type, number: `XXXX${String(Math.floor(1000 + Math.random() * 9000))}`,
      balance: 0, status: 'active', createdAt: new Date().toISOString()
    };
    fresh.accounts.push(account);
    this.saveData(data);
    this.state.currentUser = fresh;
    localStorage.setItem('bankSession', JSON.stringify(fresh));
    return { ok: true, msg: `${type} account created successfully!`, account };
  },

  // ========== TRANSACTIONS ==========
  getUserTransactions(accountId = null) {
    const user = this.getCurrentUser();
    if (!user) return [];
    const data = this.data();
    let txs = data.transactions.filter(t => t.userId === user.id);
    if (accountId) txs = txs.filter(t => t.accountId === accountId);
    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getAllTransactions() {
    const data = this.data();
    return data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  deposit(accountId, amount, description) {
    if (!amount || amount <= 0) return { ok: false, msg: 'Invalid amount' };
    const user = this.getCurrentUser();
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    const acc = fresh.accounts.find(a => a.id === accountId);
    if (!acc) return { ok: false, msg: 'Account not found' };
    acc.balance += Number(amount);
    const txn = {
      id: this.genId('TXN', 'transactionCounter'),
      userId: user.id, accountId,
      type: 'credit', amount: Number(amount),
      description: description || 'Deposit',
      date: new Date().toISOString(), status: 'completed'
    };
    data.transactions.push(txn);
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: user.id,
      message: `₹${Number(amount).toLocaleString()} credited to ${acc.type} Account`,
      type: 'credit', read: false, date: new Date().toISOString()
    });
    this.saveData(data);
    this.state.currentUser = fresh;
    localStorage.setItem('bankSession', JSON.stringify(fresh));
    return { ok: true, msg: `₹${Number(amount).toLocaleString()} deposited successfully`, txn };
  },

  withdraw(accountId, amount, description) {
    if (!amount || amount <= 0) return { ok: false, msg: 'Invalid amount' };
    const user = this.getCurrentUser();
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    const acc = fresh.accounts.find(a => a.id === accountId);
    if (!acc) return { ok: false, msg: 'Account not found' };
    if (acc.balance < Number(amount)) return { ok: false, msg: 'Insufficient balance' };
    acc.balance -= Number(amount);
    const txn = {
      id: this.genId('TXN', 'transactionCounter'),
      userId: user.id, accountId,
      type: 'debit', amount: Number(amount),
      description: description || 'Withdrawal',
      date: new Date().toISOString(), status: 'completed'
    };
    data.transactions.push(txn);
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: user.id,
      message: `₹${Number(amount).toLocaleString()} debited from ${acc.type} Account`,
      type: 'debit', read: false, date: new Date().toISOString()
    });
    this.saveData(data);
    this.state.currentUser = fresh;
    localStorage.setItem('bankSession', JSON.stringify(fresh));
    return { ok: true, msg: `₹${Number(amount).toLocaleString()} withdrawn successfully`, txn };
  },

  transfer(fromAccountId, toAccountNumber, amount, description) {
    if (!amount || amount <= 0) return { ok: false, msg: 'Invalid amount' };
    const user = this.getCurrentUser();
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    const fromAcc = fresh.accounts.find(a => a.id === fromAccountId);
    if (!fromAcc) return { ok: false, msg: 'Source account not found' };
    if (fromAcc.balance < Number(amount)) return { ok: false, msg: 'Insufficient balance' };

    let toUser = null, toAcc = null;
    for (const u of data.users) {
      const a = u.accounts.find(ac => ac.number === toAccountNumber);
      if (a) { toUser = u; toAcc = a; break; }
    }
    if (!toAcc) return { ok: false, msg: 'Destination account not found' };
    if (toAcc.id === fromAccountId) return { ok: false, msg: 'Cannot transfer to same account' };

    fromAcc.balance -= Number(amount);
    toAcc.balance += Number(amount);

    const desc = description || `Transfer to ${toAcc.type} (${toAcc.number})`;
    const txn = {
      id: this.genId('TXN', 'transactionCounter'),
      userId: user.id, accountId: fromAccountId,
      type: 'debit', amount: Number(amount),
      description: desc,
      date: new Date().toISOString(), status: 'completed'
    };
    data.transactions.push(txn);

    const txn2 = {
      id: this.genId('TXN', 'transactionCounter'),
      userId: toUser.id, accountId: toAcc.id,
      type: 'credit', amount: Number(amount),
      description: `Transfer from ${fresh.name}`,
      date: new Date().toISOString(), status: 'completed'
    };
    data.transactions.push(txn2);

    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: user.id,
      message: `₹${Number(amount).toLocaleString()} transferred to ${toAcc.type} (${toAcc.number})`,
      type: 'debit', read: false, date: new Date().toISOString()
    });
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: toUser.id,
      message: `₹${Number(amount).toLocaleString()} received from ${fresh.name}`,
      type: 'credit', read: false, date: new Date().toISOString()
    });

    this.saveData(data);
    this.state.currentUser = fresh;
    localStorage.setItem('bankSession', JSON.stringify(fresh));
    return { ok: true, msg: `₹${Number(amount).toLocaleString()} transferred successfully`, txn };
  },

  // ========== LOANS ==========
  getUserLoans() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return this.data().loans.filter(l => l.userId === user.id).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  },

  getAllLoans() {
    return this.data().loans.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  },

  applyLoan(type, amount, tenure, purpose) {
    const user = this.getCurrentUser();
    if (!user) return { ok: false, msg: 'Not logged in' };
    const data = this.data();
    const rates = { 'Personal Loan': 10.5, 'Home Loan': 8.5, 'Car Loan': 9.5, 'Education Loan': 8.0, 'Business Loan': 12.0 };
    const rate = rates[type] || 11.0;
    const monthlyRate = rate / 12 / 100;
    const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1));
    const loan = {
      id: this.genId('LOAN', 'loanCounter'),
      userId: user.id, type, amount: Number(amount),
      approvedAmount: null, tenure, interestRate: rate,
      status: 'pending', appliedDate: new Date().toISOString(),
      approvedDate: null, emi: 0, paidEmis: 0, totalEmis: tenure,
      purpose
    };
    data.loans.push(loan);
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: user.id,
      message: `Your ${type} application for ₹${Number(amount).toLocaleString()} has been submitted`,
      type: 'loan', read: false, date: new Date().toISOString()
    });
    this.saveData(data);
    return { ok: true, msg: 'Loan application submitted successfully', loan };
  },

  approveLoan(loanId, approvedAmount) {
    const data = this.data();
    const loan = data.loans.find(l => l.id === loanId);
    if (!loan) return { ok: false, msg: 'Loan not found' };
    loan.status = 'approved';
    loan.approvedAmount = Number(approvedAmount);
    loan.approvedDate = new Date().toISOString();
    const monthlyRate = loan.interestRate / 12 / 100;
    loan.emi = Math.round((approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, loan.tenure)) / (Math.pow(1 + monthlyRate, loan.tenure) - 1));
    const user = data.users.find(u => u.id === loan.userId);
    if (user && user.accounts.length > 0) {
      user.accounts[0].balance += Number(approvedAmount);
      data.transactions.push({
        id: this.genId('TXN', 'transactionCounter'),
        userId: user.id, accountId: user.accounts[0].id,
        type: 'credit', amount: Number(approvedAmount),
        description: `${loan.type} - Loan Disbursement`,
        date: new Date().toISOString(), status: 'completed'
      });
    }
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: loan.userId,
      message: `Your ${loan.type} of ₹${Number(approvedAmount).toLocaleString()} has been approved!`,
      type: 'loan', read: false, date: new Date().toISOString()
    });
    this.saveData(data);
    return { ok: true, msg: 'Loan approved successfully' };
  },

  rejectLoan(loanId) {
    const data = this.data();
    const loan = data.loans.find(l => l.id === loanId);
    if (!loan) return { ok: false, msg: 'Loan not found' };
    loan.status = 'rejected';
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: loan.userId,
      message: `Your ${loan.type} application has been reviewed and was not approved at this time.`,
      type: 'loan', read: false, date: new Date().toISOString()
    });
    this.saveData(data);
    return { ok: true, msg: 'Loan rejected' };
  },

  // ========== BILLS ==========
  getUserBills() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return this.data().bills.filter(b => b.userId === user.id).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  getAllBills() {
    return this.data().bills;
  },

  addBill(type, provider, amount, dueDate) {
    const user = this.getCurrentUser();
    if (!user) return { ok: false, msg: 'Not logged in' };
    const data = this.data();
    const bill = {
      id: this.genId('BILL', 'billCounter'),
      userId: user.id, type, provider,
      amount: Number(amount), dueDate,
      status: 'pending'
    };
    data.bills.push(bill);
    this.saveData(data);
    return { ok: true, msg: 'Bill added successfully', bill };
  },

  payBill(billId, accountId) {
    const user = this.getCurrentUser();
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    const acc = fresh.accounts.find(a => a.id === accountId);
    if (!acc) return { ok: false, msg: 'Account not found' };
    const bill = data.bills.find(b => b.id === billId && b.userId === user.id);
    if (!bill) return { ok: false, msg: 'Bill not found' };
    if (bill.status === 'paid') return { ok: false, msg: 'Bill already paid' };
    if (acc.balance < bill.amount) return { ok: false, msg: 'Insufficient balance to pay this bill' };
    acc.balance -= bill.amount;
    bill.status = 'paid';
    bill.paidDate = new Date().toISOString();
    bill.accountId = accountId;
    data.transactions.push({
      id: this.genId('TXN', 'transactionCounter'),
      userId: user.id, accountId,
      type: 'debit', amount: bill.amount,
      description: `${bill.type} - ${bill.provider} Bill Payment`,
      date: new Date().toISOString(), status: 'completed'
    });
    data.notifications.push({
      id: this.genId('NOTIF', 'notifCounter'), userId: user.id,
      message: `${bill.type} bill of ₹${bill.amount.toLocaleString()} paid successfully`,
      type: 'bill', read: false, date: new Date().toISOString()
    });
    this.saveData(data);
    this.state.currentUser = fresh;
    localStorage.setItem('bankSession', JSON.stringify(fresh));
    return { ok: true, msg: `₹${bill.amount.toLocaleString()} bill paid successfully` };
  },

  // ========== NOTIFICATIONS ==========
  getUserNotifications() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return this.data().notifications.filter(n => n.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getUnreadNotifCount() {
    return this.getUserNotifications().filter(n => !n.read).length;
  },

  markNotifRead(notifId) {
    const data = this.data();
    const n = data.notifications.find(x => x.id === notifId);
    if (n) n.read = true;
    this.saveData(data);
  },

  markAllNotifRead() {
    const user = this.getCurrentUser();
    const data = this.data();
    data.notifications.forEach(n => { if (n.userId === user.id) n.read = true; });
    this.saveData(data);
  },

  // ========== PROFILE ==========
  updateProfile(name, phone, address) {
    const user = this.getCurrentUser();
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    if (!fresh) return { ok: false, msg: 'User not found' };
    fresh.name = name;
    fresh.phone = phone;
    fresh.address = address;
    this.saveData(data);
    this.state.currentUser = fresh;
    localStorage.setItem('bankSession', JSON.stringify(fresh));
    return { ok: true, msg: 'Profile updated successfully' };
  },

  changePassword(oldPassword, newPassword) {
    const user = this.getCurrentUser();
    const data = this.data();
    const fresh = data.users.find(u => u.id === user.id);
    if (!fresh) return { ok: false, msg: 'User not found' };
    if (fresh.password !== oldPassword) return { ok: false, msg: 'Current password is incorrect' };
    fresh.password = newPassword;
    this.saveData(data);
    this.state.currentUser = fresh;
    return { ok: true, msg: 'Password changed successfully' };
  },

  // ========== ADMIN ==========
  toggleUserStatus(userId) {
    const data = this.data();
    const user = data.users.find(u => u.id === userId);
    if (!user) return { ok: false, msg: 'User not found' };
    if (user.role === 'admin') return { ok: false, msg: 'Cannot modify admin status' };
    const allActive = user.accounts.every(a => a.status === 'active');
    user.accounts.forEach(a => { a.status = allActive ? 'inactive' : 'active'; });
    this.saveData(data);
    return { ok: true, msg: `User ${allActive ? 'deactivated' : 'activated'} successfully` };
  },

  getDashboardStats() {
    const data = this.data();
    const user = this.getCurrentUser();
    if (!user) return {};
    const fresh = data.users.find(u => u.id === user.id);
    const accounts = fresh ? fresh.accounts : [];
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const txs = data.transactions.filter(t => t.userId === user.id);
    const totalIncome = txs.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = txs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const loans = data.loans.filter(l => l.userId === user.id);
    const activeLoans = loans.filter(l => l.status === 'approved');
    return { accounts, totalBalance, totalIncome, totalExpenses, totalTransactions: txs.length, activeLoans: activeLoans.length, totalLoans: activeLoans.reduce((s, l) => s + (l.emi || 0), 0) };
  },

  getAdminStats() {
    const data = this.data();
    return {
      totalUsers: data.users.length,
      totalAccounts: data.users.reduce((s, u) => s + u.accounts.length, 0),
      totalTransactions: data.transactions.length,
      totalLoans: data.loans.length,
      pendingLoans: data.loans.filter(l => l.status === 'pending').length,
      totalBills: data.bills.length,
      totalBalance: data.users.reduce((s, u) => s + u.accounts.reduce((s2, a) => s2 + a.balance, 0), 0)
    };
  },

  generateAccountNumber() {
    return `XXXX${String(Math.floor(1000 + Math.random() * 9000))}`;
  }
};

// ===================== UI CONTROLLER =====================
const UI = {
  init() {
    if (App.checkSession()) { this.showApp(); } else { this.showAuth(); }
    this.bindEvents();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60000);
  },

  showAuth() {
    document.querySelector('.auth-page').classList.remove('hidden');
    document.querySelector('.app-layout').classList.remove('active');
  },

  showApp() {
    document.querySelector('.auth-page').classList.add('hidden');
    document.querySelector('.app-layout').classList.add('active');
    this.refreshAll();
  },

  updateDateTime() {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const el = document.getElementById('headerDate');
    if (el) el.textContent = now.toLocaleDateString('en-US', opts);
  },

  refreshAll() {
    this.renderUserInfo();
    this.renderDashboard();
    this.renderAccounts();
    this.renderTransactions();
    this.renderLoans();
    this.renderBills();
    this.renderNotifications();
    this.renderProfile();
    this.renderAdmin();
    this.navigateTo(App.state.currentPage);
  },

  navigateTo(page) {
    App.state.currentPage = page;
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const section = document.getElementById(`page-${page}`);
    if (section) section.classList.add('active');
    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');
    document.getElementById('pageTitle').textContent = page.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    this.renderNotifications();
    if (page === 'dashboard') this.renderDashboard();
    if (page === 'accounts') this.renderAccounts();
    if (page === 'transactions') this.renderTransactions();
    if (page === 'loans') this.renderLoans();
    if (page === 'bills') this.renderBills();
    if (page === 'profile') this.renderProfile();
    if (page === 'admin') this.renderAdmin();
  },

  renderUserInfo() {
    const user = App.getCurrentUser();
    if (!user) return;
    document.getElementById('sidebarUserName').textContent = user.name;
    document.getElementById('sidebarUserRole').textContent = user.role === 'admin' ? 'Administrator' : 'Customer';
    document.getElementById('sidebarAvatar').textContent = user.name.charAt(0).toUpperCase();
    const adminNav = document.getElementById('navAdmin');
    if (adminNav) adminNav.style.display = user.role === 'admin' ? 'flex' : 'none';
  },

  // ===================== DASHBOARD =====================
  renderDashboard() {
    const stats = App.getDashboardStats();
    if (!stats.accounts) return;

    const totalBalance = stats.totalBalance;
    const totalIncome = stats.totalIncome;
    const totalExpenses = stats.totalExpenses;
    const activeLoans = stats.activeLoans;

    document.getElementById('dashTotalBalance').textContent = `₹${totalBalance.toLocaleString()}`;
    document.getElementById('dashTotalIncome').textContent = `₹${totalIncome.toLocaleString()}`;
    document.getElementById('dashTotalExpenses').textContent = `₹${totalExpenses.toLocaleString()}`;
    document.getElementById('dashActiveLoans').textContent = activeLoans;

    const txs = App.getUserTransactions().slice(0, 7);
    const list = document.getElementById('dashRecentTx');
    list.innerHTML = '';
    if (txs.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-light)">No transactions yet</div>';
    } else {
      txs.forEach(tx => {
        const date = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isCredit = tx.type === 'credit';
        list.innerHTML += `
          <div class="transaction-item">
            <div class="tx-icon ${isCredit ? 'credit' : 'debit'}">${isCredit ? '↓' : '↑'}</div>
            <div class="tx-info">
              <div class="tx-title">${tx.description}</div>
              <div class="tx-date">${date}</div>
            </div>
            <div class="tx-amount ${isCredit ? 'credit' : 'debit'}">${isCredit ? '+' : '-'}₹${Number(tx.amount).toLocaleString()}</div>
          </div>
        `;
      });
    }
    this.renderDashboardChart();
  },

  renderDashboardChart() {
    const canvas = document.getElementById('dashChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 280;

    const txs = App.getUserTransactions();
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayTxs = txs.filter(t => new Date(t.date).toDateString() === d.toDateString());
      const income = dayTxs.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
      const expenses = dayTxs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
      last7.push({ label: dateStr, income, expenses });
    }

    const w = canvas.width, h = canvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const maxVal = Math.max(...last7.map(d => Math.max(d.income, d.expenses)), 1);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${Math.round((maxVal / 4) * (4 - i)).toLocaleString()}`, pad.left - 8, y + 4);
    }

    const barW = chartW / last7.length * 0.6;
    const gap = chartW / last7.length;

    last7.forEach((d, i) => {
      const x = pad.left + gap * i + (gap - barW) / 2;
      const incomeH = (d.income / maxVal) * chartH;
      const expenseH = (d.expenses / maxVal) * chartH;

      // Income bar
      const grad = ctx.createLinearGradient(x, pad.top + chartH - incomeH, x, pad.top + chartH);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#6ee7b7');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, pad.top + chartH - incomeH, barW / 2 - 2, incomeH, [4, 4, 0, 0]);
      ctx.fill();

      // Expense bar
      const grad2 = ctx.createLinearGradient(x + barW / 2 + 2, pad.top + chartH - expenseH, x + barW / 2 + 2, pad.top + chartH);
      grad2.addColorStop(0, '#ef4444');
      grad2.addColorStop(1, '#fca5a5');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.roundRect(x + barW / 2 + 2, pad.top + chartH - expenseH, barW / 2 - 2, expenseH, [4, 4, 0, 0]);
      ctx.fill();

      // Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, pad.left + gap * i + gap / 2, h - pad.bottom + 16);
    });

    // Legend
    ctx.fillStyle = '#10b981';
    ctx.fillRect(w - 160, 8, 12, 12);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Income', w - 144, 19);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(w - 80, 8, 12, 12);
    ctx.fillStyle = '#64748b';
    ctx.fillText('Expenses', w - 64, 19);
  },

  // ===================== ACCOUNTS =====================
  renderAccounts() {
    const accounts = App.getUserAccounts();
    const grid = document.getElementById('accountsGrid');
    grid.innerHTML = '';
    if (accounts.length === 0) {
      grid.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-light);grid-column:1/-1">No accounts yet. Create one below!</div>';
    } else {
      accounts.forEach(acc => {
        const cls = acc.type === 'Savings' ? 'savings' : acc.type === 'Current' ? 'current' : 'fixed';
        grid.innerHTML += `
          <div class="account-card ${cls}" onclick="UI.showAccountDetails('${acc.id}')">
            <div class="card-content">
              <div class="account-type">${acc.type} Account</div>
              <div class="account-number">${acc.number}</div>
              <div class="account-balance-label">Available Balance</div>
              <div class="account-balance">₹${Number(acc.balance).toLocaleString()}</div>
              <div class="account-card-footer">
                <div class="account-status">
                  <span class="status-dot ${acc.status === 'inactive' ? 'inactive' : ''}"></span>
                  ${acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}
                </div>
                <span style="font-size:12px;opacity:0.7">${new Date(acc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        `;
      });
    }

    const select = document.getElementById('txAccountFilter');
    if (select) {
      const currentVal = select.value;
      select.innerHTML = '<option value="all">All Accounts</option>';
      accounts.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.type} - ${a.number}</option>`;
      });
      select.value = currentVal;
    }

    const transferSelect = document.getElementById('transferFromAccount');
    if (transferSelect) {
      transferSelect.innerHTML = '<option value="">Select account</option>';
      accounts.forEach(a => {
        transferSelect.innerHTML += `<option value="${a.id}">${a.type} - ${a.number} (₹${Number(a.balance).toLocaleString()})</option>`;
      });
    }

    const depositSelect = document.getElementById('depositAccount');
    if (depositSelect) {
      depositSelect.innerHTML = '<option value="">Select account</option>';
      accounts.forEach(a => {
        depositSelect.innerHTML += `<option value="${a.id}">${a.type} - ${a.number}</option>`;
      });
    }

    const withdrawSelect = document.getElementById('withdrawAccount');
    if (withdrawSelect) {
      withdrawSelect.innerHTML = '<option value="">Select account</option>';
      accounts.forEach(a => {
        withdrawSelect.innerHTML += `<option value="${a.id}">${a.type} - ${a.number} (₹${Number(a.balance).toLocaleString()})</option>`;
      });
    }

    const billAccount = document.getElementById('payBillAccount');
    if (billAccount) {
      billAccount.innerHTML = '<option value="">Select account</option>';
      accounts.forEach(a => {
        billAccount.innerHTML += `<option value="${a.id}">${a.type} - ${a.number} (₹${Number(a.balance).toLocaleString()})</option>`;
      });
    }

    // Account type select for new account
    document.getElementById('newAccountType').value = 'Savings';
  },

  showAccountDetails(accountId) {
    const result = App.getAccount(accountId);
    if (!result) return;
    const { account, user } = result;
    const txs = App.getUserTransactions(accountId);
    const modal = document.getElementById('accountDetailModal');
    document.getElementById('accDetailType').textContent = `${account.type} Account`;
    document.getElementById('accDetailNumber').textContent = account.number;
    document.getElementById('accDetailBalance').textContent = `₹${Number(account.balance).toLocaleString()}`;
    document.getElementById('accDetailStatus').textContent = account.status.charAt(0).toUpperCase() + account.status.slice(1);
    document.getElementById('accDetailStatus').className = `badge badge-${account.status === 'active' ? 'success' : 'danger'}`;
    document.getElementById('accDetailCreated').textContent = new Date(account.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const list = document.getElementById('accDetailTx');
    list.innerHTML = '';
    const recent = txs.slice(0, 5);
    if (recent.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-light)">No transactions</div>';
    } else {
      recent.forEach(tx => {
        const isCredit = tx.type === 'credit';
        const date = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        list.innerHTML += `
          <div class="transaction-item">
            <div class="tx-icon ${isCredit ? 'credit' : 'debit'}">${isCredit ? '↓' : '↑'}</div>
            <div class="tx-info">
              <div class="tx-title">${tx.description}</div>
              <div class="tx-date">${date}</div>
            </div>
            <div class="tx-amount ${isCredit ? 'credit' : 'debit'}">${isCredit ? '+' : '-'}₹${Number(tx.amount).toLocaleString()}</div>
          </div>
        `;
      });
    }
    modal.classList.add('active');
  },

  // ===================== TRANSACTIONS =====================
  renderTransactions() {
    const filterType = document.getElementById('txTypeFilter')?.value || 'all';
    const filterAccount = document.getElementById('txAccountFilter')?.value || 'all';
    const searchTerm = document.getElementById('txSearch')?.value?.toLowerCase() || '';

    let txs = App.getUserTransactions();
    if (filterType !== 'all') txs = txs.filter(t => t.type === filterType);
    if (filterAccount !== 'all') txs = txs.filter(t => t.accountId === filterAccount);
    if (searchTerm) txs = txs.filter(t => t.description.toLowerCase().includes(searchTerm));

    const list = document.getElementById('transactionsList');
    list.innerHTML = '';
    if (txs.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-light)">No transactions found</div>';
    } else {
      txs.forEach(tx => {
        const isCredit = tx.type === 'credit';
        const date = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const accounts = App.getUserAccounts();
        const acc = accounts.find(a => a.id === tx.accountId);
        list.innerHTML += `
          <div class="transaction-item">
            <div class="tx-icon ${isCredit ? 'credit' : 'debit'}">${isCredit ? '↓' : '↑'}</div>
            <div class="tx-info">
              <div class="tx-title">${tx.description}</div>
              <div class="tx-date">${date} ${acc ? `· ${acc.type}` : ''}</div>
            </div>
            <div class="tx-amount ${isCredit ? 'credit' : 'debit'}">${isCredit ? '+' : '-'}₹${Number(tx.amount).toLocaleString()}</div>
          </div>
        `;
      });
    }
  },

  // ===================== LOANS =====================
  renderLoans() {
    const loans = App.getUserLoans();
    const grid = document.getElementById('loansGrid');
    grid.innerHTML = '';
    if (loans.length === 0) {
      grid.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-light);grid-column:1/-1">No loan applications yet</div>';
    } else {
      loans.forEach(loan => {
        const statusClass = loan.status;
        const appliedDate = new Date(loan.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const amount = loan.approvedAmount || loan.amount;
        grid.innerHTML += `
          <div class="loan-card ${statusClass}">
            <h3>${loan.type}</h3>
            <div class="loan-type">Applied: ${appliedDate} · ${loan.purpose || 'No purpose specified'}</div>
            <div class="loan-amount">₹${Number(amount).toLocaleString()}</div>
            <span class="badge badge-${statusClass === 'approved' ? 'success' : statusClass === 'pending' ? 'warning' : 'danger'}">${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}</span>
            <div class="loan-details">
              <span>Tenure <strong>${loan.tenure} months</strong></span>
              <span>Rate <strong>${loan.interestRate}%</strong></span>
              ${loan.status === 'approved' ? `<span>EMI <strong>₹${Number(loan.emi).toLocaleString()}</strong></span>
              <span>Progress <strong>${loan.paidEmis}/${loan.totalEmis}</strong></span>` : ''}
            </div>
          </div>
        `;
      });
    }
    this.renderLoanTypes();
    this.renderAdminLoans();
  },

  renderLoanTypes() {
    const types = [
      { name: 'Personal Loan', icon: '👤', rate: '10.5%', desc: 'For personal expenses, travel, or weddings', color: '#dbeafe' },
      { name: 'Home Loan', icon: '🏠', rate: '8.5%', desc: 'Buy your dream home with easy EMI', color: '#d1fae5' },
      { name: 'Car Loan', icon: '🚗', rate: '9.5%', desc: 'Drive home your dream car today', color: '#fef3c7' },
      { name: 'Education Loan', icon: '🎓', rate: '8.0%', desc: 'Invest in your future with education funding', color: '#e0e7ff' },
      { name: 'Business Loan', icon: '💼', rate: '12.0%', desc: 'Grow your business with working capital', color: '#fce7f3' }
    ];
    const grid = document.getElementById('loanTypesGrid');
    grid.innerHTML = '';
    types.forEach(t => {
      grid.innerHTML += `
        <div class="loan-type-card" onclick="document.getElementById('loanType').value='${t.name}'; UI.openModal('applyLoanModal')">
          <div class="lt-icon" style="background:${t.color}">${t.icon}</div>
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
          <div class="lt-rate">${t.rate}</div>
          <div style="font-size:12px;color:var(--text-light)">Interest Rate</div>
        </div>
      `;
    });
  },

  // ===================== BILLS =====================
  renderBills() {
    const bills = App.getUserBills();
    const list = document.getElementById('billsList');
    list.innerHTML = '';
    if (bills.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-light)">No bills found</div>';
    } else {
      bills.forEach(bill => {
        const due = new Date(bill.dueDate);
        const dueStr = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const isOverdue = bill.status === 'pending' && due < new Date();
        list.innerHTML += `
          <div class="transaction-item">
            <div class="tx-icon transfer" style="background:${bill.status === 'paid' ? 'var(--success-bg)' : isOverdue ? 'var(--danger-bg)' : 'var(--warning-bg)'}">${bill.type === 'Electricity' ? '⚡' : bill.type === 'Internet' ? '🌐' : bill.type === 'Water' ? '💧' : bill.type === 'Phone' ? '📱' : '💳'}</div>
            <div class="tx-info">
              <div class="tx-title">${bill.provider} - ${bill.type}</div>
              <div class="tx-date">Due: ${dueStr} ${bill.status === 'paid' ? `· Paid: ${new Date(bill.paidDate).toLocaleDateString()}` : ''}</div>
            </div>
            <div style="text-align:right">
              <div class="tx-amount debit">₹${Number(bill.amount).toLocaleString()}</div>
              <span class="badge badge-${bill.status === 'paid' ? 'success' : isOverdue ? 'danger' : 'warning'}">${bill.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}</span>
            </div>
          </div>
        `;
      });
    }
  },

  // ===================== NOTIFICATIONS =====================
  renderNotifications() {
    const notifs = App.getUserNotifications().slice(0, 10);
    const count = App.getUnreadNotifCount();
    const dot = document.getElementById('notifDot');
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
    document.getElementById('notifCount').textContent = count;
    document.getElementById('notifCount').style.display = count > 0 ? 'inline' : 'none';

    const list = document.getElementById('notifList');
    if (!list) return;
    list.innerHTML = '';
    if (notifs.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-light);font-size:14px">No notifications</div>';
    } else {
      notifs.forEach(n => {
        const date = new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        list.innerHTML += `
          <div class="transaction-item" style="${n.read ? 'opacity:0.7' : ''}" onclick="UI.markNotifRead('${n.id}')">
            <div class="tx-icon ${n.type === 'credit' ? 'credit' : n.type === 'debit' ? 'debit' : 'transfer'}">
              ${n.type === 'credit' ? '↓' : n.type === 'debit' ? '↑' : n.type === 'loan' ? '💰' : '📄'}
            </div>
            <div class="tx-info">
              <div class="tx-title">${n.message}</div>
              <div class="tx-date">${date}</div>
            </div>
            ${!n.read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--secondary);flex-shrink:0"></span>' : ''}
          </div>
        `;
      });
    }
  },

  markNotifRead(id) {
    App.markNotifRead(id);
    this.renderNotifications();
  },

  // ===================== PROFILE =====================
  renderProfile() {
    const user = App.getCurrentUser();
    if (!user) return;
    document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileRole').textContent = user.role === 'admin' ? 'Administrator' : 'Customer';
    document.getElementById('profileMemberSince').textContent = new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('editName').value = user.name;
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editAddress').value = user.address || '';
  },

  // ===================== ADMIN =====================
  renderAdmin() {
    const stats = App.getAdminStats();
    document.getElementById('adminTotalUsers').textContent = stats.totalUsers;
    document.getElementById('adminTotalAccounts').textContent = stats.totalAccounts;
    document.getElementById('adminTotalTx').textContent = stats.totalTransactions;
    document.getElementById('adminTotalBalance').textContent = `₹${stats.totalBalance.toLocaleString()}`;
    document.getElementById('adminPendingLoans').textContent = stats.pendingLoans;
    document.getElementById('adminTotalLoans').textContent = stats.totalLoans;

    this.renderAdminUsers();
    this.renderAdminLoans();
    this.renderAdminTx();
  },

  renderAdminUsers() {
    const users = App.getUsers();
    const list = document.getElementById('adminUsersList');
    if (!list) return;
    list.innerHTML = '';
    users.forEach(u => {
      const totalBal = u.accounts.reduce((s, a) => s + a.balance, 0);
      const allActive = u.accounts.every(a => a.status === 'active');
      list.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td><span class="badge badge-${u.role === 'admin' ? 'info' : 'neutral'}">${u.role}</span></td>
          <td>${u.accounts.length}</td>
          <td>₹${totalBal.toLocaleString()}</td>
          <td><span class="badge badge-${allActive ? 'success' : 'danger'}">${allActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            ${u.role !== 'admin' ? `<button class="btn btn-sm ${allActive ? 'btn-danger' : 'btn-primary'}" onclick="UI.toggleUser('${u.id}')">${allActive ? 'Deactivate' : 'Activate'}</button>` : '-'}
          </td>
        </tr>
      `;
    });
  },

  renderAdminLoans() {
    const loans = App.getAllLoans();
    const list = document.getElementById('adminLoansList');
    if (!list) return;
    list.innerHTML = '';
    if (loans.length === 0) {
      list.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-light)">No loan applications</td></tr>';
    } else {
      loans.forEach(loan => {
        const user = App.getUser(loan.userId);
        const date = new Date(loan.appliedDate).toLocaleDateString();
        list.innerHTML += `
          <tr>
            <td>${user ? user.name : 'Unknown'}</td>
            <td>${loan.type}</td>
            <td>₹${Number(loan.amount).toLocaleString()}</td>
            <td>${date}</td>
            <td><span class="badge badge-${loan.status === 'approved' ? 'success' : loan.status === 'pending' ? 'warning' : 'danger'}">${loan.status}</span></td>
            <td>${loan.status === 'approved' ? `₹${Number(loan.emi).toLocaleString()}/mo` : '-'}</td>
            <td>
              ${loan.status === 'pending' ? `
                <button class="btn btn-sm btn-primary" onclick="UI.openApproveLoanModal('${loan.id}')">Approve</button>
                <button class="btn btn-sm btn-danger" onclick="UI.rejectLoan('${loan.id}')">Reject</button>
              ` : '-'}
            </td>
          </tr>
        `;
      });
    }
  },

  renderAdminTx() {
    const txs = App.getAllTransactions().slice(0, 20);
    const list = document.getElementById('adminTxList');
    if (!list) return;
    list.innerHTML = '';
    txs.forEach(tx => {
      const user = App.getUser(tx.userId);
      const date = new Date(tx.date).toLocaleDateString();
      list.innerHTML += `
        <tr>
          <td>${user ? user.name : 'Unknown'}</td>
          <td>${tx.description}</td>
          <td><span class="badge badge-${tx.type === 'credit' ? 'success' : 'danger'}">${tx.type}</span></td>
          <td class="tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}">${tx.type === 'credit' ? '+' : '-'}₹${Number(tx.amount).toLocaleString()}</td>
          <td>${date}</td>
          <td><span class="badge badge-success">${tx.status}</span></td>
        </tr>
      `;
    });
  },

  toggleUser(userId) {
    const result = App.toggleUserStatus(userId);
    if (result.ok) { App.state.currentUser = App.getUser(App.getCurrentUser().id); this.showToast(result.msg, 'success'); this.renderAdmin(); }
    else { this.showToast(result.msg, 'error'); }
  },

  openApproveLoanModal(loanId) {
    const data = App.data();
    const loan = data.loans.find(l => l.id === loanId);
    if (!loan) return;
    document.getElementById('approveLoanId').value = loanId;
    document.getElementById('approveLoanAmount').value = loan.amount;
    document.getElementById('approveLoanInfo').textContent = `${loan.type} - ₹${Number(loan.amount).toLocaleString()}`;
    this.openModal('approveLoanModal');
  },

  approveLoan() {
    const loanId = document.getElementById('approveLoanId').value;
    const amount = document.getElementById('approveLoanAmount').value;
    if (!amount || amount <= 0) { this.showToast('Enter a valid approval amount', 'error'); return; }
    const result = App.approveLoan(loanId, amount);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('approveLoanModal'); this.renderLoans(); this.renderAdmin(); }
    else { this.showToast(result.msg, 'error'); }
  },

  rejectLoan(loanId) {
    if (!confirm('Reject this loan application?')) return;
    const result = App.rejectLoan(loanId);
    if (result.ok) { this.showToast(result.msg, 'success'); this.renderLoans(); this.renderAdmin(); }
  },

  // ===================== TOAST =====================
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // ===================== MODALS =====================
  openModal(id) { document.getElementById(id).classList.add('active'); },
  closeModal(id) { document.getElementById(id).classList.remove('active'); },
  closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); },

  // ===================== AUTH =====================
  showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('authFormTitle').textContent = 'Welcome Back';
    document.getElementById('authFormSubtitle').textContent = 'Sign in to your SecureBank account';
  },

  showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('authFormTitle').textContent = 'Create Account';
    document.getElementById('authFormSubtitle').textContent = 'Join SecureBank and manage your finances';
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { this.showToast('Please fill in all fields', 'error'); return; }
    const result = App.login(email, password);
    if (result.ok) { this.showToast(`Welcome back, ${result.user.name}!`, 'success'); this.showApp(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    if (!name || !email || !phone || !password || !confirm) { this.showToast('Please fill in all fields', 'error'); return; }
    if (password !== confirm) { this.showToast('Passwords do not match', 'error'); return; }
    if (password.length < 6) { this.showToast('Password must be at least 6 characters', 'error'); return; }
    const result = App.register(name, email, phone, password);
    if (result.ok) { this.showToast(result.msg, 'success'); this.showLoginForm(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handleLogout() {
    App.logout();
    this.showToast('Logged out successfully', 'info');
  },

  // ===================== ACCOUNT ACTIONS =====================
  createAccount() {
    const type = document.getElementById('newAccountType').value;
    const result = App.createAccount(type);
    if (result.ok) { this.showToast(result.msg, 'success'); this.renderAccounts(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handleDeposit(e) {
    e.preventDefault();
    const accountId = document.getElementById('depositAccount').value;
    const amount = document.getElementById('depositAmount').value;
    const description = document.getElementById('depositDescription').value || 'Deposit';
    if (!accountId) { this.showToast('Select an account', 'error'); return; }
    if (!amount || amount <= 0) { this.showToast('Enter a valid amount', 'error'); return; }
    const result = App.deposit(accountId, amount, description);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('depositModal'); this.renderDashboard(); this.renderAccounts(); this.renderTransactions(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handleWithdraw(e) {
    e.preventDefault();
    const accountId = document.getElementById('withdrawAccount').value;
    const amount = document.getElementById('withdrawAmount').value;
    const description = document.getElementById('withdrawDescription').value || 'Withdrawal';
    if (!accountId) { this.showToast('Select an account', 'error'); return; }
    if (!amount || amount <= 0) { this.showToast('Enter a valid amount', 'error'); return; }
    const result = App.withdraw(accountId, amount, description);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('withdrawModal'); this.renderDashboard(); this.renderAccounts(); this.renderTransactions(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handleTransfer(e) {
    e.preventDefault();
    const fromAccountId = document.getElementById('transferFromAccount').value;
    const toAccount = document.getElementById('transferToAccount').value;
    const amount = document.getElementById('transferAmount').value;
    const description = document.getElementById('transferDescription').value || '';
    if (!fromAccountId) { this.showToast('Select source account', 'error'); return; }
    if (!toAccount) { this.showToast('Enter destination account number', 'error'); return; }
    if (!amount || amount <= 0) { this.showToast('Enter a valid amount', 'error'); return; }
    const result = App.transfer(fromAccountId, toAccount.toUpperCase(), amount, description);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('transferModal'); this.renderDashboard(); this.renderAccounts(); this.renderTransactions(); }
    else { this.showToast(result.msg, 'error'); }
  },

  // ===================== LOAN ACTIONS =====================
  handleApplyLoan(e) {
    e.preventDefault();
    const type = document.getElementById('loanType').value;
    const amount = document.getElementById('loanAmount').value;
    const tenure = document.getElementById('loanTenure').value;
    const purpose = document.getElementById('loanPurpose').value;
    if (!type) { this.showToast('Select a loan type', 'error'); return; }
    if (!amount || amount < 10000) { this.showToast('Minimum loan amount is ₹10,000', 'error'); return; }
    if (!tenure || tenure < 6) { this.showToast('Minimum tenure is 6 months', 'error'); return; }
    if (!purpose) { this.showToast('Please state the purpose', 'error'); return; }
    const result = App.applyLoan(type, Number(amount), Number(tenure), purpose);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('applyLoanModal'); this.renderLoans(); }
    else { this.showToast(result.msg, 'error'); }
  },

  // ===================== BILL ACTIONS =====================
  handleAddBill(e) {
    e.preventDefault();
    const type = document.getElementById('billType').value;
    const provider = document.getElementById('billProvider').value;
    const amount = document.getElementById('billAmount').value;
    const dueDate = document.getElementById('billDueDate').value;
    if (!type || !provider || !amount || !dueDate) { this.showToast('Fill in all bill details', 'error'); return; }
    const result = App.addBill(type, provider, amount, dueDate);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('addBillModal'); this.renderBills(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handlePayBill(e) {
    e.preventDefault();
    const billSelect = document.getElementById('billSelect');
    const accountId = document.getElementById('payBillAccount').value;
    if (!billSelect.value) { this.showToast('Select a bill to pay', 'error'); return; }
    if (!accountId) { this.showToast('Select an account', 'error'); return; }
    const result = App.payBill(billSelect.value, accountId);
    if (result.ok) { this.showToast(result.msg, 'success'); this.closeModal('payBillModal'); this.renderDashboard(); this.renderBills(); this.renderAccounts(); }
    else { this.showToast(result.msg, 'error'); }
  },

  openPayBillModal() {
    const bills = App.getUserBills().filter(b => b.status === 'pending');
    const select = document.getElementById('billSelect');
    select.innerHTML = '<option value="">Select a bill</option>';
    bills.forEach(b => {
      select.innerHTML += `<option value="${b.id}">${b.provider} - ${b.type} (₹${Number(b.amount).toLocaleString()})</option>`;
    });
    if (bills.length === 0) {
      this.showToast('No pending bills to pay', 'warning');
      return;
    }
    this.openModal('payBillModal');
  },

  // ===================== PROFILE ACTIONS =====================
  handleUpdateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const address = document.getElementById('editAddress').value;
    if (!name) { this.showToast('Name is required', 'error'); return; }
    const result = App.updateProfile(name, phone, address);
    if (result.ok) { this.showToast(result.msg, 'success'); this.renderUserInfo(); this.renderProfile(); }
    else { this.showToast(result.msg, 'error'); }
  },

  handleChangePassword(e) {
    e.preventDefault();
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    if (!oldPwd || !newPwd || !confirmPwd) { this.showToast('Fill in all password fields', 'error'); return; }
    if (newPwd !== confirmPwd) { this.showToast('New passwords do not match', 'error'); return; }
    if (newPwd.length < 6) { this.showToast('Password must be at least 6 characters', 'error'); return; }
    const result = App.changePassword(oldPwd, newPwd);
    if (result.ok) { this.showToast(result.msg, 'success'); document.getElementById('changePasswordForm').reset(); }
    else { this.showToast(result.msg, 'error'); }
  },

  // ===================== EVENTS =====================
  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page === 'logout') { this.handleLogout(); return; }
        this.navigateTo(page);
      });
    });

    // Auth
    document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    document.getElementById('showRegister').addEventListener('click', () => this.showRegisterForm());
    document.getElementById('showLogin').addEventListener('click', () => this.showLoginForm());

    // Modal closes
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    });
    document.querySelectorAll('.modal-close').forEach(b => {
      b.addEventListener('click', () => {
        b.closest('.modal-overlay').classList.remove('active');
      });
    });

    // Account actions
    document.getElementById('createAccountBtn').addEventListener('click', () => this.createAccount());
    document.getElementById('depositForm').addEventListener('submit', (e) => this.handleDeposit(e));
    document.getElementById('withdrawForm').addEventListener('submit', (e) => this.handleWithdraw(e));
    document.getElementById('transferForm').addEventListener('submit', (e) => this.handleTransfer(e));

    // Loan
    document.getElementById('applyLoanForm').addEventListener('submit', (e) => this.handleApplyLoan(e));
    document.getElementById('approveLoanForm').addEventListener('submit', (e) => { e.preventDefault(); this.approveLoan(); });

    // Bills
    document.getElementById('addBillForm').addEventListener('submit', (e) => this.handleAddBill(e));
    document.getElementById('payBillForm').addEventListener('submit', (e) => this.handlePayBill(e));

    // Profile
    document.getElementById('profileForm').addEventListener('submit', (e) => this.handleUpdateProfile(e));
    document.getElementById('changePasswordForm').addEventListener('submit', (e) => this.handleChangePassword(e));

    // Transaction filters
    document.getElementById('txTypeFilter')?.addEventListener('change', () => this.renderTransactions());
    document.getElementById('txAccountFilter')?.addEventListener('change', () => this.renderTransactions());
    document.getElementById('txSearch')?.addEventListener('input', () => this.renderTransactions());

    // Notifications
    document.getElementById('notifBtn')?.addEventListener('click', () => {
      this.openModal('notifModal');
      App.markAllNotifRead();
      this.renderNotifications();
    });

    // Mobile toggle
    document.getElementById('mobileToggle')?.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });

    // Password toggles
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('.form-input');
        if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
        else { input.type = 'password'; btn.textContent = '👁'; }
      });
    });

    // Window resize for chart
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (App.state.currentPage === 'dashboard') this.renderDashboardChart();
      }, 300);
    });

    // Keyboard: Escape to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllModals();
    });

    // Set default dates
    const dueDateInput = document.getElementById('billDueDate');
    if (dueDateInput) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      dueDateInput.value = nextMonth.toISOString().split('T')[0];
    }
  }
};

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => UI.init());
