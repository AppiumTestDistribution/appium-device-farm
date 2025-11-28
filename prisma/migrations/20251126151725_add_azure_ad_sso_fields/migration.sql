-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "auth_provider" TEXT NOT NULL DEFAULT 'local',
    "azure_ad_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "access_key" TEXT NOT NULL
);
INSERT INTO "new_User" ("access_key", "created_at", "firstname", "id", "is_active", "lastname", "password", "role", "updated_at", "username") SELECT "access_key", "created_at", "firstname", "id", "is_active", "lastname", "password", "role", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_azure_ad_id_key" ON "User"("azure_ad_id");
CREATE UNIQUE INDEX "User_access_key_key" ON "User"("access_key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
