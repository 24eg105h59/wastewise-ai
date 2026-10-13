const { execSync } = require('child_process');

if (process.env.DATABASE_URL) {
  try {
    console.log('Detected DATABASE_URL. Syncing database schema with cloud database...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('Database schema synchronized successfully!');
  } catch (err) {
    console.warn('Prisma db push warning (build will proceed):', err.message);
  }
} else {
  console.log('No DATABASE_URL set during build, skipping db push.');
}
