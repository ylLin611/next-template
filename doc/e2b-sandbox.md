# CLI

## 安装CLI

```bash
npm install -g e2b
```

## 登录

```bash
e2b auth login
```

## 创建Template

```bash
e2b template build --name xxx --cmd xxx
```

注意：如果有 --cmd 需要在CMD下执行，如果是GIT BASH，路径会找GIT安装路径

## 发布(依赖docker)

```bash
e2b template publish -t team_Id
```

# USE

## 安装

```bash
pnpm i @e2b/code-interpreter
```
