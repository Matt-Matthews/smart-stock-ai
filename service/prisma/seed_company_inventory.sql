-- Sample categories, items, inventory, and suppliers for one existing company.
-- The company must already exist. USD is added to Currency only if it is missing,
-- because Item.currencyId is a required foreign key.

START TRANSACTION;

INSERT INTO `Currency` (`id`, `code`, `name`, `createdAt`, `updatedAt`, `deletedAt`)
SELECT UUID(), 'USD', 'US Dollar', NOW(), NOW(), NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `Currency` WHERE `code` = 'USD'
);

SET @company_id = '23d7eb7d-6237-422e-85b3-1ce788ead694';
SET @currency_id = (SELECT `id` FROM `Currency` WHERE `code` = 'USD' LIMIT 1);

SET @category_electronics = UUID();
SET @category_office = UUID();
SET @category_cleaning = UUID();
SET @category_safety = UUID();

INSERT INTO `Category` (`id`, `name`, `description`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (@category_electronics, 'Electronics', 'Small electronic devices and accessories', @company_id, NOW(), NOW(), NULL),
  (@category_office, 'Office Supplies', 'Everyday stationery and office essentials', @company_id, NOW(), NOW(), NULL),
  (@category_cleaning, 'Cleaning Supplies', 'Cleaning products and janitorial supplies', @company_id, NOW(), NOW(), NULL),
  (@category_safety, 'Safety Equipment', 'Personal protective and workplace safety equipment', @company_id, NOW(), NOW(), NULL);

SET @item_keyboard = UUID();
SET @item_mouse = UUID();
SET @item_monitor = UUID();
SET @item_notebook = UUID();
SET @item_pen = UUID();
SET @item_paper = UUID();
SET @item_cleaner = UUID();
SET @item_towels = UUID();
SET @item_gloves = UUID();
SET @item_goggles = UUID();

INSERT INTO `Item`
  (`id`, `name`, `description`, `categoryId`, `companyId`, `currencyId`,
   `createdAt`, `updatedAt`, `deletedAt`, `costPrice`, `sellPrice`, `sku`, `barcode`)
VALUES
  (@item_keyboard, 'Wireless Keyboard', 'Full-size wireless keyboard', @category_electronics, @company_id, @currency_id, NOW(), NOW(), NULL, 18.00, 29.99, 'SEED-ELEC-001', '1000000000011'),
  (@item_mouse, 'Wireless Mouse', 'Optical wireless mouse', @category_electronics, @company_id, @currency_id, NOW(), NOW(), NULL, 8.50, 14.99, 'SEED-ELEC-002', '1000000000028'),
  (@item_monitor, '24-inch Monitor', '24-inch full HD office monitor', @category_electronics, @company_id, @currency_id, NOW(), NOW(), NULL, 105.00, 149.99, 'SEED-ELEC-003', '1000000000035'),
  (@item_notebook, 'A5 Notebook', 'Lined A5 notebook, 120 pages', @category_office, @company_id, @currency_id, NOW(), NOW(), NULL, 1.20, 2.49, 'SEED-OFF-001', '1000000000042'),
  (@item_pen, 'Ballpoint Pens', 'Pack of 10 blue ballpoint pens', @category_office, @company_id, @currency_id, NOW(), NOW(), NULL, 2.00, 4.49, 'SEED-OFF-002', '1000000000059'),
  (@item_paper, 'Copy Paper', 'A4 copy paper, 500 sheets', @category_office, @company_id, @currency_id, NOW(), NOW(), NULL, 4.25, 6.99, 'SEED-OFF-003', '1000000000066'),
  (@item_cleaner, 'Surface Cleaner', 'Multi-purpose surface cleaner, 1 L', @category_cleaning, @company_id, @currency_id, NOW(), NOW(), NULL, 3.10, 5.49, 'SEED-CLEAN-001', '1000000000073'),
  (@item_towels, 'Paper Towels', 'Absorbent paper towel roll', @category_cleaning, @company_id, @currency_id, NOW(), NOW(), NULL, 1.80, 3.25, 'SEED-CLEAN-002', '1000000000080'),
  (@item_gloves, 'Nitrile Gloves', 'Disposable nitrile gloves, box of 100', @category_safety, @company_id, @currency_id, NOW(), NOW(), NULL, 6.50, 10.99, 'SEED-SAFE-001', '1000000000097'),
  (@item_goggles, 'Safety Goggles', 'Clear protective safety goggles', @category_safety, @company_id, @currency_id, NOW(), NOW(), NULL, 4.00, 7.99, 'SEED-SAFE-002', '1000000000103');

INSERT INTO `Inventory`
  (`id`, `itemId`, `quantity`, `status`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`, `eventHash`)
VALUES
  (UUID(), @item_keyboard, 24, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_mouse, 38, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_monitor, 8, 'low_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_notebook, 120, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_pen, 75, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_paper, 42, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_cleaner, 6, 'low_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_towels, 50, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_gloves, 18, 'in_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', ''))),
  (UUID(), @item_goggles, 4, 'low_stock', @company_id, NOW(), NOW(), NULL, CONCAT('seed_', REPLACE(UUID(), '-', '')));

INSERT INTO `suppliers` (`id`, `name`, `description`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
  (UUID(), 'Northstar Electronics', 'Supplier of computers and electronic accessories', @company_id, NOW(), NOW(), NULL),
  (UUID(), 'Paper & Pen Wholesale', 'Wholesale stationery and office paper supplier', @company_id, NOW(), NOW(), NULL),
  (UUID(), 'Brightway Janitorial', 'Commercial cleaning products and supplies', @company_id, NOW(), NOW(), NULL),
  (UUID(), 'SafeWork Outfitters', 'Workplace personal protective equipment supplier', @company_id, NOW(), NOW(), NULL);

COMMIT;
