/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // WSL2 + Windows 드라이브(/mnt/d)에서는 파일 변경 이벤트(inotify)가
  // 전달되지 않아 Fast Refresh가 동작하지 않는다. 폴링으로 변경을 감지한다.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
