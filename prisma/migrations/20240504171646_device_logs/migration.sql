-- CreateTable
CREATE TABLE "DeviceTags" (
    "host" TEXT NOT NULL,
    "udid" TEXT NOT NULL,
    "tags" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceTags_host_udid_key" ON "DeviceTags"("host", "udid");
