import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server.js';

describe('Portfolio CRUD Operations', () => {
  let server;
  let baseUrl;
  let createdPortfolioId;
  let createdSlug;

  before(async () => {
    process.env.NODE_ENV = 'test';
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api/portfolios`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('POST /api/portfolios - should create a new portfolio with valid data', async () => {
    const payload = {
      title: 'DevOps Engineer Portfolio',
      template: 'bento',
      mode: 'manual',
      personalInfo: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        title: 'Senior DevOps Architect',
        bio: 'Automating pipelines and infrastructure with excellence.',
        location: 'Bengaluru, India'
      },
      skills: {
        languages: ['JavaScript', 'Go', 'Python'],
        frameworks: ['Express', 'React'],
        tools: ['Docker', 'Kubernetes', 'GitHub Actions']
      },
      projects: [
        {
          title: 'Cloud CI/CD Engine',
          description: 'Automated delivery pipelines with zero downtime.',
          technologies: ['Docker', 'Kubernetes']
        }
      ]
    };

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data);
    assert.ok(json.data._id);
    assert.ok(json.data.slug);
    assert.equal(json.data.personalInfo.fullName, 'Jane Doe');

    createdPortfolioId = json.data._id;
    createdSlug = json.data.slug;
  });

  test('POST /api/portfolios - should reject payload missing fullName', async () => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'bento',
        personalInfo: { email: 'test@example.com' }
      })
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.match(json.message, /fullName is required/i);
  });

  test('POST /api/portfolios - should reject invalid template name', async () => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalInfo: { fullName: 'Alex Smith' },
        template: 'unsupported-theme'
      })
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.match(json.message, /invalid template/i);
  });

  test('GET /api/portfolios - should retrieve list of portfolios', async () => {
    const res = await fetch(baseUrl);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 1);
  });

  test('GET /api/portfolios/:id - should fetch portfolio by id', async () => {
    const res = await fetch(`${baseUrl}/${createdPortfolioId}`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data._id, createdPortfolioId);
  });

  test('GET /api/portfolios/:id - should fetch portfolio by slug', async () => {
    const res = await fetch(`${baseUrl}/${createdSlug}`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.slug, createdSlug);
  });

  test('GET /api/portfolios/:id - should return 404 for non-existent portfolio', async () => {
    const res = await fetch(`${baseUrl}/non-existent-portfolio-slug-9999`);
    assert.equal(res.status, 404);
    const json = await res.json();
    assert.equal(json.success, false);
  });

  test('PUT /api/portfolios/:id - should update existing portfolio fields', async () => {
    const updatePayload = {
      title: 'Principal DevOps Architect',
      personalInfo: {
        fullName: 'Jane Doe Updated',
        location: 'Remote, Global'
      }
    };

    const res = await fetch(`${baseUrl}/${createdPortfolioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.title, 'Principal DevOps Architect');
    assert.equal(json.data.personalInfo.fullName, 'Jane Doe Updated');
  });

  test('PUT /api/portfolios/:id - should reject update with invalid template', async () => {
    const res = await fetch(`${baseUrl}/${createdPortfolioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: 'invalid-template-xyz' })
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.match(json.message, /invalid template/i);
  });

  test('PUT /api/portfolios/:id - should return 404 for non-existent id', async () => {
    const res = await fetch(`${baseUrl}/missing-slug-8888`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Title' })
    });

    assert.equal(res.status, 404);
    const json = await res.json();
    assert.equal(json.success, false);
  });

  test('DELETE /api/portfolios/:id - should delete existing portfolio', async () => {
    const res = await fetch(`${baseUrl}/${createdPortfolioId}`, {
      method: 'DELETE'
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);

    // Verify it is now 404
    const verifyRes = await fetch(`${baseUrl}/${createdPortfolioId}`);
    assert.equal(verifyRes.status, 404);
  });

  test('DELETE /api/portfolios/:id - should return 404 when deleting missing portfolio', async () => {
    const res = await fetch(`${baseUrl}/non-existent-portfolio-slug-7777`, {
      method: 'DELETE'
    });

    assert.equal(res.status, 404);
    const json = await res.json();
    assert.equal(json.success, false);
  });
});
