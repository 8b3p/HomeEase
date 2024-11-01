# Wiki


First, generate https pem files in ./https_certs using openssl:
```bash
mkdir https_certs && cd https_certs
openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes
```

then, get the .env file from the project owner and place it in the root directory.
it should have the following format:
```bash
EMAIL_FROM=email
EMAIL_PASSWORD=string
NEXTAUTH_URL=https://localhost:3000
NEXTAUTH_SECRET=string
DATABASE_URL=string
```

make sure you have nodemon installed globally:
```bash
npm install -g nodemon
```
Then, run the following command to start the server:
```bash
npm run dev
```

Finally, open your browser and visit https://localhost:3000

