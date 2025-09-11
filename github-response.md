# GitHub Comment Response

## @SubbuLomada Response

Thanks for the heads up! 👍 

Actually, after investigating the codebase, I found that **appium-device-farm doesn't use Appium's `/sessions` endpoint** at all. The plugin has its own session tracking system:

### How it works:
- **Own Session Management**: The plugin tracks sessions internally using its own database (Prisma/SQLite)
- **Device-based Tracking**: Sessions are tracked via device objects with `session_id` field
- **No External Dependencies**: The plugin doesn't make HTTP calls to Appium's `/sessions` or `/appium/sessions` endpoints

### Session Tracking Flow:
1. **Session Creation**: `createSession()` method in plugin.ts handles session creation
2. **Database Storage**: Sessions are stored in Prisma database with full metadata
3. **Device Association**: Each device gets a `session_id` when allocated
4. **Dashboard Display**: Dashboard shows sessions from internal database, not Appium server

### Code Evidence:
```typescript
// src/plugin.ts - Session creation
async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
  // Plugin handles session creation internally
  // No external API calls to Appium sessions endpoint
}

// src/interfaces/IDevice.ts - Device has session_id
interface IDevice {
  session_id?: string;  // Plugin tracks sessions via devices
  // ... other fields
}
```

So the **Appium 3.x `/sessions` → `/appium/sessions` change doesn't affect this plugin** because it doesn't use that endpoint! 🎉

The plugin is already fully compatible with both Appium 2.x and 3.x for session management. The driver updates I made earlier were the only compatibility changes needed.

Thanks for the thorough review though - it's always good to double-check these things! 🔍
