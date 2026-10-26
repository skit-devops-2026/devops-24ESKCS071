import axios from 'axios';

export const ingestGitHubProfile = async (req, res) => {
  const { username } = req.params;

  if (!username || username.trim() === '') {
    return res.status(400).json({ success: false, message: 'GitHub username is required' });
  }

  const cleanUser = username.trim();

  try {
    // Headers with User-Agent required by GitHub API
    const headers = {
      'User-Agent': 'CraftCV-Portfolio-Builder',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch user profile
    const userRes = await axios.get(`https://api.github.com/users/${cleanUser}`, { headers });
    const user = userRes.data;

    // 2. Fetch user repositories (up to 100)
    const reposRes = await axios.get(
      `https://api.github.com/users/${cleanUser}/repos?per_page=100&sort=pushed`,
      { headers }
    );
    const rawRepos = reposRes.data;

    // 3. Filter out forks and calculate language frequency
    const ownRepos = rawRepos.filter(repo => !repo.fork);
    const repoList = ownRepos.length > 0 ? ownRepos : rawRepos;

    const languageMap = {};
    repoList.forEach(repo => {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
    });

    // Rank languages by frequency
    const sortedLanguages = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    // 4. Sort and select top projects (by stars, then size / recency)
    const sortedRepos = [...repoList].sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    });

    const topProjects = sortedRepos.slice(0, 6).map((repo, idx) => ({
      title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: repo.description || 'Modern software application built with full-stack engineering best practices.',
      repoUrl: repo.html_url,
      liveDemo: repo.homepage || '',
      technologies: [
        repo.language,
        ...(repo.topics || [])
      ].filter(Boolean).slice(0, 5),
      stars: repo.stargazers_count || 0,
      pinned: idx < 3
    }));

    // Auto-detect frameworks and tools from topics
    const allTopics = new Set();
    repoList.forEach(repo => {
      if (Array.isArray(repo.topics)) {
        repo.topics.forEach(t => allTopics.add(t));
      }
    });

    const commonFrameworks = ['react', 'nextjs', 'vue', 'angular', 'express', 'node', 'django', 'fastapi', 'flask', 'tailwind', 'spring'];
    const detectedFrameworks = Array.from(allTopics).filter(t => commonFrameworks.includes(t.toLowerCase()));

    // Assemble unified portfolio payload
    const payload = {
      personalInfo: {
        fullName: user.name || user.login,
        title: user.bio ? user.bio.split('.')[0] : 'Full Stack Engineer',
        bio: user.bio || `Passionate software developer with ${user.public_repos} public repositories on GitHub.`,
        email: user.email || '',
        location: user.location || 'Remote',
        avatarUrl: user.avatar_url,
        githubUsername: user.login,
        websiteUrl: user.blog ? (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`) : user.html_url,
        twitterUrl: user.twitter_username ? `https://twitter.com/${user.twitter_username}` : '',
      },
      skills: {
        languages: sortedLanguages.slice(0, 8),
        frameworks: detectedFrameworks.length > 0 ? detectedFrameworks.slice(0, 6) : ['React', 'Node.js', 'Express', 'Tailwind CSS'],
        tools: ['Git', 'GitHub', 'REST APIs', 'Vite', 'Postman']
      },
      projects: topProjects,
      stats: {
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        totalStars: repoList.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
      }
    };

    return res.status(200).json({
      success: true,
      data: payload,
      message: `Successfully ingested ${repoList.length} repositories for ${cleanUser}!`
    });
  } catch (error) {
    console.error('[GitHub Ingest Error]:', error.message);
    const status = error.response?.status || 500;
    const msg = error.response?.data?.message || error.message;
    return res.status(status).json({
      success: false,
      message: `Failed to fetch GitHub profile for '${cleanUser}': ${msg}`
    });
  }
};
