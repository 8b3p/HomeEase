/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    "@mui/material": { transform: "@mui/material/{{member}}", },
    "@mui/icons-material": { transform: "@mui/icons-material/{{member}}", },
    "@mui/styles": { transform: "@mui/styles/{{member}}", },
  },
};

module.exports = nextConfig;
