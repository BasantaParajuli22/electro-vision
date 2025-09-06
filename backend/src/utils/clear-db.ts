import { pool, db } from "../db/index";
import * as schema from '../db/schema';

/**
 * Deletes data from specified tables.
 * To run:
 * - Delete ONLY products: `npx tsx clear-db.ts --products`
 * - Delete ALL data:     `npx tsx clear-db.ts --all`
 * 
 * WARNING: This is a destructive operation and cannot be undone.
 * Only run this in a development environment.
 */
async function clearDatabase() {
  const args = process.argv.slice(2); // Get command-line arguments

  // Check for a specific flag, like --products or --all
  const clearAll = args.includes('--all');
  const clearProducts = args.includes('--products');

  if (!clearAll && !clearProducts) {
    console.error('Please specify what to delete: --products or --all');
    process.exit(1);
  }

  try {
    if (clearProducts) {
      console.log('Deleting data from the products table...');
      await db.delete(schema.products);
      console.log('Products table cleared successfully.');
    }

    if (clearAll) {
      console.log('Deleting all data from all tables...');
      
      // Delete in the correct order to avoid foreign key constraint errors
      // Delete from tables that reference others (child tables)
      console.log(' Clearing order_items...');
      await db.delete(schema.orderItems);

      console.log(' Clearing cartItems...');
      await db.delete(schema.cartItems);

      console.log(' Clearing cart...');
      await db.delete(schema.cart);

      //  Delete from the next level up
      console.log(' Clearing orders...');
      await db.delete(schema.orders);

      //  Finally, delete from the parent tables
      console.log(' Clearing products...');
      await db.delete(schema.products);
      
      console.log(' Clearing users...');
      await db.delete(schema.users);
      
      console.log('All tables cleared successfully!');
    }

  } catch (error) {
    console.error('Error during deletion:', error);
    process.exit(1);

  } finally {
    await pool.end(); // Close the connection
    console.log('Connection closed. Script finished.');
  }
}

clearDatabase();