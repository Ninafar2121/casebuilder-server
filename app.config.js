module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    plugins: config.plugins || [],
  };
};
