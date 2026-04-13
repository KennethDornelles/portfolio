export const parseRedisUrl = (url: string) => {
  if (!url) return undefined;
  
  // Sanitize: Remove quotes and trim
  const cleanUrl = url.replace(/(^["']|["']$)/g, '').trim(); 
  
  try {
    const parsed = new URL(cleanUrl);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || '6379', 10),
      password: parsed.password || undefined,
      username: parsed.username || undefined,
      tls: parsed.protocol === 'rediss:' ? { rejectUnauthorized: false } : undefined,
    };
  } catch (e) {
    return undefined;
  }
};
