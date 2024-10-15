const express = require('express');

const app = express();
app.use();
app.get('/:searchTerm/:size/:ranking', async (req, res) => {
  try {
    const { searchTerm, size = 10 , ranking = 'popularity' } = req.params;
    
    // Fetch NPM package data
    const npmResponse = await fetch(`http://registry.npmjs.com/-/v1/search?text=${searchTerm}&size=${size}`);
    if (!npmResponse.ok) throw new Error('NPM API request failed');
    const npmData = await npmResponse.json();
    const npmPackages = npmData.objects;

    // Fetch additional data from GitHub for each package
    const packagesWithGithubData = await Promise.all(npmPackages.map(async (pkg) => {
      const { name, version, links, score } = pkg.package;
      const npmMetrics = {
        popularity: score.popularity,
        quality: score.quality,
        maintenance: score.maintenance
      };

      let githubMetrics = {};
      if (links.repository) {
        try {
          const repoUrl = new URL(links.repository);
          const [, owner, repo] = repoUrl.pathname.split('/');
          const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (!githubResponse.ok) throw new Error('GitHub API request failed');
          const githubData = await githubResponse.json();
          githubMetrics = {
            stars: githubData.stargazers_count,
            forks: githubData.forks_count,
            openIssues: githubData.open_issues_count,
            watchers: githubData.subscribers_count
          };
        } catch (error) {
          console.error(`Failed to fetch GitHub data for ${name}: ${error.message}`);
        }
      }

      return {
        name,
        version,
        links,
        npmMetrics,
        githubMetrics
      };
    }));

    res.json(packagesWithGithubData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch package information' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));