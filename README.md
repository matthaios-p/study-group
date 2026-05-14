# Study Group Platform

## Περιγραφή
Μια πλατφόρμα (MERN stack) που επιτρέπει σε φοιτητές να δημιουργούν, να αναζητούν και να γίνονται μέλη σε ομάδες μελέτης.

## Οδηγίες Εγκατάστασης & Εκτέλεσης (Local Development)

### Προαπαιτούμενα
- Node.js (v18+)
- MongoDB (Τοπικά ή MongoDB Atlas URI)

### Εγκατάσταση
1. Κάντε clone το repository:
   `git clone https://github.com/username/study-group-app.git`
2. Μεταβείτε στον φάκελο του backend και εγκαταστήστε τα dependencies:
   `cd backend && npm install`
3. Μεταβείτε στον φάκελο του frontend και εγκαταστήστε τα dependencies:
   `cd ../frontend && npm install`

### Ρύθμιση Μεταβλητών Περιβάλλοντος
Δημιουργήστε ένα αρχείο `.env` στον φάκελο `backend` με τα εξής:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

### Εκτέλεση Εφαρμογής
- Για το Backend (σε νέο τερματικό):
  `cd backend && npm run dev`
- Για το Frontend (σε νέο τερματικό):
  `cd frontend && npm start`

Η εφαρμογή θα τρέχει στο `http://localhost:3000`.
