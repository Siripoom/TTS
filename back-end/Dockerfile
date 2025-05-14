FROM node:18

WORKDIR /app

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

# เปิดพอร์ตที่ใช้งาน
EXPOSE 5000

# คอมไพล์ Prisma Client และรันเซิร์ฟเวอร์
CMD ["sh", "-c", "npx prisma generate && node src/server.js"]