-- Seed a few approved compliments so the marquee is never empty on day one.
INSERT INTO compliments (name, message, status, ip_hash, user_agent_hash) VALUES
  ('Annie',    'your laugh is contagious and i hope you know it',                         'seed', 'seed', 'seed'),
  (NULL,       'you''re a good one. keep going.',                                          'seed', 'seed', 'seed'),
  ('M',        'that jacket? a choice. and the right one.',                                'seed', 'seed', 'seed'),
  ('stranger', 'i saw you help someone at the water station. it mattered.',                'seed', 'seed', 'seed'),
  (NULL,       'the way you moved at sunset was proof that joy is a real substance',      'seed', 'seed', 'seed'),
  ('J',        'your energy is the reason the room felt warmer',                           'seed', 'seed', 'seed'),
  (NULL,       'you''re allowed to take up space. please do.',                             'seed', 'seed', 'seed'),
  ('phone 3',  'whoever picks up next — i hope your day breaks open softly',              'seed', 'seed', 'seed');
