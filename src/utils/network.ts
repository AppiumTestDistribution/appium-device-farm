import os from 'os';

/**
 * Returns the first non-internal IPv4 address of this machine, falling back to
 * the loopback address when the host has no external interface.
 *
 * Replaces the `ip` package (`ip.address()`), which is unmaintained and carries
 * an unpatched SSRF advisory (CVE-2024-29415 / GHSA-2p57-rm9w-gvfp).
 */
export function getLocalIPv4Address(): string {
  const interfaces = os.networkInterfaces();
  for (const details of Object.values(interfaces)) {
    for (const detail of details ?? []) {
      // node <18 reports family as 'IPv4', node >=18 may report it as 4
      const isIPv4 = detail.family === 'IPv4' || (detail.family as unknown as number) === 4;
      if (isIPv4 && !detail.internal) {
        return detail.address;
      }
    }
  }
  return '127.0.0.1';
}
