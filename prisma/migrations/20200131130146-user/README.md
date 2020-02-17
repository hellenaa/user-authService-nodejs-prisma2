# Migration `20200131130146-user`

This migration has been generated by lena at 1/31/2020, 1:01:46 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "userSchema"."user" (
    "GUID" text  NOT NULL ,
    "createdAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    "email" text  NOT NULL DEFAULT '',
    "firstName" text   ,
    "lastName" text   ,
    "password" text  NOT NULL DEFAULT '',
    "role" text  NOT NULL DEFAULT 'USER',
    "updatedAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    PRIMARY KEY ("GUID")
) 

CREATE UNIQUE INDEX "user.email" ON "userSchema"."user"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200131130146-user
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,23 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url      = "postgresql://postgreadmin:513015@192.168.2.204:5432/lifepack_prisma2?schema=userSchema"
+}
+
+model user {
+  GUID  String    @id  @default(uuid())
+  email String   @unique
+  password String
+  firstName String?
+  lastName String?
+  role String  @default("USER")
+  createdAt DateTime   @default(now())
+  updatedAt DateTime   @updatedAt
+}
+enum Role {
+    USER
+    ADMIN
+}
```

