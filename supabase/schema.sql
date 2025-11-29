-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  role text check (role in ('buyer', 'freelancer')),
  skills text[],

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This triggers a profile creation when a user signs up
create function public.handle_new_user()
returns trigger
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tickets Table
create table tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  budget numeric not null,
  deadline timestamp with time zone not null,
  category text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  created_by uuid references profiles(id) on delete cascade not null
);

-- Bids Table
create table bids (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ticket_id uuid references tickets(id) on delete cascade not null,
  bidder_id uuid references profiles(id) on delete cascade not null,
  amount numeric not null,
  delivery_days integer not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected'))
);

-- Enable RLS
alter table tickets enable row level security;
alter table bids enable row level security;

-- Tickets Policies
create policy "Tickets are viewable by everyone" on tickets
  for select using (true);

create policy "Users can create tickets" on tickets
  for insert with check (auth.uid() = created_by);

create policy "Users can update their own tickets" on tickets
  for update using (auth.uid() = created_by);

create policy "Users can delete their own tickets" on tickets
  for delete using (auth.uid() = created_by);

-- Bids Policies
create policy "Bids are viewable by everyone" on bids
  for select using (true);

create policy "Freelancers can place bids" on bids
  for insert with check (auth.uid() = bidder_id);

create policy "Bidders can update their own bids" on bids
  for update using (auth.uid() = bidder_id);

create policy "Ticket owners can update bid status (accept/reject)" on bids
  for update using (
    exists (
      select 1 from tickets
      where tickets.id = bids.ticket_id
      and tickets.created_by = auth.uid()
    )
  );

-- Gigs Table
create table gigs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  price numeric not null,
  delivery_time integer not null, -- in days
  category text not null,
  freelancer_id uuid references profiles(id) on delete cascade not null,
  images text[] default array[]::text[],
  rating numeric default 0,
  review_count integer default 0
);

alter table gigs enable row level security;

create policy "Gigs are viewable by everyone" on gigs
  for select using (true);

create policy "Freelancers can create gigs" on gigs
  for insert with check (auth.uid() = freelancer_id);

create policy "Freelancers can update own gigs" on gigs
  for update using (auth.uid() = freelancer_id);

create policy "Freelancers can delete own gigs" on gigs
  for delete using (auth.uid() = freelancer_id);

-- Communities Table
create table communities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  member_count integer default 0
);

alter table communities enable row level security;

create policy "Communities are viewable by everyone" on communities
  for select using (true);

-- Allow anyone to create a community for now (can be restricted later)
create policy "Authenticated users can create communities" on communities
  for insert with check (auth.role() = 'authenticated');

-- Posts Table
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  author_id uuid references profiles(id) on delete cascade not null,
  community_id uuid references communities(id) on delete cascade not null,
  upvotes integer default 0,
  comment_count integer default 0
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone" on posts
  for select using (true);

create policy "Authenticated users can create posts" on posts
  for insert with check (auth.uid() = author_id);

create policy "Authors can update own posts" on posts
  for update using (auth.uid() = author_id);

create policy "Authors can delete own posts" on posts
  for delete using (auth.uid() = author_id);

-- Comments Table
create table comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references comments(id) on delete cascade,
  upvotes integer default 0
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone" on comments
  for select using (true);

create policy "Authenticated users can create comments" on comments
  for insert with check (auth.uid() = author_id);

create policy "Authors can update own comments" on comments
  for update using (auth.uid() = author_id);

create policy "Authors can delete own comments" on comments
  for delete using (auth.uid() = author_id);

-- Votes Table (for Posts and Comments)
create table votes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade,
  comment_id uuid references comments(id) on delete cascade,
  value integer not null check (value in (1, -1)),
  
  constraint vote_target_check check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  ),
  unique(user_id, post_id, comment_id)
);

alter table votes enable row level security;

create policy "Votes are viewable by everyone" on votes
  for select using (true);

create policy "Authenticated users can vote" on votes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own votes" on votes
  for update using (auth.uid() = user_id);

-- Ticket Comments Table (Discussion)
create table ticket_comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  ticket_id uuid references tickets(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references ticket_comments(id) on delete cascade
);

alter table ticket_comments enable row level security;

create policy "Ticket comments are viewable by everyone" on ticket_comments
  for select using (true);

create policy "Authenticated users can comment on tickets" on ticket_comments
  for insert with check (auth.role() = 'authenticated');

create policy "Authors can update own ticket comments" on ticket_comments
  for update using (auth.uid() = author_id);

create policy "Authors can delete own ticket comments" on ticket_comments
  for delete using (auth.uid() = author_id);

-- Enhance Bids Table
alter table bids add column if not exists attachments text[] default array[]::text[];
alter table bids add column if not exists portfolio_links text[] default array[]::text[];
