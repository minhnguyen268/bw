
Cái git bash
1. Tải git bash về
2. Chạy lệnh sau:
git config --global user.name "minhnguyen268"
git config --global user.email clueabsence4658@gmail.com
3. Tạo key ssh (nhấn enter, rồi vào trong lấy key): ssh-keygen -t rsa -b 4096 -C "clueabsence4658@gmail.com" 

Tạo repo và push code lên github
```
git init
git add .
git commit -m"deploy"
git remote add origin {URL_GIT}
git branch -M main
git push -u origin main
```

Đăng nhập vào VPS
ssh root@...
pass

Cài đặt git trên server

```
sudo apt update
sudo apt install git

```
Rồi chạy lệnh


Cài đặt docker cho server

```
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Test docker có chạy thành công không

```
 docker ps
 docker compose
```

Tiến hành deploy backend, front-end, mongodb, redis (để code sang công khai)

```
git clone {URL_GIT} deploy


```

**<span style="color:red;">Lưu ý phải clone src từ github về mày chủ và vào thư mục vừa clone về và tiến hành chạy lệnh</span>**

```
chạy ls -la để lấy thứ mục rồi chạy cd "thư mục đó"
và chạy lệnh:
docker compose up -d
```

Tiến hành backup database
**<span style="color:red;">Lưu ý thay đổi một số biến sau khi copy</span>**

ví dụ: mongodb+srv://visualemployer7418:xxN45FOkDFXC7OTL@wang.yv536me.mongodb.net/?retryWrites=true&w=majority&appName=wang

Lúc này:
username = visualemployer7418
password = xxN45FOkDFXC7OTL
host = wang.yv536me.mongodb.net
DB_NAME = test (lúc tạo database name, muốn xem vào database trong mongodb vào data vào collection )

```
docker exec deploy-mongo-service-1 mongodump --uri="mongodb+srv://visualemployer7418:xxN45FOkDFXC7OTL@wang.yv536me.mongodb.net/test" --out=/backup

docker exec deploy-mongo-service-1 cp -r /backup/test /backup/admin
docker exec deploy-mongo-service-1 rm -r /backup/test

docker exec deploy-mongo-service-1 mongorestore --host 103.214.8.39 --port 27017 --username admin --password xxN45FOkDFXC7OTL --authenticationDatabase admin /backup
```

Cài đặt ufw để mở port tường lửa cho server

```
sudo apt-get update
sudo apt-get install ufw
sudo ufw enable

=> copy hết dưới chạy rồi enter lệnh cuối hoặc chạy từng lệnh cho chắc:
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 443/tcp
sudo ufw allow 3002
sudo ufw allow 3002/tcp
sudo ufw allow 6379
sudo ufw allow 6379/tcp
sudo ufw allow 27017
sudo ufw allow 27017/tcp
sudo ufw allow 8082
sudo ufw allow 8082/tcp

sudo ufw status
```

Cài đặt nginx

```
sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
systemctl status nginx (lệnh này ấn Enter thêm ko được ấn CRTL + C)
```

sau đó chỉnh sửa file /etc/nginx/nginx.conf

=> thêm phần: server_names_hash_bucket_size 64;
nano /etc/nginx/nginx.conf

Tìm đến dòng # server_names_hash_bucket_size 64 rồi xóa # sau đó bấm CRTL + X => Y => Enter

Setup http cho web client

```
echo 'server {
        listen 80;
        listen [::]:80;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name gamehay.fun;
        location / {
                proxy_pass http://localhost:3002;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection '\''upgrade'\'';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}' | sudo tee /etc/nginx/sites-available/client >/dev/null
```

Trỏ file tới nginx có thể đọc được

```
sudo ln -s /etc/nginx/sites-available/client /etc/nginx/sites-enabled/client
```

Setup http cho web admin

```
echo 'server {
        listen 80;
        listen [::]:80;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name admin.gamehay.fun;
        location / {
                proxy_pass http://localhost:8082;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection '\''upgrade'\'';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}' | sudo tee /etc/nginx/sites-available/admin >/dev/null
```

Trỏ file tới nginx có thể đọc được

```
sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/admin
```

Khởi động lại nginx

```
sudo systemctl restart nginx
```

**<span style="color:blue;">
Sau đó truy cập vào http://game68.fun và http://admin.game68.fun
</span>**

Tạo https vơi cert bot

```
sudo apt install snapd
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx (Hiển thị ra (Enter 'c' to cancel): nhập email nào cũng được rồi nhấn Enter -> Ấn Y -> Y -> Enter
```


XONG!

Trường hợp sửa gì của code muốn cập nhập lại vào server (đứng lại thư mục deploy - thư mục up lên git) gõ: 
```
git pull
docker compose build
docker compose up -d
docker system prune -f  (ý nghĩa là xóa code cũ)
```





Đổi tên miền

- Vào git đổi 2 file env và docker....

git pull
docker compose build
docker compose up -d
docker system prune -f


Chạy trên server 2 lệnh:
sudo rm /etc/nginx/sites-available/client /etc/nginx/sites-enabled/client
sudo rm /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/admin
systemctl reload nginx

- sửa
Setup http cho web client

echo 'server {
        listen 80;
        listen [::]:80;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name gamehay.fun;
        location / {
                proxy_pass http://localhost:3002;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection '\''upgrade'\'';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}' | sudo tee /etc/nginx/sites-available/client >/dev/null
```

Trỏ file tới nginx có thể đọc được

```
sudo ln -s /etc/nginx/sites-available/client /etc/nginx/sites-enabled/client
```

Setup http cho web admin

```
echo 'server {
        listen 80;
        listen [::]:80;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name admin.gamehay.fun;
        location / {
                proxy_pass http://localhost:8082;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection '\''upgrade'\'';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}' | sudo tee /etc/nginx/sites-available/admin >/dev/null
```

Trỏ file tới nginx có thể đọc được

```
sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/admin
```
Khởi động lại nginx

```
sudo systemctl restart nginx
```

**<span style="color:blue;">
Sau đó truy cập vào http://game68.fun và http://admin.game68.fun
</span>**

Tạo https vơi cert bot

```
sudo certbot --nginx -> Enter
```









Tiến hành backup database
**<span style="color:red;">Lưu ý thay đổi một số biến sau khi copy</span>**

ví dụ: mongodb+srv://visualemployer7418:xxN45FOkDFXC7OTL@wang.yv536me.mongodb.net/?retryWrites=true&w=majority&appName=wang

Lúc này:
username = visualemployer7418
password = xxN45FOkDFXC7OTL
host = wang.yv536me.mongodb.net
DB_NAME = test (lúc tạo database name, muốn xem vào database trong mongodb vào data vào collection )

```
docker exec deploy-mongo-service-1 mongodump --uri="mongodb+srv://visualemployer7418:xxN45FOkDFXC7OTL@wang.yv536me.mongodb.net/test" --out=/backup

docker exec deploy-mongo-service-1 cp -r /backup/test /backup/admin
docker exec deploy-mongo-service-1 rm -r /backup/test

docker exec deploy-mongo-service-1 mongorestore --host 103.214.8.39 --port 27017 --username admin --password xxN45FOkDFXC7OTL --authenticationDatabase admin /backup
