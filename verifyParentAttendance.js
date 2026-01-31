(async () => {
  try {
    const base = 'http://localhost:5000';

    console.log('Logging in as parent@test.com');
    const loginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'parent@test.com', password: 'password123' }),
    });
    const loginJson = await loginRes.json();
    console.log('LOGIN RESPONSE:', JSON.stringify(loginJson, null, 2));

    const token = loginJson.token || loginJson.accessToken || (loginJson.data && loginJson.data.token) || loginJson.jwt;
    if (!token) {
      console.error('No token found in login response.');
      process.exit(1);
    }

    console.log('Fetching /parent/attendance with token...');
    const attRes = await fetch(`${base}/parent/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const attJson = await attRes.json();
    console.log('ATTENDANCE RESPONSE:', JSON.stringify(attJson, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  }
})();
