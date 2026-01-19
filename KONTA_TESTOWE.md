# Konta Testowe

## Konta do logowania

### Admin
- Email: `admin@bookstore.local`
- Hasło: `Admin123!`
- Rola: ADMIN
- Uprawnienia: Pełny dostęp do wszystkich funkcji

### Moderator
- Email: `moderator@bookstore.local`
- Hasło: `Mod123!`
- Rola: MODERATOR
- Uprawnienia: Moderowanie postów i komentarzy w przypisanych kategoriach

### Użytkownik
- Email: `user@bookstore.local`
- Hasło: `User123!`
- Rola: USER
- Uprawnienia: Podstawowe funkcje użytkownika (przeglądanie, kupowanie, komentowanie)

## Jak się zalogować

1. Przejdź do: http://localhost:3000/login
2. Wprowadź email i hasło z listy powyżej
3. Kliknij "Zaloguj się"

## Logowanie przez OAuth (Google)

Konfiguracja Google OAuth:
- Client ID: `146979846506-bbhvas7vv2nb3iumkikvagq5gp96lpn6.apps.googleusercontent.com`
- Redirect URI: `http://localhost:3000/api/auth/callback/google`
- Authorized JavaScript origins: `http://localhost:3000`

### Rozwiązanie problemu redirect_uri_mismatch:

1. **Zrestartuj serwer Next.js** (Ctrl+C, potem `npm run dev`)
2. **Wyczyść cookies przeglądarki** dla localhost:3000
3. **Usuń uprawnienia aplikacji** w Google Account:
   - https://myaccount.google.com/permissions
4. **Spróbuj w trybie incognito**
5. **Sprawdź Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials
   - Upewnij się, że Authorized redirect URIs zawiera dokładnie: `http://localhost:3000/api/auth/callback/google`

## Porty

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Backend: http://localhost:3001/api

## Seeding bazy danych

Aby ponownie zainicjować bazę danych z kontami testowymi:

```bash
cd backend
npx prisma db seed
```

## Jak działają posty

### System moderacji postów:

1. **Użytkownik (USER)** - Gdy tworzy post, ma on status `PENDING` i czeka na zatwierdzenie
2. **Moderator/Admin** - Musi przejść do sekcji `/moderation` i zatwierdzić post
3. **Admin** - Posty tworzone przez admina są automatycznie zatwierdzane

### Nowa funkcjonalność:

#### Menu Admin (prawy górny róg)
- **Widoczne tylko dla adminów i moderatorów**
- Opcje:
  - ✏️ **Utwórz post** - Szybkie tworzenie nowego posta
  - 🛡️ **Moderacja** - Panel moderacyjny

#### Strona główna
- **Wyświetla 5 najnowszych postów** (zatwierdzone)
- Kliknięcie na post prowadzi do szczegółów
- Link "Posty" w menu został usunięty (dostępny tylko przez Admin menu)

#### Szczegóły posta (`/posts/[id]`)
- Pełna treść posta
- Lista zatwierdzonych komentarzy
- Formularz dodawania komentarzy (dla zalogowanych)
- **Dla adminów/moderatorów:**
  - Lista komentarzy oczekujących na zatwierdzenie
  - Przyciski do zatwierdzania/usuwania komentarzy bezpośrednio na stronie posta
  - Możliwość usuwania zatwierdzonych komentarzy

### Kroki aby zobaczyć posty:

1. **Zaloguj się jako admin** (`admin@bookstore.local` / `Admin123!`)
2. Kliknij **Admin** w prawym górnym rogu → **Utwórz post**
3. Wypełnij formularz i kliknij **Opublikuj post**
4. Post pojawi się na stronie głównej (`/`)
5. Kliknij na post aby zobaczyć szczegóły i moderować komentarze

### Moderacja komentarzy:

1. Zaloguj się jako admin/moderator
2. Przejdź do dowolnego posta
3. Jeśli są komentarze oczekujące, zobaczysz ostrzeżenie
4. Kliknij "Pokaż oczekujące"
5. Zatwierdź lub usuń komentarze

### Jeśli nie widzisz postów:

- Sprawdź czy jesteś zalogowany jako **Admin** lub **Moderator** (tylko oni mają dostęp)
- Sprawdź w sekcji **Moderacja** czy są posty oczekujące na zatwierdzenie
- Zatwierdź posty w sekcji Moderacja - pojawią się wtedy na stronie głównej

