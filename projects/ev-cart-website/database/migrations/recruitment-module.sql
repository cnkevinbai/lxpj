-- =====================================================
-- 招聘管理模块 - 数据库表创建脚本
-- =====================================================
-- 创建时间：2026-03-12
-- 模块：职位管理 + 简历管理 + 面试管理
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 职位表
-- =====================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    education VARCHAR(50) NOT NULL,
    salary_min DECIMAL(12,2) NOT NULL,
    salary_max DECIMAL(12,2) NOT NULL,
    headcount INT NOT NULL DEFAULT 1,
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_by UUID,
    created_by_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_jobs_job_code ON jobs(job_code);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

-- =====================================================
-- 2. 简历表
-- =====================================================
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_code VARCHAR(50) UNIQUE NOT NULL,
    candidate_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    education VARCHAR(50),
    major VARCHAR(100),
    experience VARCHAR(50),
    current_company VARCHAR(200),
    position VARCHAR(200),
    expected_salary VARCHAR(50),
    job_id UUID REFERENCES jobs(id),
    status VARCHAR(20) DEFAULT 'new',
    source VARCHAR(50) DEFAULT 'website',
    resume_url TEXT,
    resume_content TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_resumes_resume_code ON resumes(resume_code);
CREATE INDEX IF NOT EXISTS idx_resumes_candidate_name ON resumes(candidate_name);
CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(email);
CREATE INDEX IF NOT EXISTS idx_resumes_job_id ON resumes(job_id);
CREATE INDEX IF NOT EXISTS idx_resumes_status ON resumes(status);
CREATE INDEX IF NOT EXISTS idx_resumes_applied_at ON resumes(applied_at);

-- =====================================================
-- 3. 面试表
-- =====================================================
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_code VARCHAR(50) UNIQUE NOT NULL,
    resume_id UUID REFERENCES resumes(id),
    job_id UUID REFERENCES jobs(id),
    candidate_name VARCHAR(100) NOT NULL,
    candidate_phone VARCHAR(20),
    candidate_email VARCHAR(255),
    interview_type VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INT DEFAULT 60,
    interviewer VARCHAR(100) NOT NULL,
    interviewer_email VARCHAR(255),
    location VARCHAR(255),
    meeting_link TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    feedback TEXT,
    rating INT,
    result VARCHAR(20),
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_interviews_interview_code ON interviews(interview_code);
CREATE INDEX IF NOT EXISTS idx_interviews_resume_id ON interviews(resume_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job_id ON interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

-- =====================================================
-- 4. 面试反馈表
-- =====================================================
CREATE TABLE IF NOT EXISTS interview_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES interviews(id),
    interviewer VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    technical_score INT,
    communication_score INT,
    culture_fit_score INT,
    comments TEXT,
    recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_interview_feedbacks_interview_id ON interview_feedbacks(interview_id);

-- =====================================================
-- 5. 招聘渠道表
-- =====================================================
CREATE TABLE IF NOT EXISTS recruitment_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    channel_type VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    cost DECIMAL(12,2),
    resume_count INT DEFAULT 0,
    hired_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_recruitment_channels_name ON recruitment_channels(name);
CREATE INDEX IF NOT EXISTS idx_recruitment_channels_type ON recruitment_channels(channel_type);
CREATE INDEX IF NOT EXISTS idx_recruitment_channels_active ON recruitment_channels(is_active);

-- =====================================================
-- 插入默认数据
-- =====================================================
INSERT INTO recruitment_channels (name, channel_type, is_active) VALUES
    ('公司官网', 'website', true),
    ('智联招聘', 'zhilian', true),
    ('前程无忧', '51job', true),
    ('BOSS 直聘', 'boss', true),
    ('猎聘网', 'liepin', true),
    ('LinkedIn', 'linkedin', true),
    ('内部推荐', 'referral', true),
    ('校园招聘', 'campus', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 创建视图：招聘统计
-- =====================================================
CREATE OR REPLACE VIEW recruitment_stats_view AS
SELECT 
    j.id as job_id,
    j.job_code,
    j.title,
    j.department,
    j.status as job_status,
    COUNT(DISTINCT r.id) as resume_count,
    COUNT(DISTINCT i.id) as interview_count,
    COUNT(DISTINCT CASE WHEN i.result = 'pass' THEN i.id END) as passed_count,
    COUNT(DISTINCT CASE WHEN r.status = 'hired' THEN r.id END) as hired_count
FROM jobs j
LEFT JOIN resumes r ON r.job_id = j.id
LEFT JOIN interviews i ON i.resume_id = r.id
GROUP BY j.id, j.job_code, j.title, j.department, j.status;

-- =====================================================
-- 验证查询
-- =====================================================
-- 查看创建的表
-- SELECT tablename FROM pg_tables WHERE tablename LIKE '%job%' OR tablename LIKE '%resume%' OR tablename LIKE '%interview%' ORDER BY tablename;

-- 查看默认招聘渠道
-- SELECT name, channel_type FROM recruitment_channels WHERE is_active = true;

-- =====================================================
