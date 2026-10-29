import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { app } from '../server.js';

describe('Database Offline In-Memory Fallback Behavior', () => {
  let server;
  let baseUrl;

  before(async () => {
    process.env.NODE_ENV = 'test';
    // Ensure mongoose is disconnected to simulate offline MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

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

  test('Fallback creates in-memory portfolio with mem_ id prefix and fallback: true flag', async () => {
    assert.notEqual(mongoose.connection.readyState, 1, 'MongoDB connection must not be connected');

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user_fallback_123',
        personalInfo: {
          fullName: 'Fallback Test User',
          email: 'fallback@example.com'
        },
        template: 'terminal',
        mode: 'manual'
      })
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.fallback, true);
    assert.ok(json.data._id.startsWith('mem_'));
    assert.ok(json.data.slug.startsWith('fallback-test-user-'));
    assert.equal(json.data.template, 'terminal');
  });

  test('Fallback lists portfolios and properly filters by userId query parameter', async () => {
    // Fetch all
    const allRes = await fetch(baseUrl);
    assert.equal(allRes.status, 200);
    const allJson = await allRes.json();
    assert.equal(allJson.success, true);
    assert.equal(allJson.fallback, true);
    assert.ok(allJson.data.length >= 1);

    // Fetch by matching userId
    const filterRes = await fetch(`${baseUrl}?userId=user_fallback_123`);
    assert.equal(filterRes.status, 200);
    const filterJson = await filterRes.json();
    assert.equal(filterJson.success, true);
    assert.ok(filterJson.data.every(p => p.userId === 'user_fallback_123'));

    // Fetch by non-matching userId
    const noneRes = await fetch(`${baseUrl}?userId=user_nonexistent_999`);
    assert.equal(noneRes.status, 200);
    const noneJson = await noneRes.json();
    assert.equal(noneJson.success, true);
    assert.equal(noneJson.data.length, 0);
  });

  test('Fallback update via slug preserves mem_ id and createdAt', async () => {
    // Create new portfolio
    const createRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalInfo: { fullName: 'Slug Update User' },
        template: 'bento'
      })
    });
    const createJson = await createRes.json();
    const slug = createJson.data.slug;
    const originalId = createJson.data._id;
    const originalCreatedAt = createJson.data.createdAt;

    // Update using slug
    const updateRes = await fetch(`${baseUrl}/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Attempt to tamper with protected fields
        _id: 'tampered_id',
        createdAt: '1970-01-01T00:00:00.000Z',
        title: 'Updated Title via Slug'
      })
    });

    assert.equal(updateRes.status, 200);
    const updateJson = await updateRes.json();
    assert.equal(updateJson.success, true);
    assert.equal(updateJson.data._id, originalId, '_id must be preserved and tamper-proof');
    assert.equal(updateJson.data.createdAt, originalCreatedAt, 'createdAt must be preserved');
    assert.equal(updateJson.data.title, 'Updated Title via Slug');
  });

  test('Fallback delete via slug removes portfolio from in-memory cache', async () => {
    // Create new portfolio
    const createRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalInfo: { fullName: 'Slug Delete User' }
      })
    });
    const createJson = await createRes.json();
    const slug = createJson.data.slug;

    // Delete by slug
    const delRes = await fetch(`${baseUrl}/${slug}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);
    const delJson = await delRes.json();
    assert.equal(delJson.success, true);

    // Verify it is gone
    const verifyRes = await fetch(`${baseUrl}/${slug}`);
    assert.equal(verifyRes.status, 404);
  });
});
