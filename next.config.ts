import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName =
  process.env.NEXT_PUBLIC_REPO_NAME ??
  process.env.GITHUB_REPOSITORY?.split("/")[1] ??
  "PeakMassage";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isGithubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
