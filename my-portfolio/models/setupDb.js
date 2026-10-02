-- ==========================================
-- 1. ADMINS TABLE (Login credentials & personal profile info)
-- ==========================================
CREATE TABLE IF NOT EXISTS admins (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    linkedin_url TEXT,
    github_url TEXT,
    location VARCHAR(150),
    bio_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. PROJECTS TABLE (Software builds, links, and video evidence)
-- ==========================================
CREATE TABLE IF NOT EXISTS projects (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(300) NOT NULL,
    full_description TEXT,
    problem_solved TEXT,
    my_role VARCHAR(150),
    tech_stack VARCHAR(255) NOT NULL,
    github_url TEXT,
    live_url TEXT,
    video_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. SKILLS TABLE (Categorized technical stack and status)
-- ==========================================
CREATE TABLE IF NOT EXISTS skills (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT 'actively using',
    display_order INT DEFAULT 0
);

-- ==========================================
-- 4. EXPERIENCES TABLE (Education and work history)
-- ==========================================
CREATE TABLE IF NOT EXISTS experiences (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('education', 'experience')),
    title VARCHAR(200) NOT NULL,
    institution_or_company VARCHAR(200) NOT NULL,
    location VARCHAR(150),
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0
);

-- ==========================================
-- 5. PROFESSIONAL ACTIVITIES TABLE (Hackathons, events, certifications)
-- ==========================================
CREATE TABLE IF NOT EXISTS professional_activities (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_name VARCHAR(200) NOT NULL,
    organization VARCHAR(200) NOT NULL,
    date VARCHAR(50),
    description TEXT,
    certificate_url TEXT,
    display_order INT DEFAULT 0
);

-- ==========================================
-- 6. MESSAGES TABLE (Recruiter contact form inquiries)
-- ==========================================
CREATE TABLE IF NOT EXISTS messages (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sender_name VARCHAR(150) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    message_body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);