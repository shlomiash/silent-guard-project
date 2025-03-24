import { integer, pgTable, varchar,text} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});


export const IT_Table = pgTable("IT", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  ITnumber: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});