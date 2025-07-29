-- CreateTable
CREATE TABLE "AdminAuth" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "username" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminAuth_username_key" ON "AdminAuth"("username");
