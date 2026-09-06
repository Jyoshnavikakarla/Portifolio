/*
# Portfolio Database Schema for Jyoshnavi K V

## Overview
Creates the complete database schema for a personal developer portfolio with an admin CMS.
Public portfolio content (projects, certificates, achievements, education, social links, site settings)
is readable by everyone (anon) but only writable by authenticated admins.
Contact messages can be submitted by anyone but only viewed/managed by authenticated admins.

## New Tables
1. `projects` — portfolio projects with title, description, technologies, features, links, image, featured flag, category, sort order
2. `certificates` — certifications with name, issuer, date, image, credential URL, description
3. `achievements` — achievements with title and description
4. `education` — education timeline entries with degree, institution, graduation year, score
5. `social_links` — singleton row holding GitHub, LinkedIn, email, and other professional links
6. `site_settings` — singleton row holding resume URL and other site-wide settings
7. `contact_messages` — messages submitted via the public contact form

## Storage Buckets
- `certificates` — public bucket for certificate file uploads (PDF, JPG, PNG)
- `project-images` — public bucket for project thumbnail uploads

## Security (RLS)
- Public read (anon + authenticated) on: projects, certificates, achievements, education, social_links, site_settings
- Authenticated-only write on: projects, certificates, achievements, education, social_links, site_settings
- Public insert (anon + authenticated) on: contact_messages
- Authenticated-only read/update/delete on: contact_messages
- Storage: public read on both buckets, authenticated-only upload/update/delete
*/

-- ============ PROJECTS ============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  category text NOT NULL DEFAULT 'Web Application',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ============ CERTIFICATES ============
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuing_organization text NOT NULL,
  date text,
  image_url text,
  credential_url text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certificates" ON certificates;
CREATE POLICY "public_read_certificates" ON certificates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_certificates" ON certificates;
CREATE POLICY "auth_insert_certificates" ON certificates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_certificates" ON certificates;
CREATE POLICY "auth_update_certificates" ON certificates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_certificates" ON certificates;
CREATE POLICY "auth_delete_certificates" ON certificates FOR DELETE
  TO authenticated USING (true);

-- ============ ACHIEVEMENTS ============
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_achievements" ON achievements;
CREATE POLICY "auth_insert_achievements" ON achievements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_achievements" ON achievements;
CREATE POLICY "auth_update_achievements" ON achievements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_achievements" ON achievements;
CREATE POLICY "auth_delete_achievements" ON achievements FOR DELETE
  TO authenticated USING (true);

-- ============ EDUCATION ============
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  graduation_year text,
  score text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_education" ON education;
CREATE POLICY "auth_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_education" ON education;
CREATE POLICY "auth_update_education" ON education FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_education" ON education;
CREATE POLICY "auth_delete_education" ON education FOR DELETE
  TO authenticated USING (true);

-- ============ SOCIAL LINKS (singleton) ============
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  github_url text,
  linkedin_url text,
  email text,
  other_links jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social_links" ON social_links;
CREATE POLICY "public_read_social_links" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_social_links" ON social_links;
CREATE POLICY "auth_insert_social_links" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_social_links" ON social_links;
CREATE POLICY "auth_update_social_links" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_social_links" ON social_links;
CREATE POLICY "auth_delete_social_links" ON social_links FOR DELETE
  TO authenticated USING (true);

-- ============ SITE SETTINGS (singleton) ============
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- ============ CONTACT MESSAGES ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_contact_messages" ON contact_messages;
CREATE POLICY "auth_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('certificates', 'certificates', true),
  ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for certificates bucket
DROP POLICY IF EXISTS "public_read_certificates_bucket" ON storage.objects;
CREATE POLICY "public_read_certificates_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "auth_write_certificates_bucket" ON storage.objects;
CREATE POLICY "auth_write_certificates_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "auth_update_certificates_bucket" ON storage.objects;
CREATE POLICY "auth_update_certificates_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'certificates') WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "auth_delete_certificates_bucket" ON storage.objects;
CREATE POLICY "auth_delete_certificates_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'certificates');

-- Storage policies for project-images bucket
DROP POLICY IF EXISTS "public_read_project_images_bucket" ON storage.objects;
CREATE POLICY "public_read_project_images_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "auth_write_project_images_bucket" ON storage.objects;
CREATE POLICY "auth_write_project_images_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "auth_update_project_images_bucket" ON storage.objects;
CREATE POLICY "auth_update_project_images_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images') WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "auth_delete_project_images_bucket" ON storage.objects;
CREATE POLICY "auth_delete_project_images_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-images');

-- ============ SEED DATA ============

-- Projects
INSERT INTO projects (title, description, technologies, features, github_url, live_url, image_url, featured, category, sort_order) VALUES
(
  'Disaster Response Coordination Platform',
  'Real-time crisis coordination platform designed to broadcast emergency alerts and streamline public communication during natural disasters.',
  ARRAY['React.js', 'Node.js', 'MongoDB', '3D Models', 'JWT', 'Interactive Maps'],
  ARRAY['Emergency alerts', 'Interactive map-based notifications', 'JWT-based authentication', '3D visualization dashboard', 'MongoDB-backed data', 'Real-time coordination'],
  '', '', '', true, 'Full-Stack Web Application', 1
),
(
  'Live Drawing on Webcam Feed',
  'Real-time computer vision application that enables users to draw directly over a live webcam feed using hand/mouse interaction.',
  ARRAY['Python', 'OpenCV', 'NumPy'],
  ARRAY['Live camera feed', 'Drawing overlay', 'Brush thickness controls', 'Color selection', 'Eraser', 'Undo', 'Real-time frame processing'],
  '', '', '', false, 'Computer Vision', 2
),
(
  'Movie Finder Application',
  'Responsive movie discovery application that retrieves dynamic movie information through the OMDB API.',
  ARRAY['React.js', 'JavaScript', 'CSS3', 'OMDB API'],
  ARRAY['Movie search', 'Movie details', 'Ratings', 'Plot summaries', 'Posters', 'Filtering', 'Responsive interface'],
  '', '', '', false, 'Web Application', 3
)
ON CONFLICT DO NOTHING;

-- Certificates
INSERT INTO certificates (name, issuing_organization, date, image_url, credential_url, description, sort_order) VALUES
(
  'Agile & Scrum Professional Certification',
  'Infosys Springboard',
  NULL, '', '', 'Professional certification in Agile methodologies and Scrum framework practices.', 1
),
(
  'Git & GitHub Bootcamp',
  'LetsUpgrade',
  NULL, '', '', 'Hands-on bootcamp covering version control with Git and collaborative development on GitHub.', 2
),
(
  'Python for Beginners Certification',
  'Scalar Academy',
  NULL, '', '', 'Foundational Python programming certification covering core syntax, data structures, and basic problem-solving.', 3
)
ON CONFLICT DO NOTHING;

-- Achievements
INSERT INTO achievements (title, description, sort_order) VALUES
(
  'Zerodha Varsity Finance & Current Affairs Quiz',
  'Active participant in a campus-wide financial literacy and current affairs drive at Garden City University.',
  1
)
ON CONFLICT DO NOTHING;

-- Education
INSERT INTO education (degree, institution, graduation_year, score, sort_order) VALUES
(
  'Bachelor of Engineering — Computer Science',
  'Garden City University, Bangalore',
  'Expected 2027',
  'CGPA: 9.36 / 10',
  1
),
(
  'Class XII',
  'Valley View PU College',
  NULL,
  '89.66%',
  2
),
(
  'Class X',
  'Citizens'' English School',
  NULL,
  'Grade A',
  3
)
ON CONFLICT DO NOTHING;

-- Social Links (singleton)
INSERT INTO social_links (github_url, linkedin_url, email, other_links)
SELECT '', '', '', '[]'
WHERE NOT EXISTS (SELECT 1 FROM social_links);

-- Site Settings (singleton)
INSERT INTO site_settings (resume_url)
SELECT ''
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
