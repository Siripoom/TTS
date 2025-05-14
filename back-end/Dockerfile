FROM node:18

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# คัดลอก package.json
COPY package.json ./

# คัดลอกเฉพาะโฟลเดอร์ prisma ก่อน
COPY prisma ./prisma/

# ตรวจสอบว่าไฟล์ schema.prisma มีอยู่
RUN ls -la prisma/

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .

RUN echo "DATABASE_URL=${DATABASE_URL}" > prisma/.env && \
    npx prisma db push && \
    npx prisma generate && \
    rm prisma/.env

EXPOSE 5000

CMD ["node", "src/server.js"]%         