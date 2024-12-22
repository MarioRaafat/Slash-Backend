-- CreateTable
CREATE TABLE "blackList" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blackList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blackList_id_key" ON "blackList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "blackList_user_id_key" ON "blackList"("user_id");

-- AddForeignKey
ALTER TABLE "blackList" ADD CONSTRAINT "blackList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
