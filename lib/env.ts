const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'
] as const;

function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar])
      missing.push(envVar);
  }

  if (missing.length > 0)
    throw new Error(`Missing required environmental variables:\n${missing.join('\n')} \nplease add them in your .env or env.local`);

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32)
    console.error('WARNING : JWT_SECRET should be atleast 32 characters long. check your .env or .env.local')

  console.log('Environment variables validated successfully');
}

validateEnv();

export { };
