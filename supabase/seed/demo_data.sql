-- ============================================================
-- Primme Platform — Demo Seed Data
-- Run: npx supabase db query --linked -f supabase/seed/demo_data.sql
-- ============================================================

-- User UUIDs (from auth.users / profiles)
-- homeowner@primme-usa.com  = 238805ce-2fd8-495a-a0e6-4df6416efe97
-- provider@primme-usa.com   = d6873d4c-a130-42c1-8c9a-761878373ce0
-- partner@primme-usa.com    = 0509a1f2-204c-4448-a082-c19ac7243759

DO $$
DECLARE
  v_hw  uuid := '238805ce-2fd8-495a-a0e6-4df6416efe97';
  v_pv  uuid := 'd6873d4c-a130-42c1-8c9a-761878373ce0';
  v_pt  uuid := '0509a1f2-204c-4448-a082-c19ac7243759';

  v_proj1 uuid := 'a1000000-0000-0000-0000-000000000001';
  v_proj2 uuid := 'a1000000-0000-0000-0000-000000000002';
  v_proj3 uuid := 'a1000000-0000-0000-0000-000000000003';
  v_proj4 uuid := 'a1000000-0000-0000-0000-000000000004';

  v_conv1 uuid := 'c0000000-0000-0000-0000-000000000001';
  v_conv2 uuid := 'c0000000-0000-0000-0000-000000000002';
  v_conv3 uuid := 'c0000000-0000-0000-0000-000000000003';
BEGIN

-- ============================================================
-- Update profiles with richer demo data
-- ============================================================
UPDATE public.profiles SET
  name = 'James Whitfield',
  phone = '(305) 555-1200',
  initials = 'JW',
  avatar_url = 'https://i.pravatar.cc/150?u=homeowner'
WHERE id = v_hw;

UPDATE public.profiles SET
  name = 'Carlos Mendez',
  phone = '(305) 555-3400',
  initials = 'CM',
  avatar_url = 'https://i.pravatar.cc/150?u=provider'
WHERE id = v_pv;

UPDATE public.profiles SET
  name = 'Sofia Ramirez',
  phone = '(305) 555-7800',
  initials = 'SR',
  avatar_url = 'https://i.pravatar.cc/150?u=partner'
WHERE id = v_pt;

-- ============================================================
-- Projects (4) — owned by homeowner
-- ============================================================
INSERT INTO public.projects (id, user_id, title, status, description, address, type, budget, timeline, thumbnail_url, progress, created_at)
VALUES
  (v_proj1, v_hw,
   'Downtown Penthouse Painting',
   'in_progress',
   'Full interior repaint of a luxury 3,200 sq ft penthouse — custom color palette with Benjamin Moore Aura line. Includes ceiling treatments and accent walls.',
   '1200 Brickell Bay Dr, Miami, FL 33131',
   'Interior Painting',
   145000, '8 weeks',
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
   75,
   now() - interval '45 days'),

  (v_proj2, v_hw,
   'Brickell Condo Kitchen Remodel',
   'active',
   'Modern kitchen transformation — quartz countertops, custom cabinetry with soft-close hardware, under-cabinet LED lighting, and waterfall island.',
   '485 Brickell Ave, Miami, FL 33131',
   'Kitchen Remodel',
   68000, '6 weeks',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
   30,
   now() - interval '20 days'),

  (v_proj3, v_hw,
   'Coral Gables Exterior Repaint',
   'completed',
   'Complete exterior repaint of a Mediterranean-style estate. Pressure wash, prime, two coats of Sherwin-Williams Duration with 15-year warranty.',
   '742 Alhambra Cir, Coral Gables, FL 33134',
   'Exterior Painting',
   15200, '3 weeks',
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
   100,
   now() - interval '90 days'),

  (v_proj4, v_hw,
   'South Beach Studio Refresh',
   'draft',
   'Art Deco studio apartment refresh — limewash walls, refinished original hardwood, custom built-in shelving, and designer light fixtures.',
   '1500 Ocean Dr, Miami Beach, FL 33139',
   'Interior Renovation',
   22000, '2 weeks',
   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
   0,
   now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Milestones (12) — 3 per project
-- ============================================================
INSERT INTO public.milestones (id, project_id, title, status, due_date, completed_at, created_at) VALUES
  -- Project 1 (in_progress, 75%)
  (gen_random_uuid(), v_proj1, 'Surface Preparation & Priming',    'completed',   (now() - interval '30 days')::date, now() - interval '28 days', now() - interval '44 days'),
  (gen_random_uuid(), v_proj1, 'Main Interior Painting',           'in_progress', (now() + interval '5 days')::date,  NULL,                        now() - interval '44 days'),
  (gen_random_uuid(), v_proj1, 'Final Inspection & Touch-Ups',     'pending',     (now() + interval '14 days')::date, NULL,                        now() - interval '44 days'),

  -- Project 2 (active, 30%)
  (gen_random_uuid(), v_proj2, 'Demolition & Rough-In',            'completed',   (now() - interval '10 days')::date, now() - interval '8 days',  now() - interval '19 days'),
  (gen_random_uuid(), v_proj2, 'Cabinet & Countertop Installation', 'in_progress', (now() + interval '14 days')::date, NULL,                        now() - interval '19 days'),
  (gen_random_uuid(), v_proj2, 'Finishing & Appliance Hookup',     'pending',     (now() + interval '25 days')::date, NULL,                        now() - interval '19 days'),

  -- Project 3 (completed, 100%)
  (gen_random_uuid(), v_proj3, 'Pressure Wash & Surface Prep',     'completed',   (now() - interval '80 days')::date, now() - interval '78 days', now() - interval '89 days'),
  (gen_random_uuid(), v_proj3, 'Exterior Priming & Painting',      'completed',   (now() - interval '72 days')::date, now() - interval '70 days', now() - interval '89 days'),
  (gen_random_uuid(), v_proj3, 'Final Walkthrough & Warranty',     'completed',   (now() - interval '65 days')::date, now() - interval '63 days', now() - interval '89 days'),

  -- Project 4 (draft, 0%)
  (gen_random_uuid(), v_proj4, 'Design Consultation & Material Selection', 'pending', (now() + interval '14 days')::date, NULL, now() - interval '2 days'),
  (gen_random_uuid(), v_proj4, 'Wall Treatment & Flooring',                'pending', (now() + interval '21 days')::date, NULL, now() - interval '2 days'),
  (gen_random_uuid(), v_proj4, 'Built-Ins & Final Styling',                'pending', (now() + interval '28 days')::date, NULL, now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Project Members — provider assigned to first 3 projects
-- ============================================================
INSERT INTO public.project_members (project_id, user_id, role_in_project) VALUES
  (v_proj1, v_pv, 'contractor'),
  (v_proj2, v_pv, 'contractor'),
  (v_proj3, v_pv, 'contractor'),
  (v_proj1, v_hw, 'owner'),
  (v_proj2, v_hw, 'owner'),
  (v_proj3, v_hw, 'owner'),
  (v_proj4, v_hw, 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- ============================================================
-- Documents (8) — 2 per active project
-- ============================================================
INSERT INTO public.documents (project_id, name, url, type, uploaded_by, created_at) VALUES
  (v_proj1, 'Penthouse Painting Contract.pdf',   'https://example.com/docs/contract-penthouse.pdf',   'contract', v_hw, now() - interval '44 days'),
  (v_proj1, 'Color Palette Approval.pdf',         'https://example.com/docs/palette-penthouse.pdf',    'report',   v_pv, now() - interval '35 days'),
  (v_proj2, 'Kitchen Remodel Agreement.pdf',      'https://example.com/docs/contract-kitchen.pdf',     'contract', v_hw, now() - interval '19 days'),
  (v_proj2, 'Demolition Progress Photos.zip',     'https://example.com/docs/demo-photos-kitchen.zip',  'photo',    v_pv, now() - interval '10 days'),
  (v_proj3, 'Exterior Paint Contract.pdf',        'https://example.com/docs/contract-exterior.pdf',    'contract', v_hw, now() - interval '89 days'),
  (v_proj3, 'Final Inspection Report.pdf',        'https://example.com/docs/inspection-exterior.pdf',  'report',   v_pv, now() - interval '63 days'),
  (v_proj3, 'Warranty Certificate.pdf',           'https://example.com/docs/warranty-exterior.pdf',    'contract', v_pv, now() - interval '62 days'),
  (v_proj1, 'Invoice #1042 — Phase 2.pdf',       'https://example.com/docs/invoice-1042.pdf',         'invoice',  v_pv, now() - interval '7 days');

-- ============================================================
-- Conversations (3) — one per user pair
-- ============================================================
INSERT INTO public.conversations (id, created_at) VALUES
  (v_conv1, now() - interval '40 days'),
  (v_conv2, now() - interval '30 days'),
  (v_conv3, now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Conversation Participants (6)
-- ============================================================
INSERT INTO public.conversation_participants (conversation_id, user_id) VALUES
  (v_conv1, v_hw), (v_conv1, v_pv),
  (v_conv2, v_hw), (v_conv2, v_pt),
  (v_conv3, v_pv), (v_conv3, v_pt)
ON CONFLICT (conversation_id, user_id) DO NOTHING;

-- ============================================================
-- Messages (18) — 6 per conversation, realistic threads
-- ============================================================
INSERT INTO public.messages (conversation_id, sender_id, content, created_at) VALUES
  -- Conv 1: Homeowner <-> Provider (project discussion)
  (v_conv1, v_hw, 'Hi Carlos, when can you start the penthouse painting? The building cleared us for next Monday.',               now() - interval '39 days'),
  (v_conv1, v_pv, 'Monday works great, James. I''ll bring the crew at 8 AM. We''ll start with the ceiling prep in the master.',  now() - interval '39 days' + interval '2 hours'),
  (v_conv1, v_hw, 'Perfect. The HOA requires a $500 deposit for the freight elevator — I''ll handle that today.',                 now() - interval '38 days'),
  (v_conv1, v_pv, 'Got it. I''ve ordered the Benjamin Moore Aura line — the custom colors should arrive by Thursday.',            now() - interval '38 days' + interval '3 hours'),
  (v_conv1, v_hw, 'Phase 1 looks incredible! The accent wall in the living room is exactly what I envisioned.',                    now() - interval '20 days'),
  (v_conv1, v_pv, 'Thank you! We''re moving to the bedrooms this week. I''ll send progress photos Friday.',                       now() - interval '20 days' + interval '1 hour'),

  -- Conv 2: Homeowner <-> Partner (referral follow-up)
  (v_conv2, v_pt, 'Hi James! I saw you signed up through my referral link — welcome to Primme! How can I help you get started?',  now() - interval '29 days'),
  (v_conv2, v_hw, 'Hey Sofia! Yes, your recommendation convinced me. I need a painter for my penthouse — any suggestions?',       now() - interval '29 days' + interval '4 hours'),
  (v_conv2, v_pt, 'Absolutely! Carlos Mendez is one of our top-rated providers. He specializes in luxury residential projects.',   now() - interval '28 days'),
  (v_conv2, v_hw, 'I just hired Carlos — the penthouse project is underway. Thanks for the introduction!',                        now() - interval '25 days'),
  (v_conv2, v_pt, 'That''s wonderful! You should also check out the benefits page — your Silver tier unlocks some great deals.',   now() - interval '25 days' + interval '2 hours'),
  (v_conv2, v_hw, 'Will do. Also thinking about a kitchen remodel — Carlos recommended your platform for finding specialists.',    now() - interval '15 days'),

  -- Conv 3: Provider <-> Partner (partnership inquiry)
  (v_conv3, v_pv, 'Sofia, I keep getting great leads from Primme. How does the referral program work for providers?',              now() - interval '19 days'),
  (v_conv3, v_pt, 'Hi Carlos! Providers can earn referral bonuses too — for every new provider you bring in, you get $150.',       now() - interval '19 days' + interval '3 hours'),
  (v_conv3, v_pv, 'That''s solid. I have a few colleagues in the Coral Gables area who would be interested.',                      now() - interval '18 days'),
  (v_conv3, v_pt, 'Perfect! I''ll send you a custom referral link. You''ll earn Silver tier after 5 successful referrals.',         now() - interval '18 days' + interval '1 hour'),
  (v_conv3, v_pv, 'I shared the link with 3 contractors this morning. Two have already started their applications.',                now() - interval '10 days'),
  (v_conv3, v_pt, 'Amazing progress! I see their applications in the system. Keep it up and you''ll be at Gold tier in no time!',   now() - interval '10 days' + interval '2 hours');

-- ============================================================
-- Payments (8) — linked to homeowner
-- ============================================================
INSERT INTO public.payments (user_id, amount, status, description, method, created_at) VALUES
  (v_hw, 36250,  'completed', 'Penthouse Painting — Phase 1 Deposit',        'credit_card',   now() - interval '44 days'),
  (v_hw, 36250,  'completed', 'Penthouse Painting — Phase 2 Progress',       'bank_transfer',  now() - interval '25 days'),
  (v_hw, 4560,   'completed', 'Exterior Repaint — Final Payment',            'credit_card',   now() - interval '63 days'),
  (v_hw, 10640,  'completed', 'Exterior Repaint — Milestone 1 & 2',         'zelle',          now() - interval '78 days'),
  (v_hw, 20400,  'completed', 'Kitchen Remodel — Initial Deposit',           'bank_transfer',  now() - interval '19 days'),
  (v_hw, 27200,  'pending',   'Penthouse Painting — Phase 3 (Final)',        'credit_card',   now() - interval '2 days'),
  (v_hw, 47600,  'pending',   'Kitchen Remodel — Cabinet & Countertop',      'bank_transfer',  now() - interval '1 day'),
  (v_hw, 500,    'refunded',  'Freight Elevator Deposit — Refunded by HOA',  'credit_card',   now() - interval '35 days');

-- ============================================================
-- Referrals (7) — linked to partner
-- ============================================================
INSERT INTO public.referrals (partner_id, referred_email, referred_name, status, commission, created_at) VALUES
  (v_pt, 'james.w@gmail.com',        'James Whitfield',   'converted', 250.00, now() - interval '35 days'),
  (v_pt, 'michael.chen@outlook.com',  'Michael Chen',      'converted', 185.00, now() - interval '28 days'),
  (v_pt, 'laura.santos@gmail.com',    'Laura Santos',      'converted', 120.00, now() - interval '20 days'),
  (v_pt, 'david.park@icloud.com',     'David Park',        'signed_up',   0.00, now() - interval '12 days'),
  (v_pt, 'elena.morales@yahoo.com',   'Elena Morales',     'signed_up',   0.00, now() - interval '8 days'),
  (v_pt, 'robert.thompson@gmail.com', 'Robert Thompson',   'pending',     0.00, now() - interval '3 days'),
  (v_pt, 'anna.kowalski@outlook.com', 'Anna Kowalski',     'pending',     0.00, now() - interval '1 day');

-- ============================================================
-- Benefits (10) — global catalog
-- ============================================================
INSERT INTO public.benefits (title, description, category, tier_required, discount_percent, provider_name, image_url) VALUES
  ('Premium Paint Discount',
   'Get 25% off all Sherwin-Williams Duration and Emerald lines. Available at participating locations nationwide.',
   'materials', 'bronze', 25, 'Sherwin-Williams',
   'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'),

  ('Pro Tools & Equipment',
   'Save 20% on professional-grade tools, sprayers, and equipment rentals at any Home Depot Pro Desk.',
   'materials', 'bronze', 20, 'Home Depot',
   'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'),

  ('Cabinet Hardware Bundle',
   '30% off premium cabinet hardware and soft-close mechanisms. Minimum order $200.',
   'materials', 'silver', 30, 'Restoration Hardware',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),

  ('Interior Design Consultation',
   'Complimentary 1-hour design consultation with certified interior designers. Valued at $250.',
   'design', 'silver', 100, 'Havenly',
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400'),

  ('3D Room Visualization',
   'Free 3D rendering of your project space. Upload photos, get a photorealistic visualization in 48 hours.',
   'design', 'bronze', 100, 'Modsy',
   'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400'),

  ('Project Insurance Coverage',
   'Exclusive 15% discount on contractor liability and project-specific insurance policies.',
   'insurance', 'silver', 15, 'State Farm',
   'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'),

  ('Home Warranty Extension',
   '10% off comprehensive home warranty plans covering all renovated areas for up to 5 years.',
   'insurance', 'gold', 10, 'American Home Shield',
   'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'),

  ('Project Financing — 0% APR',
   'Qualify for 0% APR financing on projects up to $100K for 18 months. Pre-approval in minutes.',
   'financing', 'silver', 0, 'GreenSky',
   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'),

  ('Luxury Furniture Discount',
   'Save 20% on curated collections at West Elm and Pottery Barn. Perfect for staging renovated spaces.',
   'lifestyle', 'gold', 20, 'West Elm',
   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'),

  ('Smart Home Starter Kit',
   'Get 25% off Nest, Ring, and Lutron smart home bundles. Ideal for completing your renovation.',
   'lifestyle', 'bronze', 25, 'Best Buy',
   'https://images.unsplash.com/photo-1558002038-1055907df827?w=400');

END $$;
