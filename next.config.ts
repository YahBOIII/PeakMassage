import type { NextConfig } from "next";

const repoName =
  process.env.NEXT_PUBLIC_REPO_NAME ??
  process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const githubPagesPath = repoName ? `/${repoName}` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isGithubActions && githubPagesPath
    ? {
        basePath: githubPagesPath,
        assetPrefix: `${githubPagesPath}/`,
      }
    : {}),
};

export default nextConfig;
