import { InferSelectModel, relations } from "drizzle-orm";
import { decimal, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id:         serial("id").primaryKey(),
    username:   varchar("username",{length: 50}).default("zoro").notNull(),
    email:      varchar("email",{length: 50}).notNull(),
    googleId:   text("google_id").notNull().unique(),
    avatarUrl:  text("avatar_url").default("https://ocohjxbhun.ufs.sh/f/tusHOP3SRakyxg8uE9cS5Mz41aUprsPwuTW763coqvnFCeKQ"),
    createdAt:  timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
    id:         serial("id").primaryKey(),
    name:       varchar("name",{length: 150}).notNull(),
    description:varchar("description",{length: 1000}).default("No description provided"),
    imageUrl:   text("image_url").default("https://ocohjxbhun.ufs.sh/f/tusHOP3SRakyxg8uE9cS5Mz41aUprsPwuTW763coqvnFCeKQ"),
    price:      decimal("price", {precision: 10, scale: 2} ).default('1').notNull(),
    stock:      integer("stock").default(1).notNull(),
    createdAt:  timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
    id:         serial("id").primaryKey(),
    userId:     integer("user_id").references(() => (users.id) ).notNull(), //(FK)
    totalAmount:decimal("total_amount", {precision: 10, scale: 2} ).default('1').notNull(),//total cost
    status:     varchar("status", {length: 50}).default("not_completed").notNull(), //payment status
    createdAt:  timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
    id:         serial("id").primaryKey(),
    orderId:    integer("order_id").references(() => (orders.id)).notNull(), //(FK) 
    productId:  integer("product_id").references(() => (products.id)).notNull(), //(FK)
    quantity:   integer("quantity").default(1).notNull(), //price at the time of order
    unitPrice:      decimal("unit_price", {precision: 10, scale: 2} ).default('1').notNull(),
});

export const cart = pgTable("cart", {
    id:         serial("id").primaryKey(),
    userId:     integer("user_id").references(() => (users.id)).notNull(), //(FK) which user is it 
    createdAt:  timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
    id:         serial("id").primaryKey(),
    cartId:     integer("cart_id").references(() => (cart.id)).notNull(), //(FK) //which cart is it 
    productId:  integer("product_id").references(() => (products.id)).notNull(), //which product
    quantity:   integer("quantity").default(1).notNull(),     //no price //only when bought/order we record                   
    createdAt:  timestamp("created_at").defaultNow(),
});


//relations //

//one user can have many orders
export const userRelations = relations(users, ({many})=>({
    orders:     many(orders),
}));

//one product can have many orderItems and cartItems
export const productRelations = relations(products, ({ many})=>({
    orderItems: many(orderItems),
    cartItems:  many(cartItems),
}));


export const orderRelations = relations(orders, ({one, many})=>({
    orderItems: many(orderItems),   //one order can have many orderItems

    user: one(users,{ 
        fields: [orders.userId],    //Fk is userId
        references: [users.id],     //reference is from users table column id 
    }),
}));


export const orderItemsRelations = relations(orderItems, ({one, many})=>({
     order: one(orders,{
        fields: [orderItems.orderId],//Fk is orderId
        references: [orders.id],     //reference is from orders table column id 
    }),
    products: one(products,{
        fields: [orderItems.productId], //Fk is productId
        references: [products.id],       //reference is from product table column id 
    }),
}));

export const cartRelations = relations(cart, ({one, many})=>({
    cartItems: many(cartItems),//one cart can have many cart Items

    user: one(users,{ 
        fields: [cart.userId],    //Fk is userId
        references: [users.id],   //reference is from users table column id 
    }),
}));

export const cartItemRelations = relations(cartItems, ({one, many})=>({
    cart: one(cart,{    
        fields: [cartItems.cartId], //Fk is cartId
        references: [cart.id],      //reference is from cart table column id 
    }),
    products: one(products,{
        fields: [cartItems.productId],  //Fk is productId
        references: [products.id],       //reference is from products table column id 
    }),
}));


// Export inferred types
export type User = InferSelectModel<typeof users>;
export type Product = InferSelectModel<typeof products>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItems = InferSelectModel<typeof orderItems>;
export type Cart = InferSelectModel<typeof cart>;
export type CartItems = InferSelectModel<typeof cartItems>;