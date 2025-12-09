const config = {
  migrate: {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  },
};

export default config;
