FROM node:18-alpine

WORKDIR /app

# 复制项目文件
COPY package*.json ./
COPY server.js ./
COPY public/ ./public/

# 安装依赖
RUN npm install --production

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["npm", "start"]
