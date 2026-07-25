import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AuthService from './AuthService';
import apiClient from '../api-service/api-client';

/**
 * Regression coverage for issue #2035 - deleting a user 404'd and the failure was
 * reported to the operator as a success.
 *
 * Both halves of that bug are asserted here: the URL the request goes to, and what
 * happens when the server rejects it.
 */

const USER_ID = '79f47a31-fd64-4053-9902-c0ea906bc6d8';

/** A fresh Response per call - a body can only be consumed once. */
function respondWith(status: number, body: unknown = {}) {
  return vi.fn().mockImplementation(async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

/** The single fetch call the assertions below inspect. */
function lastCall(fetchMock: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchMock.mock.calls.at(-1) as [URL, RequestInit | undefined];
  return { url: url.toString(), method: init?.method };
}

describe('AuthService user management endpoints', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiClient.setToken('test-token');
  });

  afterEach(() => {
    apiClient.setToken(null);
    vi.restoreAllMocks();
  });

  describe('deleteUser', () => {
    it('targets the users router, not the auth router', async () => {
      fetchMock = respondWith(200, { message: 'User deleted successfully' });
      vi.stubGlobal('fetch', fetchMock);

      await AuthService.deleteUser(USER_ID);

      const { url, method } = lastCall(fetchMock);
      expect(method).toBe('DELETE');
      // The route is registered by apiRouter.use('/users', getUsersRoutes(...)).
      // /auth only exposes PUT /users/:userId/activate and /deactivate, so a delete
      // sent to /auth/users/:id falls through to Appium's 404 handler - issue #2035.
      expect(url).toBe(`${window.location.origin}/device-farm/api/users/${USER_ID}`);
      expect(url).not.toContain('/auth/users');
    });

    it('rejects when the server returns an error instead of reporting success', async () => {
      fetchMock = respondWith(404, { error: 'unknown command' });
      vi.stubGlobal('fetch', fetchMock);

      // fetch resolves on a 404, and api-client hands back the raw Response rather
      // than throwing. Without the assertOk guard this call resolved, and the UI
      // removed the row from the table for a user that was still in the database.
      await expect(AuthService.deleteUser(USER_ID)).rejects.toThrow(/404/);
    });

    it('resolves when the server confirms the delete', async () => {
      fetchMock = respondWith(200, { message: 'User deleted successfully' });
      vi.stubGlobal('fetch', fetchMock);

      await expect(AuthService.deleteUser(USER_ID)).resolves.toBeUndefined();
    });
  });

  describe('activate / deactivate', () => {
    it('keeps activate and deactivate nested under the auth router', async () => {
      fetchMock = respondWith(200);
      vi.stubGlobal('fetch', fetchMock);

      await AuthService.activateUser(USER_ID);
      expect(lastCall(fetchMock).url).toBe(
        `${window.location.origin}/device-farm/api/auth/users/${USER_ID}/activate`,
      );

      await AuthService.deactivateUser(USER_ID);
      expect(lastCall(fetchMock).url).toBe(
        `${window.location.origin}/device-farm/api/auth/users/${USER_ID}/deactivate`,
      );
    });

    it('surfaces a failed deactivate', async () => {
      fetchMock = respondWith(401, { message: 'Unauthorized' });
      vi.stubGlobal('fetch', fetchMock);

      await expect(AuthService.deactivateUser(USER_ID)).rejects.toThrow(/401/);
    });
  });

  describe('updateUser', () => {
    it('targets the users router and surfaces failures', async () => {
      fetchMock = respondWith(200);
      vi.stubGlobal('fetch', fetchMock);

      await AuthService.updateUser(USER_ID, { firstname: 'Ada' });
      expect(lastCall(fetchMock).url).toBe(
        `${window.location.origin}/device-farm/api/users/${USER_ID}`,
      );

      vi.stubGlobal('fetch', respondWith(400, { message: 'nope' }));
      await expect(AuthService.updateUser(USER_ID, { firstname: 'Ada' })).rejects.toThrow(/400/);
    });
  });
});
