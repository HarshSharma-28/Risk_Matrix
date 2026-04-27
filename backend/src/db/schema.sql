-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
  first_name    TEXT,
  last_name     TEXT,
  phone_number  TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CUSTOMER PROFILES TABLE
-- ============================================================
CREATE TABLE customer_profiles (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  address       TEXT,
  income        NUMERIC(15,2),
  debt_amount   NUMERIC(15,2),
  credit_score  INTEGER CHECK (credit_score BETWEEN 300 AND 900),
  risk_score    NUMERIC(5,2) CHECK (risk_score BETWEEN 0 AND 100),
  risk_factors  JSONB,
  last_assessed TIMESTAMPTZ
);

-- ============================================================
-- EMPLOYEE PROFILES TABLE
-- ============================================================
CREATE TABLE employee_profiles (
  user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  department  TEXT,
  designation TEXT
);

-- ============================================================
-- LOAN SCHEMES TABLE
-- ============================================================
CREATE TABLE loan_schemes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  interest_rate NUMERIC(5,2) NOT NULL,
  min_amount    NUMERIC(15,2),
  max_amount    NUMERIC(15,2),
  min_tenure    INTEGER,
  max_tenure    INTEGER,
  eligibility   JSONB,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RISK FACTOR DEFINITIONS TABLE
-- ============================================================
CREATE TABLE risk_factors_definitions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT UNIQUE NOT NULL,
  description    TEXT,
  default_weight NUMERIC(5,2) NOT NULL DEFAULT 1.0,
  min_value      NUMERIC(15,2),
  max_value      NUMERIC(15,2),
  category       TEXT,
  is_active      BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- RISK ASSESSMENTS TABLE
-- ============================================================
CREATE TABLE risk_assessments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      UUID NOT NULL REFERENCES users(id),
  assessed_by      UUID REFERENCES users(id),
  assessment_date  TIMESTAMPTZ DEFAULT now(),
  input_factors    JSONB NOT NULL,
  calculated_score NUMERIC(5,2) NOT NULL,
  explanation      TEXT,
  recommendations  TEXT,
  decision         TEXT CHECK (decision IN ('APPROVE', 'REVIEW', 'REJECT')),
  fraud_flag       BOOLEAN DEFAULT FALSE,
  fraud_reason     TEXT
);

-- ============================================================
-- ARYA INTERACTIONS TABLE
-- ============================================================
CREATE TABLE arya_interactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  timestamp       TIMESTAMPTZ DEFAULT now(),
  query_text      TEXT NOT NULL,
  response_text   TEXT NOT NULL,
  language        TEXT NOT NULL DEFAULT 'en',
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5)
);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  timestamp   TIMESTAMPTZ DEFAULT now(),
  action_type TEXT NOT NULL,
  details     JSONB,
  ip_address  TEXT
);

-- ============================================================
-- SAVED QUOTES TABLE
-- ============================================================
CREATE TABLE saved_quotes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_name      TEXT NOT NULL,
  loan_type      TEXT NOT NULL,
  interest_rate  NUMERIC(5,2) NOT NULL,
  max_amount     NUMERIC(15,2) NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_risk_assessments_customer ON risk_assessments(customer_id);
CREATE INDEX idx_risk_assessments_date ON risk_assessments(assessment_date DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_arya_interactions_user ON arya_interactions(user_id);
CREATE INDEX idx_saved_quotes_user ON saved_quotes(user_id);

-- Enable RLS on all tables
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE arya_interactions ENABLE ROW LEVEL SECURITY;

-- Customers can only see their own profile
CREATE POLICY "customers_own_profile" ON customer_profiles
  FOR ALL USING (user_id = auth.uid());

-- Customers can only see their own assessments
CREATE POLICY "customers_own_assessments" ON risk_assessments
  FOR SELECT USING (customer_id = auth.uid());

-- Employees can see all assessments
CREATE POLICY "employees_all_assessments" ON risk_assessments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin')
    )
  );
