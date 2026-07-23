# Product traceability

This system is built to let manifacturer create product, and for the "transporter, warehouse, and store" to register or change the state the prodcut, by combining both web2 and web3 technologies

## Prerequisites

Before proceeding, ensure the following software is installed:

- Docker Desktop (Windows/macOS) or Docker Engine (Linux)

you could verify installation:

```bash
docker --version
```

---

# Project Structure

```text
project/
│
├── backend2/ // nodejs & express js backend
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── backend/ // This where the smart contract and its env are
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── frontend/ // currently not yet built
│   ├── Dockerfile
│   └── ...
│
└── README.md
```

Each service should contain its own `Dockerfile`.

---
 
# Backend Docker Image

Navigate to the backend2 directory.

```bash
cd backend2
```

Build the Docker image.

```bash
docker build -t backend-server .
```

You could verify the image.

```bash
docker images
```

---

# Running the Backend Container

Start a container from the image.

```bash
docker run -d \
    --name backend-container \
    -p 3000:3000 \
    backend-server
```

You could verify that the container is running.

```bash
docker ps
```

You can now access the backend at

```
http://localhost:3500
```

---

# Blockchain Docker Image

Navigate to the backend service.

```bash
cd backend
```

Build the image.

```bash
docker build -t blockchain-node .
```

Run the container.

```bash
docker run -d \
    --name blockchain-container \
    -p 8545:8545 \
    blockchain-node
```

Verify the container.

```bash
docker ps
```