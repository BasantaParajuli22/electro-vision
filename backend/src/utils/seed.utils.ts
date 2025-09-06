import { sampleProducts } from "../data/product.data";
import {pool, db } from "../db/index";
import * as schema from '../db/schema';
import { count } from 'drizzle-orm';


export async function seedInitialData() {
  try {
    //check if there are existing products or not 
    //if there are we cannot seed
    const existingProducts = await db.select({ value: count() }).from(schema.products);
    
    const productCount = existingProducts[0].value;
    if (productCount > 0) {
      console.log('Products table is not empty. Skipping seeding.');
      return;
    } 

    // Insert the products seed data
    let insertedProducts: schema.Product[] = [];
    insertedProducts = await db.insert(schema.products).values(sampleProducts).returning();

    console.log('Product table successfully seeded!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
    
  }finally{
    await pool.end();//close conn
    console.log('Connection closed. Script finished.');
  }
}

seedInitialData();