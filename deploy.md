Great! Let's go **super simple and step-by-step** assuming you are a complete beginner.

---

## 🎯 Scenario Recap

| Component      | IP Address    | Current Status              |
| -------------- | ------------- | --------------------------- |
| React frontend | Your local PC | Built on your PC            |
| Node backend   | Your local PC | Built on your PC            |
| Database       | 10.100.95.60  | Already running and working |
| New Server     | 10.100.95.161 | Empty server (clean)        |

---

## ✅ Goal

Deploy your **React frontend** and **Node backend** on **new server (`10.100.95.161`)**, and connect to **DB on `10.100.95.60`**.

---

## 🛠 Step by Step Deployment Guide

---

### Step 1: Connect to your server (using SSH)

#### From Windows:

1. Open **PowerShell**.
2. Type:

   ```bash
   ssh root@10.100.95.161
   ```

   (If `root` is not working, try the username given by your provider or admin.)

#### From Linux/Mac:

1. Open Terminal.
2. Type:

   ```bash
   ssh root@10.100.95.161
   ```

If prompted, accept the connection and enter your **server password**.

---

### Step 2: Install required software on server

Once logged in:

#### 1. Update server

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Install Node.js & npm

```bash
sudo apt install nodejs npm -y
```

#### 3. Install Nginx (for frontend serving)

```bash
sudo apt install nginx -y
```

---

### Step 3: Upload your **backend code** and **frontend build** to server

#### Option 1 (Simple way using `scp` from your PC):

Open PowerShell and upload:

##### Upload Backend

```bash
scp -r C:\path\to\your\backend root@10.100.95.161:/home/
```

##### Upload Frontend

```bash
scp -r C:\path\to\your\frontend\build root@10.100.95.161:/home/
```

#### Option 2 (GUI method):

Use **FileZilla** (download from [https://filezilla-project.org/](https://filezilla-project.org/))

* Host: `10.100.95.161`
* Username: `root`
* Password: (your password)
* Port: `22`
* Upload your files into `/home/` directory.

---

### Step 4: Setup your backend

1. Go into your backend folder:

   ```bash
   cd /home/backend
   ```

2. Install packages:

   ```bash
   npm install
   ```

3. Setup `.env` file or config file to point to your **DB on `10.100.95.60`**.
   Example MongoDB connection string:

   ```
   mongodb://10.100.95.60:27017/yourdbname
   ```

4. Start backend using **PM2 (recommended way to keep it running)**

   ```bash
   npm install -g pm2
   pm2 start index.js --name backend-app
   pm2 save
   ```

5. Check if it's running:

   ```bash
   pm2 status
   ```

#### ✅ Ensure your backend is running on a port, for example `5000`.

#### ✅ Allow port if firewall enabled:

```bash
sudo ufw allow 5000
```

---

### Step 5: Setup frontend to serve using Nginx

1. Copy your frontend build to Nginx root folder:

   ```bash
   sudo cp -r /home/build/* /var/www/html/
   ```

2. Optional: Configure Nginx to forward API calls to backend:
   Edit Nginx config:

   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

   Example config:

   ```nginx
   server {
       listen 80;
       server_name 10.100.95.161;

       root /var/www/html;
       index index.html;

       location / {
           try_files $uri /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:5000/;
       }
   }
   ```

3. Reload Nginx:

   ```bash
   sudo systemctl reload nginx
   ```

---

### Step 6: Test everything

1. Open browser and visit:

   ```
   http://10.100.95.161
   ```

2. Your React frontend should load.

3. Test API calls (your frontend should hit `/api/...` and backend should process and talk to your DB on `10.100.95.60`).

---

## ✅ Summary Overview

| Task              | Command/Tool                              |
| ----------------- | ----------------------------------------- |
| Connect to server | SSH (via PowerShell/Terminal)             |
| Install software  | Node, Nginx via `apt`                     |
| Upload code       | `scp` or FileZilla                        |
| Setup backend     | `npm install`, PM2                        |
| Setup frontend    | Copy build to Nginx folder                |
| Configure Nginx   | Edit `/etc/nginx/sites-available/default` |
| Test              | Browser + Postman                         |

---

Would you like me to give you a **fully working ready-made deployment script that does all this automatically?**
If yes, just say `"Yes, give me script."`.
