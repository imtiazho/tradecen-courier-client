# 📦 TradeCen Courier | Enterprise Logistics & Terminal Ledger System

TradeCen Courier is a high-performance, hyper-local, and inter-district courier logistics ecosystem. It is architected to seamlessly automate regional hub sorting procedures, orchestrate the central treasury pipelines (HQ Central Ledger), and streamline dynamic merchant payout lifecycles. 

Featuring a premium corporate dark-teal aesthetic, the platform implements robust state management, reactive conditional layouts, and data-driven computational pricing engines.

---

## 🛠️ Core Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, Tailwind CSS | Reactive SPA UI with tailored utility-first responsive styling. |
| **Backend** | Node.js, Express.js | Event-driven RESTful API routing architecture. |
| **Database** | MongoDB | Document-based schema layout optimized for rapid geographical lookups. |
| **Feedback UI** | SweetAlert2 | Custom-branded state alerts and cryptographic operational flags. |

---

## 🚀 Key Operational Flows & Business Logic

### 1. Dynamic Pricing & Coverage Engine
Geographical boundaries and pricing algorithms have been migrated from hardcoded assets into dynamic MongoDB collections to allow real-time runtime configuration.

* **Dependent Dropdown Pipeline:** When a merchant initiates a parcel entry, the application executes optimized queries to dynamically populate destination inputs following a relational hierarchy: `Region` ➔ `District` ➔ `Local Sub-Hub (Covered Area)`.
* **Administrative Status Invalidation (Live Switch):** Toggling an area's status to `inactive` inside the Admin Panel instantly strips it from the merchant booking views via real-time filtering logic.
* **Pricing Algorithm:** Real-time logistics cost calculation utilizes ceiling rounding functions to calculate cumulative bulk weights:

$$\text{Total Cost} = \text{Base Cost} + (\lceil\text{Weight} - 1\rceil \times \text{Extra Fee}) + \text{COD Fee}$$

### 2. HQ Central Finance Ledger (Liquidity Pipeline)
To maintain cryptographic integrity over branch cash flows, a rigid security pipeline manages physical cash transitions between remote terminals and the head office.

* **Hub Audit Submissions:** Local managers bundle operational metrics (Total Parcel Volume, Physical Cash Receipts, and Transaction Slip References) into an immutable ledger request.
* **Headquarters Reconciliation:** Requests are processed through a zero-border, hyper-scannable data grid. Upon manually validating bank receipts, the HQ Administrator executes a `Verify & Accept` transaction, moving funds into the company's central liquid capital balance.

### 3. Automated Hub Sorting & Routing Logic
Terminal dashboards filter high-volume queues automatically into tactical delivery pipelines through a strict localized route matching system:

> 📌 **Local Delivery Allocation:** Matches incoming shipments where the terminal node destination explicitly equals the current session hub (`receiverCity === managerData.hubName`). These are instantly prioritized for local last-mile courier assignment.
>
> 🚀 **Hub Dispatch Allocation:** Captures newly picked-up outgoing parcels destined for external districts. The system aggregates these items into heavy freight manifests routed directly to regional transit gateways.

### 4. Global System Control Room (`/system-settings`)
A centralized management console empowers administrators to update platform behavior on-the-fly without codebase redeployments.
* **Logistics Parameters:** Live configuration inputs modify database parameters globally for parameters like `Inside City Base Rate`, `Outside City Base Rate`, and `COD Commission %`.
* **System Operations Toggle:** Features an emergency master switch to toggle **Maintenance Mode** (locking downstream entry components during high-traffic updates) or suspend open registration endpoints.

---

## 🗄️ Database Schema Blueprint

### 1. `coverages` Collection
```json
{
  "_id": "geo_dhaka_01",
  "region": "Dhaka",
  "district": "Dhaka",
  "city": "Dhaka",
  "covered_area": ["Uttara", "Dhanmondi", "Mirpur", "Mohammadpur"],
  "status": "active",
  "longitude": 90.4125,
  "latitude": 23.8103
}
```
```
### 1. `pricing` Collection
{
  "_id": "global_pricing_rules",
  "insideCity": { "baseCost": 60, "extraWeightFee": 20 },
  "outsideCity": { "baseCost": 120, "extraWeightFee": 30 },
  "codFeePercentage": 1
}
```
---

## 🏃‍♂️ Operational Architecture Summary

TradeCen Courier follows a structured, hub-based parcel lifecycle that manages the entire logistics process, from merchant booking and pickup to last-mile delivery or reverse parcel return.

### 📦 1. Forward Delivery Workflow

The forward workflow handles parcel collection, hub processing, inter-district transportation, and final delivery to the customer.

```mermaid
flowchart TD
    A[📦 Merchant Creates Parcel] --> B[🏬 Origin Hub Manager Assigns Pickup Rider]
    B --> C[🏃 Pickup Rider Collects Parcel]
    C --> D[🏬 Origin Hub Manager Receives Parcel]

    D --> E{📍 Destination Within Current Hub Coverage?}

    E -->|Yes| F[🏃 Assign Local Delivery Rider]
    E -->|No| G[🚚 Dispatch Parcel to Destination Hub]
    G --> H[🏬 Destination Hub Manager Receives Parcel]
    H --> F

    F --> I[📦 Rider Delivers Parcel to Customer]
    I --> J{Delivery Successful?}

    J -->|Yes| K[✅ Parcel Delivered - Workflow Complete]
    J -->|No| L[↩️ Initiate Return Request]

    style A fill:#F4F9F4,stroke:#02312A,stroke-width:2px
    style D fill:#E6F4F1,stroke:#02312A,stroke-width:2px
    style H fill:#E6F4F1,stroke:#02312A,stroke-width:2px
    style K fill:#02312A,stroke:#CAEB66,stroke-width:2px,color:#FFF
    style L fill:#FFF4E5,stroke:#EA580C,stroke-width:2px
```

**Operational sequence:**

1. **Parcel Booking:** The merchant creates a parcel with the required sender, recipient, and destination details.
2. **Pickup Assignment:** The origin hub manager assigns a pickup rider to collect the parcel from the merchant.
3. **Origin Hub Reception:** After pickup, the rider hands over the parcel to the origin hub, where the hub manager receives it into hub operations.
4. **Hub Routing Decision:** The system's operational workflow determines whether the parcel can be delivered within the current hub's coverage or needs inter-hub transportation.
5. **Inter-Hub Dispatch:** If the destination falls outside the current hub's delivery coverage, the origin hub manager dispatches the parcel to the destination hub.
6. **Destination Hub Reception:** The destination hub manager receives the incoming parcel and assigns a delivery rider.
7. **Last-Mile Delivery:** The assigned rider attempts delivery to the customer. Successful delivery marks the parcel as delivered and completes the forward workflow.
8. **Return Initiation:** If delivery is unsuccessful and the parcel is cancelled, the rider initiates a return request for reverse logistics processing.

### ↩️ 2. Reverse Logistics & Return Workflow

The reverse workflow ensures that cancelled parcels are transported back through the hub network and handed over to the originating merchant.

```mermaid
flowchart TD
    A[↩️ Rider Initiates Return Request] --> B[🏬 Destination Hub Manager Reviews Return]
    B --> C[🚚 Dispatch Parcel to Origin Hub]
    C --> D[🏬 Origin Hub Manager Receives Returned Parcel]
    D --> E[🏃 Assign Return Rider]
    E --> F[🤝 Return Rider Hands Over Parcel to Merchant]
    F --> G[✅ Return Completed]

    style A fill:#FFF4E5,stroke:#EA580C,stroke-width:2px
    style D fill:#E6F4F1,stroke:#02312A,stroke-width:2px
    style G fill:#02312A,stroke:#CAEB66,stroke-width:2px,color:#FFF
```

**Operational sequence:**

1. **Return Request:** Following a cancelled delivery, the destination delivery rider initiates a return request.
2. **Reverse Dispatch:** The destination hub manager processes the return and dispatches the parcel back to the origin hub.
3. **Origin Hub Reception:** The origin hub manager receives the returned parcel and updates its operational status.
4. **Return Rider Assignment:** The origin hub manager assigns a rider to return the parcel to the merchant.
5. **Merchant Handover:** The return rider hands over the parcel to the originating merchant, completing the reverse logistics lifecycle.

### 🎥 Workflow Demonstrations

Explore both operational workflows through the demonstration videos:

- **Forward Delivery Workflow:** https://lnkd.in/p/gXBxZw85
- **Reverse Logistics Workflow:** https://lnkd.in/p/gnyYjYdX

---

## 🔐 Demo Accounts

Use the following credentials to explore TradeCen Courier's role-based dashboards and operational workflows.

> **Note:** These are shared demonstration credentials. Use them only on the authorized demo application. Avoid using shared passwords on production accounts.

### 🏪 Merchants

| Account | Email | Password |
|---|---|---|
| Dhanmondi Merchant | `dmerchant@gmail.com` | `123456` |
| Raipur Merchant | `rmerchant@gmail.com` | `123456` |

### 🏬 Hub Managers

| Account | Email | Password |
|---|---|---|
| Dhanmondi Hub Manager | `dhub@gmail.com` | `123456` |
| Raipur Hub Manager | `rmanager@gmail.com` | `123456` |

### 🏃 Riders

| Account | Email | Password |
|---|---|---|
| Dhanmondi Rider | `drider@gmail.com` | `123456` |
| Raipur Rider | `rrider@gmail.com` | `123456` |

**Recommended exploration order:** Start with a merchant account to understand parcel creation, then explore the hub manager and rider dashboards to follow the forward delivery and reverse return lifecycles.


