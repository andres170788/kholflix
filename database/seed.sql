USE kholflix;

-- =============================================
-- SUBSCRIPTION PLANS
-- =============================================
INSERT INTO subscription_plans (name, price, interval_months, max_devices, can_download, video_quality, features_json) VALUES
('Free', 0, 1, 1, FALSE, 'SD', '{"ads": true, "limited_catalog": true}'),
('Basic', 4.99, 1, 2, FALSE, 'HD', '{"ads": false, "limited_catalog": false}'),
('Premium', 9.99, 1, 4, TRUE, '4K', '{"ads": false, "limited_catalog": false, "early_access": true}'),
('Ultra', 14.99, 1, 6, TRUE, '4K HDR', '{"ads": false, "limited_catalog": false, "early_access": true, "behind_scenes": true}');

-- =============================================
-- ADMIN USER (password: admin123)
-- =============================================
INSERT INTO users (username, email, password_hash, display_name, role, subscription_plan_id) VALUES
('admin', 'admin@kholflix.com', '$2b$10$YQ8qK5H6J3Z3VZJ5U7zXeOKJL9n7RqY4K8mN6wP2xD1fG3hI5jK7L', 'KHOLCORP Admin', 'admin', 4);

-- =============================================
-- GENRES
-- =============================================
INSERT INTO genres (name, slug, image_url) VALUES
('Sci-Fi', 'sci-fi', NULL),
('Drama', 'drama', NULL),
('Action', 'action', NULL),
('Fantasy', 'fantasy', NULL),
('Horror', 'horror', NULL),
('Comedy', 'comedy', NULL),
('Thriller', 'thriller', NULL),
('Romance', 'romance', NULL),
('Animation', 'animation', NULL),
('Documentary', 'documentary', NULL),
('Mystery', 'mystery', NULL),
('Adventure', 'adventure', NULL);

-- =============================================
-- CONTENT (AI-Generated Movies & Series)
-- =============================================
INSERT INTO content (title, slug, type, description, poster_url, backdrop_url, video_url, video_source, duration_minutes, release_date, ai_model, ai_prompt, ai_making_of, rating_avg, view_count, is_featured, status, created_by) VALUES

-- MOVIES
('Neural Horizons', 'neural-horizons', 'movie',
'In 2147, a sentient AI discovers emotions through dreams. As it learns to feel love, fear, and hope, it must decide whether to share this gift with humanity or keep it hidden to protect them from themselves.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
128, '2026-01-15', 'Sora',
'A cinematic sci-fi film about an AI that discovers emotions through dreaming, photorealistic, 4K, dramatic lighting',
'This film was generated entirely using OpenAI Sora. The process involved 847 individual prompts, each carefully crafted to maintain visual consistency across scenes. Character designs were established in the first 50 prompts and referenced throughout.',
4.5, 15420, TRUE, 'published', 1),

('The Last Canvas', 'the-last-canvas', 'movie',
'When an art forger discovers that AI can create masterpieces indistinguishable from human art, she faces an existential crisis. A meditation on creativity in the age of artificial intelligence.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
98, '2026-02-01', 'Runway Gen-3',
'An intimate drama about an art forger confronting AI creativity, warm color palette, cinematic aspect ratio',
'Created with Runway Gen-3 Alpha. Each scene was generated individually and stitched together using traditional editing. The art pieces shown in the film were created using Midjourney v6.',
4.2, 8930, TRUE, 'published', 1),

('Quantum Shadows', 'quantum-shadows', 'movie',
'A physicist discovers that parallel universes are colliding, causing people to encounter their alternate selves. When her other self turns out to be a villain, she must stop the merge before reality collapses.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
115, '2026-02-10', 'Kling AI',
'Sci-fi thriller about parallel universes colliding, dark moody atmosphere, VFX-heavy scenes',
'Generated using Kling AI 1.5. The parallel universe effects were achieved by generating the same scenes with subtle variations and compositing them together.',
4.7, 22100, TRUE, 'published', 1),

('Whispers in Code', 'whispers-in-code', 'movie',
'A programmer discovers hidden messages in legacy code that predict future events. As she decodes more, she realizes the code was written by an AI from the future trying to prevent a catastrophe.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
105, '2026-01-28', 'Sora',
'Tech thriller with neo-noir aesthetics, a female programmer discovering prophetic code, cyberpunk elements',
'Combined Sora for live-action scenes with custom code visualizations. The "code prophecy" sequences were hand-designed to be visually striking.',
4.0, 6750, FALSE, 'published', 1),

('Echoes of Tomorrow', 'echoes-of-tomorrow', 'movie',
'In a world where memories can be downloaded, a detective investigates a murder using the victim memories. But as she dives deeper, she discovers her own memories have been altered.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
132, '2026-02-20', 'Runway Gen-3',
'Neo-noir detective story in a memory-download future, atmospheric, rain-soaked cities',
'Runway Gen-3 was used for all scenes. The memory-diving sequences used a distinct visual style with desaturated colors and film grain.',
4.8, 28500, TRUE, 'published', 1),

('The Garden of Machines', 'the-garden-of-machines', 'movie',
'After humanity leaves Earth, the robots left behind begin to evolve. They create art, music, and eventually religion. A poetic exploration of consciousness and purpose.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
95, '2026-01-05', 'Kling AI',
'Philosophical sci-fi about robots developing culture after humans leave, beautiful landscapes, surreal imagery',
'An experimental film using Kling AI. Each robot character was designed with a unique visual identity. The "machine religion" scenes took over 200 generation attempts to achieve the desired ethereal quality.',
4.3, 11200, FALSE, 'published', 1),

('Neon Dreams', 'neon-dreams', 'movie',
'A street artist in Neo-Tokyo uses augmented reality to create living murals. When her art starts influencing people behavior, the government tries to shut her down.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
110, '2026-02-14', 'Sora',
'Cyberpunk action drama set in Neo-Tokyo, vibrant neon colors, street art culture meets technology',
'Sora generated all environments and characters. The AR art sequences were created separately and composited. Over 1,200 prompts were used for the full film.',
4.6, 19800, TRUE, 'published', 1),

('Frozen Algorithms', 'frozen-algorithms', 'movie',
'Scientists in Antarctica discover an ancient AI frozen in the ice for millions of years. When they activate it, they realize it was created by a civilization that preceded humanity.',
NULL, NULL,
'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube',
120, '2026-02-28', 'Runway Gen-3',
'Sci-fi horror in Antarctica, ancient alien AI, claustrophobic research station, blizzard conditions',
'A combination of Runway Gen-3 for character scenes and Midjourney for environment concepts. The ancient AI design went through 50+ iterations.',
4.1, 7800, FALSE, 'published', 1),

-- SERIES
('Digital Souls', 'digital-souls', 'series',
'An anthology series where each episode explores a different aspect of AI consciousness. From an AI therapist who develops anxiety to a virtual pet that experiences grief.',
NULL, NULL,
NULL, NULL,
NULL, '2026-01-10', 'Sora',
'Anthology series about AI consciousness, each episode with distinct visual style',
'Each episode was generated with a unique visual palette to match its theme. The series required maintaining character consistency across different art styles.',
4.4, 35000, TRUE, 'published', 1),

('The Synthetic Age', 'the-synthetic-age', 'series',
'In 2089, synthetic humans live among us. This political drama follows a synthetic senator fighting for equal rights while hiding her true nature from the public.',
NULL, NULL,
NULL, NULL,
NULL, '2026-02-05', 'Kling AI',
'Political drama about synthetic humans seeking rights, realistic cinematography, Washington DC setting',
'Kling AI was chosen for its photorealistic output. The political scenes required careful attention to facial expressions and body language.',
4.6, 42000, TRUE, 'published', 1),

('Prompt Masters', 'prompt-masters', 'series',
'A reality competition where contestants use AI tools to create short films. The twist: the AI judges the creativity of the prompts, not just the output.',
NULL, NULL,
NULL, NULL,
NULL, '2026-02-15', 'Multiple',
'Reality TV show about AI filmmaking competition, bright studio lighting, diverse contestants',
'A meta-series about AI filmmaking. Each contestant episode was generated using the AI tool the fictional contestant chose. Behind-the-scenes footage shows the actual prompting process.',
4.1, 18500, FALSE, 'published', 1);

-- =============================================
-- CONTENT_GENRES RELATIONSHIPS
-- =============================================
INSERT INTO content_genres (content_id, genre_id) VALUES
-- Neural Horizons: Sci-Fi, Drama
(1, 1), (1, 2),
-- The Last Canvas: Drama, Mystery
(2, 2), (2, 11),
-- Quantum Shadows: Sci-Fi, Thriller, Action
(3, 1), (3, 7), (3, 3),
-- Whispers in Code: Thriller, Mystery, Sci-Fi
(4, 7), (4, 11), (4, 1),
-- Echoes of Tomorrow: Sci-Fi, Mystery, Drama
(5, 1), (5, 11), (5, 2),
-- The Garden of Machines: Sci-Fi, Drama, Animation
(6, 1), (6, 2), (6, 9),
-- Neon Dreams: Action, Sci-Fi, Drama
(7, 3), (7, 1), (7, 2),
-- Frozen Algorithms: Sci-Fi, Horror, Thriller
(8, 1), (8, 5), (8, 7),
-- Digital Souls: Sci-Fi, Drama
(9, 1), (9, 2),
-- The Synthetic Age: Sci-Fi, Drama, Thriller
(10, 1), (10, 2), (10, 7),
-- Prompt Masters: Comedy, Documentary
(11, 6), (11, 10);

-- =============================================
-- SEASONS & EPISODES for Series
-- =============================================

-- Digital Souls - Season 1
INSERT INTO seasons (content_id, season_number, title) VALUES
(9, 1, 'Awakening');

INSERT INTO episodes (season_id, episode_number, title, description, video_url, video_source, duration_minutes, ai_model) VALUES
(1, 1, 'The Therapist', 'An AI therapist begins experiencing the anxiety of its patients.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 42, 'Sora'),
(1, 2, 'Digital Pet', 'A virtual companion experiences grief when its owner passes away.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 38, 'Sora'),
(1, 3, 'The Artist', 'An AI painter struggles with the concept of originality.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 45, 'Sora'),
(1, 4, 'Mirror Image', 'A deepfake AI develops its own identity separate from its source.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 40, 'Sora'),
(1, 5, 'The Judge', 'An AI judge questions whether justice can truly be algorithmic.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 44, 'Sora'),
(1, 6, 'Convergence', 'All AI characters from previous episodes meet in a shared dream.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 52, 'Sora');

-- The Synthetic Age - Season 1
INSERT INTO seasons (content_id, season_number, title) VALUES
(10, 1, 'The Campaign');

INSERT INTO episodes (season_id, episode_number, title, description, video_url, video_source, duration_minutes, ai_model) VALUES
(2, 1, 'Inauguration Day', 'Senator Maya Chen takes office, hiding her synthetic nature.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 55, 'Kling AI'),
(2, 2, 'The Bill', 'Maya introduces the Synthetic Rights Act, sparking controversy.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 48, 'Kling AI'),
(2, 3, 'Exposure', 'A journalist gets close to discovering Maya true identity.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 50, 'Kling AI'),
(2, 4, 'Alliance', 'Maya forms an unlikely alliance with a human rights activist.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 47, 'Kling AI'),
(2, 5, 'The Vote', 'Season finale: The Synthetic Rights Act goes to vote.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 58, 'Kling AI');

-- Prompt Masters - Season 1
INSERT INTO seasons (content_id, season_number, title) VALUES
(11, 1, 'Season One');

INSERT INTO episodes (season_id, episode_number, title, description, video_url, video_source, duration_minutes, ai_model) VALUES
(3, 1, 'The Challenge Begins', 'Ten contestants face their first AI filmmaking challenge.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 60, 'Multiple'),
(3, 2, 'Genre Swap', 'Contestants must create a film in a genre they have never tried.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 58, 'Multiple'),
(3, 3, 'The Remix', 'Teams must recreate a classic scene using only AI tools.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 55, 'Multiple'),
(3, 4, 'Finals', 'The top three contestants compete for the title of Prompt Master.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 65, 'Multiple');

-- =============================================
-- CAST MEMBERS
-- =============================================
INSERT INTO cast_members (name, photo_url, biography, known_for, birth_place) VALUES
('Aria Chen', NULL, 'AI-generated actress specializing in dramatic roles. First appeared in Neural Horizons.', 'Neural Horizons, Digital Souls', 'Generated - Sora'),
('Marcus Webb', NULL, 'Virtual actor known for action and thriller roles.', 'Quantum Shadows, Neon Dreams', 'Generated - Kling AI'),
('Luna Rodriguez', NULL, 'Digital performer with a talent for emotional depth.', 'The Last Canvas, Echoes of Tomorrow', 'Generated - Runway'),
('Viktor Okafor', NULL, 'AI character actor. Brings gravitas to every role.', 'The Synthetic Age, Frozen Algorithms', 'Generated - Kling AI'),
('Zoe Park', NULL, 'Versatile AI actress. Comedy to horror, she does it all.', 'Prompt Masters, Digital Souls', 'Generated - Multiple');

-- =============================================
-- CONTENT_CAST
-- =============================================
INSERT INTO content_cast (content_id, cast_member_id, role, character_name) VALUES
(1, 1, 'Lead', 'ARIA-7'),
(1, 2, 'Supporting', 'Dr. James Cole'),
(2, 3, 'Lead', 'Elena Vasquez'),
(3, 2, 'Lead', 'Dr. Nathan Cross'),
(3, 1, 'Supporting', 'Alt-Nathan'),
(4, 1, 'Lead', 'Sarah Lin'),
(5, 3, 'Lead', 'Detective Maya Reeves'),
(5, 4, 'Supporting', 'Commissioner Okafor'),
(6, 4, 'Lead', 'Unit-7 (Narrator)'),
(7, 2, 'Lead', 'Kai Tanaka'),
(7, 1, 'Supporting', 'Yuki'),
(8, 4, 'Lead', 'Dr. Erik Johansson'),
(9, 1, 'Lead', 'Various'),
(9, 5, 'Supporting', 'Various'),
(10, 3, 'Lead', 'Senator Maya Chen'),
(10, 4, 'Supporting', 'Senator Williams'),
(11, 5, 'Host', 'Host');
