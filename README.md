# 🎰 GrowCasino Backend

A **GrowCasino** egy Node.js + Express alapú online kaszinó backend projekt, amely felhasználókezelést, cookie alapú autentikációt, balance rendszert, profilkép kezelést és Mines játékot tartalmaz.

---

# 📑 Tartalomjegyzék

- [A projektről](#-a-projektről)
- [Főbb funkciók](#-főbb-funkciók)
- [Technológiai stack](#-technológiai-stack)
- [Projekt struktúra](#-projekt-struktúra)
- [Környezeti változók](#-környezeti-változók)
- [Telepítés és indítás](#-telepítés-és-indítás)
- [API végpontok](#-api-végpontok)
- [Mines játék működése](#-mines-játék-működése)
- [Balance rendszer](#-balance-rendszer)
- [Autentikáció](#-autentikáció)
- [Biztonsági funkciók](#-biztonsági-funkciók)
- [Használt csomagok](#-használt-csomagok)
- [További fejlesztések](#-további-fejlesztések)

---

# 📌 A projektről

A GrowCasino backend célja egy modern online kaszinó rendszer szerveroldali logikájának biztosítása.

A rendszer jelenleg támogatja:

- Felhasználói regisztráció
- Bejelentkezés
- Cookie alapú JWT autentikáció
- Profilkép feltöltés
- Balance kezelés
- Deposit funkció
- Mines kaszinó játék
- Védett API végpontok

---

# ⚙️ Főbb funkciók

## 👤 Felhasználókezelés

- Regisztráció
- Bejelentkezés
- bcrypt jelszó titkosítás
- JWT token generálás

## 🍪 Auth rendszer

- HTTP only cookie token
- Middleware route védelem

## 💰 Wallet rendszer

- Balance lekérés
- Deposit
- Balance ellenőrzés játék előtt

## 🎮 Mines játék

- 5x5 tábla
- Random bombák
- Reveal rendszer
- Cashout
- Profit számítás

## 🖼️ Profilkezelés

- Profilkép feltöltés
- Profilkép lekérés

---

# 🧱 Technológiai stack

## Backend

- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- cookie-parser
- multer
- cors
- dotenv

---

# 📁 Projekt struktúra

```txt
growCasino_Backend1
│
├── config
│   └── dotenvConfig.js
│
├── controllers
│   ├── balanceController.js
│   ├── minesController.js
│   ├── profileImgController.js
│   └── userController.js
│
├── db
│   └── db.js
│
├── middleware
│   ├── minesMiddleware.js
│   ├── uploadProfileImage.js
│   └── userMiddleware.js
│
├── models
│   ├── minesModel.js
│   ├── userImgModel.js
│   └── userModel.js
│
├── routes
│   ├── minesRoutes.js
│   ├── profileImgRoutes.js
│   └── userRoutes.js
│
├── app.js
├── index.js
├── server.js
├── package.json
└── .gitignore
```

---

# 🔐 Környezeti változók

Hozz létre egy `.env` fájlt a projekt gyökerében:

```env
PORT=4000
HOST=0.0.0.0

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=growcasino

JWT_SECRET=your_secret_key
```

---

# 🚀 Telepítés és indítás

## 1. Repository klónozása

```bash
git clone <repo-url>
cd growCasino_Backend1
```

## 2. Függőségek telepítése

```bash
npm install
```

## 3. Szerver indítása

```bash
npm run dev
```

vagy

```bash
node server.js
```

---

# 🌐 API végpontok

## 👤 User útvonalak

| Metódus | Endpoint | Leírás |
|--------|----------|--------|
| POST | /users/register | Regisztráció |
| POST | /users/login | Bejelentkezés |
| GET | /users/balance | Balance lekérés |
| POST | /users/deposit | Pénz hozzáadása |

---

## 🎮 Mines útvonalak

| Metódus | Endpoint | Leírás |
|--------|----------|--------|
| POST | /mines/start | Játék indítása |
| POST | /mines/reveal | Mező felfedése |
| POST | /mines/cashout | Cashout |

---

## 🖼️ Profilkép útvonalak

| Metódus | Endpoint | Leírás |
|--------|----------|--------|
| POST | /upload-pfp/:id | Profilkép feltöltés |

---

# 🎮 Mines játék működése

A játék egy 5x5-ös táblán fut, összesen **25 mezővel**.

A backend:

- Random bombákat generál
- Eltárolja a játék állapotát
- Ellenőrzi a kattintást
- Profitot számol
- Cashout esetén jóváírja a balance-ra

## Start request példa

```json
{
  "bombs": 5,
  "betAmount": 100
}
```

## Reveal request

```json
{
  "gameId": 1,
  "index": 7
}
```

## Cashout request

```json
{
  "gameId": 1
}
```

---

# 💰 Balance rendszer

A felhasználó egyenlege MySQL adatbázisban tárolódik.

Deposit esetén:

```sql
UPDATE user
SET Balance = Balance + ?
WHERE UserID = ?
```

## Példa

```txt
Jelenlegi balance: 4000
Deposit: 5000
Új balance: 9000
```

---

# 🍪 Autentikáció

A rendszer cookie alapú JWT authot használ.

Login után:

- Token generálás
- Token mentése cookie-ba

Middleware ellenőrzi:

```txt
req.cookies.token
```

---

# 🛡️ Biztonsági funkciók

- bcrypt jelszó titkosítás
- JWT token
- HTTP only cookie
- Middleware route védelem
- Balance check játék előtt
- Frontend nem látja a bombákat

---

# 📦 Használt csomagok

```json
{
  "bcrypt": "^latest",
  "cookie-parser": "^latest",
  "cors": "^latest",
  "dotenv": "^latest",
  "express": "^latest",
  "jsonwebtoken": "^latest",
  "multer": "^latest",
  "mysql2": "^latest",
  "nodemon": "^latest"
}
```

---

# 🧪 Tesztelés (Postman)

Ajánlott sorrend:

1. Register  
2. Login
3. Profile-image Upload
4. Deposit  
5. Balance  
6. Start Game  
7. Reveal  
8. Cashout  

---

# 🔮 További fejlesztések

- Withdraw rendszer
- Új játékok (Roulette, BlackJack, Bacaratta, és különböző Slot játékok)
- Tranzakció history
- Admin panel
- Jackpot rendszer


---

# 👨‍💻 Készítő
Nagy Levente, Mirkó Péter

GrowCasino Backend projekt.
