# 🧱 StockYard — Construction Materials Stock Management System

A full-stack stock management system for a construction materials depot — track **Cement, Ret (sand), Bajri (gravel), Bricks, and Steel**: current rates, live stock levels, purchases (stock-in), sales (stock-out), suppliers, and customers.

**Stack:** React (Vite) + Django REST Framework + SQLite

---

## ✨ Features

- 📊 **Dashboard** — total stock value, today's purchases/sales, low-stock reorder alerts, recent activity, full stock table
- 🧱 **Materials & Rates** — add/edit materials, set price per unit, set reorder levels
- 🚚 **Stock In (Purchases)** — record material bought from suppliers; stock quantity updates automatically
- 💰 **Stock Out (Sales)** — record material sold to customers; stock quantity decreases automatically
- 👥 **Suppliers & Customers** — manage the parties you buy from and sell to
- ⚠️ **Low-stock alerts** — anything at or below its reorder level is flagged on the dashboard
- 🗄️ **SQLite** — zero-config database, single file, easy to back up or inspect

---

## 🗂️ Project Structure

```
construction_stock/
├── backend/                  # Django REST API
│   ├── core/                 # Django project settings & URLs
│   ├── stock/                 # Main app: models, serializers, views, admin
│   │   ├── models.py          # Material, Supplier, Customer, Purchase, Sale
│   │   ├── serializers.py
│   │   ├── views.py           # ViewSets + /api/dashboard/ summary endpoint
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── management/commands/seed_data.py   # sample data seeder
│   ├── db.sqlite3            # pre-seeded sample database
│   └── manage.py
│
└── frontend/                 # React (Vite) single-page app
    └── src/
        ├── api.js             # axios client + category color map
        ├── App.jsx            # routes
        ├── components/        # Sidebar, StatCard
        └── pages/              # Dashboard, Materials, Purchases, Sales, Parties
```

---

## 🧬 Data Model

| Model | Purpose | Key Fields |
|---|---|---|
| `Material` | Master list of items | `name`, `category`, `unit`, `current_rate`, `stock_quantity`, `reorder_level` |
| `Supplier` | Who you buy from | `name`, `phone`, `address` |
| `Customer` | Who you sell to | `name`, `phone`, `address` |
| `Purchase` | Stock-in transaction | `material`, `supplier`, `quantity`, `rate`, `date` — **adds** to stock on save |
| `Sale` | Stock-out transaction | `material`, `customer`, `quantity`, `rate`, `date` — **subtracts** from stock on save |

Categories: **Cement · Ret (Sand) · Bajri (Gravel) · Bricks · Steel · Other**
Units: Bag · Ton · Cubic Feet · Trolley · Kg · Pieces

Deleting a purchase/sale automatically reverses its effect on stock, so the stock quantity always stays accurate.

---

## 🚀 Getting Started

### 1. Backend (Django API)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install django djangorestframework django-cors-headers

python manage.py migrate          # only needed if db.sqlite3 is removed
python manage.py seed_data        # optional: (re)load sample cement/ret/bajri data
python manage.py createsuperuser  # optional: for /admin/ access

python manage.py runserver 0.0.0.0:8000
```

The API is now live at **http://localhost:8000/api/** (browsable DRF API), and Django admin at **http://localhost:8000/admin/**.

A sample database (`db.sqlite3`) is already included and pre-seeded — you can skip `migrate`/`seed_data` and just run the server if you want to explore immediately.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the app talks to the API at `http://localhost:8000/api/` (configured in `src/api.js`).

> Run both the backend and frontend at the same time, in two terminals.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/` | Summary: stock value, low-stock items, today's & all-time totals, recent activity |
| GET/POST | `/api/materials/` | List / create materials |
| GET/PATCH/DELETE | `/api/materials/{id}/` | Retrieve / update / delete a material |
| GET/POST | `/api/purchases/` | List / create purchases (stock-in) |
| DELETE | `/api/purchases/{id}/` | Delete a purchase (reverses stock) |
| GET/POST | `/api/sales/` | List / create sales (stock-out) |
| DELETE | `/api/sales/{id}/` | Delete a sale (reverses stock) |
| GET/POST | `/api/suppliers/` | List / create suppliers |
| GET/POST | `/api/customers/` | List / create customers |

All endpoints support standard DRF pagination, filtering by ID in the URL, and return JSON.

---

## 🛠️ Notes & Extending

- **Rates** — each `Purchase`/`Sale` stores its own rate at the time of the transaction, so historical margin analysis stays accurate even if `Material.current_rate` changes later.
- **CORS** is open to `localhost:5173` / `localhost:3000` for local dev (`CORS_ALLOW_ALL_ORIGINS = DEBUG` in `settings.py`) — tighten this before deploying.
- **To reset sample data:** delete `db.sqlite3`, run `python manage.py migrate`, then `python manage.py seed_data`.
- **Currency** is displayed as `Rs` (PKR) throughout the UI — change the `fmt()` helper in each page if you need a different currency.
- **Possible extensions:** ledger/invoice PDF export (reuse the same DRF data), party-wise outstanding balance (credit sales), barcode/weighbridge slip printing, multi-warehouse support, user authentication & roles.

---

## 📄 License

Free to use, modify, and extend for personal or commercial projects.

<img width="1886" height="842" alt="image" src="https://github.com/user-attachments/assets/41efad3a-0cfb-479e-88fb-1728ebb257c6" />

