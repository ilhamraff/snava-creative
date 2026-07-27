import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Get the Payload Local API instance.
 *
 * In Payload v3, `getPayload()` is the recommended way to access
 * the Local API from server-side code. Payload handles caching
 * and initialization internally — calling this multiple times
 * in the same request does not create duplicate connections.
 */
export async function getPayloadClient() {
  return getPayload({ config })
}
