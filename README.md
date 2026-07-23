# Product traceability

This system is built to let manifacturer create product, and for the "transporter, warehouse, and store" to register or change the state the prodcut, by combining both web2 and web3 technologies

## Prerequisites

Before proceeding, ensure the following software is installed:

- Docker Desktop (Windows/macOS) or Docker Engine (Linux)

you could verify installation:

```bash
docker --version
```

## Requirements

Make sure you have installed:

- Docker
- Docker Compose


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
 
## Start the Containers

From the project root directory, run:

```bash
docker compose up --build
```

This will start:

- The local Hardhat blockchain container
- The backend API container

The services will be available at:

- Blockchain: `http://localhost:8545`
- Backend API: `http://localhost:3500`

---

## Deploy the Smart Contracts

After the containers are running, open a new terminal and enter the blockchain container:

```bash
docker exec -it traceability-blockchain bash
```

Inside the container, run:

```bash
npm run deploy-local
```

This command deploys the smart contracts to the local Hardhat blockchain.

After deployment, the contract addresses and deployment information will be available in the container logs.
---

# Application Workflow

## 1. Product Creation

Before creating a product through the API, the `createProduct` function from the smart contract must be called with the required parameters.

The deployment script provides the necessary information about the deployed contracts and transactions.

After calling the contract function successfully, use the following endpoint to prepare the product creation:

### Prepare Product Creation

**Endpoint**

```
POST http://localhost:3500/manifacturer/product/prepare
```

**Body**

```json
{
  "name": "Wireless Mouse",
  "reference": "WM-2026-002",
  "serialNumber": "SN-WM-000002",
  "description": "Ergonomic Bluetooth wireless mouse"
}
```

This endpoint prepares the product data before creation.

After receiving the prepared information, confirm the product creation:

---

### Confirm Product Creation

**Endpoint**

```
POST http://localhost:3500/manifacturer/product/confirm
```

**Body**

```json
{
  "productID": "a79c318a-9f4c-48b1-a422-e12eb46a02f1",
  "txHash": "0xca4cc4b2658f513303ae358b7761564de1f7fabe8c3910e7a1d88ef53d6e9beb",
  "name": "Wireless Mouse",
  "reference": "WM-2026-002",
  "serialNumber": "SN-WM-000002",
  "description": "Ergonomic Bluetooth wireless mouse"
}
```

This endpoint:

- Adds the product record to the database.
- Updates the initial product status.

---

# 2. Traceability Event Creation

Before adding or updating traceability information, the corresponding traceability function from the smart contract must be called.

After the blockchain transaction is confirmed, use the following endpoints.

---

## Prepare Traceability Update

**Endpoint**

```
POST http://localhost:3500/products/a79c318a-9f4c-48b1-a422-e12eb46a02f1/trace/prepare
```

**Body**

```json
{
  "stepType": "2",
  "location": "Casablanca Factory",
  "notes": "Package collected successfully."
}
```

This endpoint prepares the traceability event data before confirming the blockchain transaction.

---

## Confirm Traceability Update

**Endpoint**

```
POST http://localhost:3500/products/a79c318a-9f4c-48b1-a422-e12eb46a02f1/trace/confirm
```

**Body**

```json
{
  "stepType": "2",
  "location": "Casablanca Factory",
  "notes": "Package collected successfully.",
  "txHash": "0xf18e953dccd8631bae7ca7dd13aad9e098e7f76f8fad54f22a2aa9c0e16e99a0"
}
```

This endpoint:

- Confirms the blockchain transaction.
- Adds the traceability record to the database.
- Updates the current product status.

---

# Testing the API

The backend API is available at:

```
http://localhost:3500
```

The endpoints can be tested using:

- Postman
- Thunder Client
- Any HTTP client


