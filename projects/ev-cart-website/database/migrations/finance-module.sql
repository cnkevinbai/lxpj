-- =====================================================
-- 财务管理模块 - 数据库表
-- =====================================================

-- 应收账款表
CREATE TABLE IF NOT EXISTS finance_receivables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receivable_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(200) NOT NULL,
    order_id UUID,
    order_code VARCHAR(50),
    amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    balance DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_terms VARCHAR(100),
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_receivables_code ON finance_receivables(receivable_code);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_customer ON finance_receivables(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_status ON finance_receivables(status);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_due_date ON finance_receivables(due_date);

-- 应付账款表
CREATE TABLE IF NOT EXISTS finance_payables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payable_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID,
    supplier_name VARCHAR(200) NOT NULL,
    purchase_order_id UUID,
    purchase_order_code VARCHAR(50),
    amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    balance DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_terms VARCHAR(100),
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_payables_code ON finance_payables(payable_code);
CREATE INDEX IF NOT EXISTS idx_finance_payables_supplier ON finance_payables(supplier_id);
CREATE INDEX IF NOT EXISTS idx_finance_payables_status ON finance_payables(status);

-- 收款记录表
CREATE TABLE IF NOT EXISTS finance_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_code VARCHAR(50) UNIQUE NOT NULL,
    receivable_id UUID REFERENCES finance_receivables(id),
    customer_id UUID,
    customer_name VARCHAR(200) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    bank_account VARCHAR(100),
    transaction_ref VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_payments_code ON finance_payments(payment_code);
CREATE INDEX IF NOT EXISTS idx_finance_payments_customer ON finance_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_payments_date ON finance_payments(payment_date);

-- 付款记录表
CREATE TABLE IF NOT EXISTS finance_disbursements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disbursement_code VARCHAR(50) UNIQUE NOT NULL,
    payable_id UUID REFERENCES finance_payables(id),
    supplier_id UUID,
    supplier_name VARCHAR(200) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    bank_account VARCHAR(100),
    transaction_ref VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_disbursements_code ON finance_disbursements(disbursement_code);
CREATE INDEX IF NOT EXISTS idx_finance_disbursements_supplier ON finance_disbursements(supplier_id);

-- 发票表
CREATE TABLE IF NOT EXISTS finance_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_code VARCHAR(50) UNIQUE NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(200) NOT NULL,
    order_id UUID,
    amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    issue_date DATE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_invoices_code ON finance_invoices(invoice_code);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_number ON finance_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_customer ON finance_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_status ON finance_invoices(status);

-- 银行账户表
CREATE TABLE IF NOT EXISTS finance_bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name VARCHAR(200) NOT NULL,
    bank_name VARCHAR(200) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'CNY',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_finance_bank_accounts_active ON finance_bank_accounts(is_active);

-- 插入默认银行账户
INSERT INTO finance_bank_accounts (account_name, bank_name, account_number, balance) VALUES
    ('基本账户', '中国银行深圳分行', '6225 8888 8888 8888', 1000000.00),
    ('一般账户', '招商银行深圳分行', '6225 6666 6666 6666', 500000.00),
    ('纳税账户', '工商银行深圳分行', '6225 9999 9999 9999', 200000.00)
ON CONFLICT DO NOTHING;
