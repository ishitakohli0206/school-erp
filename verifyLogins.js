(async () => {
  const base = 'http://localhost:5000';
  const tests = [
    { email: 'student@test.com', password: 'password123', label: 'STUDENT' },
    { email: 'admin@test.com', password: 'password123', label: 'ADMIN' },
    { email: 'parent@test.com', password: 'password123', label: 'PARENT' }
  ];

  for (const t of tests) {
    try {
      console.log(`\nTesting ${t.label} login: ${t.email}`);
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: t.email, password: t.password })
      });
      const json = await res.json();
      console.log('STATUS', res.status);
      console.log('BODY', JSON.stringify(json, null, 2));
    } catch (err) {
      console.error('ERROR', err);
    }
  }

  process.exit(0);
})();
