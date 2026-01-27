import { test, expect } from '@playwright/test';
import validUsers from '../../fixtures/users.valid.json';
import invalidUsers from '../../fixtures/users.invalid.json';
import { ApiClient } from '../../utils/apiClient';

const apiBaseUrl = process.env.FAKE_STORE_API_URL || 'https://fakestoreapi.com';

function createApiClient(request: any) {
  return new ApiClient(request, apiBaseUrl);
}

/* VALID SCENARIOS */
test.describe('Get all users', () => {
    test(`Get all users`, async ({ request }) => {
      const api = createApiClient(request);
      const response = await api.get('/users');

      expect(response.status()).toBe(200);
      const body = await response.json();
      body.map((user: any) => {
        determineUserValidity(user);
      });
    });
});

test.describe('Add valid users', () => {
  for (const user of validUsers) {
    test(`Add user ${user.username}`, async ({ request }) => {
      const api = createApiClient(request);
      const response = await api.post('/users', user);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.id).toBeDefined();
    });
  }
});

test.describe('Get users', () => {
  for (const user of validUsers) {
    test(`Get user ${user.username}`, async ({ request }) => {
      const api = createApiClient(request);
      const response = await api.get(`/users/${user.id}`);

      expect(response.status()).toBe(200);
      const body = await response.json();
      determineUserValidity(body);
    });
  }
});

test.describe('Update a users', () => {
  for (const user of validUsers) {
    test(`Update user ${user.username}`, async ({ request }) => {
      const api = createApiClient(request);
      const response = await api.put(`/users/${user.id}`, user);

      expect(response.status()).toBe(200);
      const body = await response.json();
      determineUserValidity(body);
    });
  }
});

test.describe('Delete a users', () => {
  for (const user of validUsers) {
    test(`Delete user ${user.username}`, async ({ request }) => {
      const api = createApiClient(request);
      const response = await api.delete(`/users/${user.id}`);

      expect(response.status()).toBe(200);
      const body = await response.json();
      determineUserValidity(body);
    });
  }
});


/* INVALID SCENARIOS */
test.describe('Add invalid users', () => {
  for (const user of invalidUsers) {
    test(`Add user ${user.username}`, async ({ request }) => {
      const api = createApiClient(request);
      const response = await api.post('/users', user);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.id).toBeDefined();
    });
  }
});

test.describe('Get invalid user', () => {
  test(`Get user`, async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.get(`/users/${9999999}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(null);
  });
});

test.describe('Update a users', () => {
  test(`Update invalid user ${validUsers[0].username}`, async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.put(`/users/${9999999}`, validUsers[0]);

    expect(response.status()).toBe(200);
    const body = await response.json();
    determineUserValidity(body);
  });
});

test.describe('Delete a users', () => {
  test(`Delete invalid user ${validUsers[0].username}`, async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.delete(`/users/${9999999}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(null);
  });
});


function determineUserValidity(user: any) {
  expect(user.address).toBeDefined();
  expect(user.address.geolocation).toBeDefined();
  expect(user.address.geolocation.lat).toBeDefined();
  expect(user.address.geolocation.long).toBeDefined();
  expect(user.address.city).toBeDefined();
  expect(user.address.street).toBeDefined();
  expect(user.address.number).toBeDefined();
  expect(user.address.zipcode).toBeDefined();

  expect(user.id).toBeDefined();
  expect(user.email).toBeDefined();
  expect(user.username).toBeDefined();
  expect(user.password).toBeDefined();

  expect(user.name).toBeDefined();
  expect(user.name.firstname).toBeDefined();
  expect(user.name.lastname).toBeDefined();

  expect(user.phone).toBeDefined();
  expect(user.__v).toBeDefined();
}