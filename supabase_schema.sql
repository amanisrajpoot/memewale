-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES: Create if not exists, then ensure columns
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safely add columns if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'username') then
    alter table profiles add column username text unique;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
    alter table profiles add column full_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'avatar_url') then
    alter table profiles add column avatar_url text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'bio') then
    alter table profiles add column bio text;
  end if;
end $$;

-- MEMES TABLE
create table if not exists memes (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  url text not null,
  caption text,
  tags text[],
  width integer,
  height integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INTERACTIONS TABLE (Likes, Downvotes, Saves)
create table if not exists interactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  meme_id uuid references memes(id) on delete cascade not null,
  type text check (type in ('upvote', 'downvote', 'save')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, meme_id, type)
);

-- COMMENTS TABLE
create table if not exists comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  user_id uuid references profiles(id) on delete cascade not null,
  meme_id uuid references memes(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table profiles enable row level security;
alter table memes enable row level security;
alter table interactions enable row level security;
alter table comments enable row level security;

-- PROFILES POLICIES
do $$ begin
  drop policy if exists "Public profiles are viewable by everyone." on profiles;
  drop policy if exists "Users can insert their own profile." on profiles;
  drop policy if exists "Users can update own profile." on profiles;
  
  create policy "Public profiles are viewable by everyone." on profiles for select using (true);
  create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
  create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
end $$;

-- MEMES POLICIES
do $$ begin
  drop policy if exists "Memes are viewable by everyone." on memes;
  drop policy if exists "Users can upload memes." on memes;
  drop policy if exists "Users can delete own memes." on memes;

  create policy "Memes are viewable by everyone." on memes for select using (true);
  create policy "Users can upload memes." on memes for insert with check (auth.uid() = author_id);
  create policy "Users can delete own memes." on memes for delete using (auth.uid() = author_id);
end $$;

-- INTERACTIONS POLICIES
do $$ begin
  drop policy if exists "Interactions are viewable by everyone." on interactions;
  drop policy if exists "Users can interact." on interactions;
  drop policy if exists "Users can remove interaction." on interactions;

  create policy "Interactions are viewable by everyone." on interactions for select using (true);
  create policy "Users can interact." on interactions for insert with check (auth.uid() = user_id);
  create policy "Users can remove interaction." on interactions for delete using (auth.uid() = user_id);
end $$;

-- COMMENTS POLICIES
do $$ begin
  drop policy if exists "Comments are viewable by everyone." on comments;
  drop policy if exists "Users can comment." on comments;

  create policy "Comments are viewable by everyone." on comments for select using (true);
  create policy "Users can comment." on comments for insert with check (auth.uid() = user_id);
end $$;

-- AUTOMATIC PROFILE CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger safely
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKET SETUP
insert into storage.buckets (id, name, public) 
values ('memes', 'memes', true)
on conflict (id) do nothing;

-- STORAGE POLICIES
do $$ begin
  drop policy if exists "Public Access" on storage.objects;
  drop policy if exists "Auth Upload" on storage.objects;

  create policy "Public Access" on storage.objects for select using ( bucket_id = 'memes' );
  create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'memes' and auth.role() = 'authenticated' );
end $$;
