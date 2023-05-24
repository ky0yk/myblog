# Prismaを用いたデータベースマイグレーション

## はじめに

このプロジェクトでは、データベースマイグレーションの管理に[Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)を使用しています。Prisma Migrateは開発者がデータベーススキーマの変更を安全に追跡し、バージョン管理することを可能にします。

## 前提条件

Prisma CLIを使用するためには、Node.jsとnpmがインストールされている必要があります。また、Dockerを介してMySQL 8が稼働している必要があります。

## 基本的なコマンド

- 新しいマイグレーションの作成と適用:

```bash
npx prisma migrate dev --name [マイグレーション名]
```

- データベースの内容を視覚的に確認:

```bash
npx prisma studio
```

## 重要な注意事項

- マイグレーション名は具体的で意味のあるものにすべきです。例えば、新しいテーブル `users` を追加する場合、マイグレーション名は `add_users_table` のようにします。
- `npx prisma migrate dev` コマンドは開発環境専用です。本番環境でのマイグレーション適用には `npx prisma migrate deploy` を使用してください。
