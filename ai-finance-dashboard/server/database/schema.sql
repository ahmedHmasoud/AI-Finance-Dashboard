-- Create schema
CREATE SCHEMA IF NOT EXISTS finance;
SET search_path TO finance;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_income BOOLEAN DEFAULT false,
    is_transfer BOOLEAN DEFAULT false,
    transfer_reference UUID,
    FOREIGN KEY (transfer_reference) REFERENCES transactions(id) ON DELETE SET NULL
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    CONSTRAINT valid_dates CHECK (start_date <= end_date)
);

-- Recurring transactions table
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
    day_of_week INTEGER,
    day_of_month INTEGER,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    CHECK (
        (frequency = 'daily' AND day_of_week IS NULL AND day_of_month IS NULL) OR
        (frequency = 'weekly' AND day_of_week IS NOT NULL AND day_of_month IS NULL) OR
        (frequency = 'monthly' AND day_of_week IS NULL AND day_of_month IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category_id);
CREATE INDEX idx_recurring_transactions_user ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_category ON recurring_transactions(category_id);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_timestamp
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_budgets_timestamp
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_recurring_transactions_timestamp
    BEFORE UPDATE ON recurring_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Insert default categories
INSERT INTO categories (name, description) VALUES
    ('Income', 'All income sources'),
    ('Groceries', 'Food and grocery shopping'),
    ('Restaurants', 'Dining out and food delivery'),
    ('Transportation', 'Public transport, fuel, parking'),
    ('Utilities', 'Electricity, water, gas, internet'),
    ('Entertainment', 'Movies, streaming, sports'),
    ('Shopping', 'Retail purchases and clothing'),
    ('Health', 'Medical expenses and prescriptions'),
    ('Education', 'Tuition and educational materials'),
    ('Bills', 'Regular bills and payments'),
    ('Other', 'Miscellaneous expenses');

-- Create views for common queries
CREATE VIEW monthly_transactions AS
SELECT 
    user_id,
    category_id,
    date_trunc('month', transaction_date) as month,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions
WHERE is_income = false
GROUP BY user_id, category_id, date_trunc('month', transaction_date)
ORDER BY month DESC;

CREATE VIEW budget_vs_actual AS
SELECT 
    b.user_id,
    b.category_id,
    b.start_date,
    b.end_date,
    b.amount as budget_amount,
    COALESCE(SUM(t.amount), 0) as actual_amount,
    (COALESCE(SUM(t.amount), 0) / b.amount * 100) as percentage_used
FROM budgets b
LEFT JOIN transactions t ON 
    b.user_id = t.user_id AND 
    b.category_id = t.category_id AND 
    t.transaction_date BETWEEN b.start_date AND b.end_date
WHERE b.is_active = true
GROUP BY b.user_id, b.category_id, b.start_date, b.end_date, b.amount
ORDER BY b.start_date DESC;
