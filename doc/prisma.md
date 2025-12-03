# 初始化prisma

```bash
npx prisma init
```

# 创建实体

在`prisma/schema.prisma`中定义实体

例:
```prisma
model User {
  id Int @id @default(autoincrement())
  name String
  email String @unique
  password String
}
```

# 同步到数据库

```bash
npx prisma migrate dev
```

# prisma 操作
