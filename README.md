# Maie app

## Description

## Run Locally

1. Clone the project

```
git clone https://github.com/andrsgrza/maie-app.git
```

2. Create a .env file and make sure it contains the following environment variables:

```
MAIE_GATEWAY_HOST_PATH=
S3_BUCKET_NAME=
CLOUDFRONT_DIST_ID=
```

3. Create local certificates for https

```
mkdir -p certs && openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.crt -days 365 -nodes -subj "/CN=localhost"
```

4. Install dependencies

```
yarn install
```

5. Run the app

```
yarn start
```

## Run tests

## Deploy to production

### Manual Deployment

1. Create a .env.production file and make sure it contains the following prod environment variables:

```
MAIE_GATEWAY_HOST_PATH=
S3_BUCKET_NAME=
CLOUDFRONT_DIST_ID=
```

#### Deploy via script

2. Run

```
yarn deploy
```

#### Deploy via AWS CLI

Alternatively, after step 1 you can:

2. Build the project for production

```
npm run build
```

3. Upload the files to S3

```
aws s3 sync dist/ s3://${S3_BUCKET_NAME} --delete
```

- Uploads all new files in dist/
- Uploads all files in dist/ that have been modified
- removes all files that are no longer in dist/
  to s3://maie-frontend

4. To invalidate the cache, run

```
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --paths "/*" \
  --no-cli-pager
```

## Frontend Architecture

### S3 Bucket

- The frontend is hosted on an S3 bucket
- The bucket is configured to serve the files from the dist/ folder and it stores the static build files
- It is publicly accessible with s3:GetObject permissions
- The bucket does not allows public write access
- The bucket uses "static website hosting" to with
  - index.html as the index document
  - index.html as the error document

### CloudFront Distribution

- The CloudFront distribution is configured to serve the files from the S3 bucket thorugh de AWS global network (CDN)
- It chaches the file for performance though it can be invalidated with crete-invalidation command
- It has configured
  - Origin Access Control (OAC) to read the bucket
  - Custom domain (maie-app.com)
- It has a TLSS (HTTP) certificate created in ACM (Amazon Certificate Manager)
  - The certificate es for maie-app.com and was validated vía DNS in Route 53

### Route 53

- Es the DNS manager for the domain maie-app.com
- It has a A record that points to the CloudFront distribution

### Visual Summary of the Architecture

User  
↓  
maie-app.com (via Route 53)  
↓  
CloudFront (HTTPS + Cache)  
↓  
S3 (Archivos del build)
