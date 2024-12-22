-- CreateTable
CREATE TABLE "Offers" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "prev_discount" DOUBLE PRECISION NOT NULL,
    "list_number" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offers_id_key" ON "Offers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Offers_product_id_key" ON "Offers"("product_id");

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
