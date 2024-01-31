# # next-14-lucia-v3-sqlite-drizzle-conform-zod-email-verification-otp-server-actions

# Store Environment Variables

1. Copy `.env.example` file to `.env` file

```bash
cp .env.example .env # duplicate .env.example & name it .env
```

2. Change `DATABASE_PATH` to the filename of your choice

```bash
DATABASE_PATH=sqlite.db
```

## Install the dependencies

```bash
pnpm install
```

## Start the server

```bash
pnpm start
```

## Push schema changes to database

```bash
pnpm db:push
```

## Generate Migrations

```bash
pnpm db:generate
```
