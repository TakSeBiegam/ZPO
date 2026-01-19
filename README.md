# KsiÄ™garnia - Projekt zaliczeniowy

## 1. Przeznaczenie aplikacji

Aplikacja jest systemem ksiÄ™garni internetowej umoĹĽliwiajÄ…cym zarzÄ…dzanie katalogiem produktĂłw, procesem zakupowym oraz publikacjÄ… treĹ›ci. System skĹ‚ada siÄ™ z warstwy backendowej opartej o NestJS oraz frontendowej w technologii Next.js. Aplikacja obsĹ‚uguje trzy rodzaje uĹĽytkownikĂłw: administratorĂłw, moderatorĂłw oraz zwykĹ‚ych uĹĽytkownikĂłw, kaĹĽdy z odpowiednimi uprawnieniami dostÄ™pu do funkcjonalnoĹ›ci.

## 2. FunkcjonalnoĹ›ci aplikacji

### 2.1 ZarzÄ…dzanie uĹĽytkownikami i autoryzacja
- Rejestracja nowych uĹĽytkownikĂłw z walidacjÄ… danych
- Logowanie za pomocÄ… email/hasĹ‚o oraz OAuth (Google, GitHub)
- Sesyjne zarzÄ…dzanie stanem autoryzacji
- Aktualizacja profilu uĹĽytkownika (imiÄ™, adres, miasto)
- System rĂłl (USER, MODERATOR, ADMIN)

### 2.2 ModuĹ‚ galerii
- Dodawanie obrazĂłw do galerii przez administratorĂłw
- ZarzÄ…dzanie sliderem gĹ‚Ăłwnej strony
- WybĂłr kolejnoĹ›ci wyĹ›wietlania obrazĂłw w sliderze
- Publiczny dostÄ™p do galerii dla wszystkich uĹĽytkownikĂłw

### 2.3 ModuĹ‚ produktĂłw
- PrzeglÄ…danie katalogu produktĂłw (ksiÄ…ĹĽek)
- WyĹ›wietlanie szczegĂłĹ‚Ăłw produktu (tytuĹ‚, autor, rok wydania, cena, opis)
- Dodawanie i edycja produktĂłw przez administratorĂłw
- Przypisywanie produktĂłw do kategorii
- System komentarzy do produktĂłw z moderacjÄ…
- Zatwierdzanie komentarzy przez moderatorĂłw

### 2.4 ModuĹ‚ postĂłw
- Tworzenie postĂłw przez uĹĽytkownikĂłw
- Przypisywanie postĂłw do kategorii
- System moderacji postĂłw (status: PENDING, APPROVED)
- Zatwierdzanie postĂłw przez moderatorĂłw i administratorĂłw
- ZarzÄ…dzanie kategoriami przez administratorĂłw
- Przypisywanie moderatorĂłw do konkretnych kategorii

### 2.5 ModuĹ‚ koszyka i zamĂłwieĹ„
- Dodawanie produktĂłw do koszyka
- ZarzÄ…dzanie iloĹ›ciÄ… produktĂłw w koszyku
- SkĹ‚adanie zamĂłwieĹ„ z automatycznym pobieraniem adresu z profilu
- PrzeglÄ…danie historii zamĂłwieĹ„
- Zmiana statusu zamĂłwieĹ„ przez moderatorĂłw (PENDING, PAID, CANCELLED)

### 2.6 System powiadomieĹ„
- Generowanie powiadomieĹ„ dla uĹĽytkownikĂłw
- Powiadomienia o zatwierdzeniu postĂłw
- PrzeglÄ…danie nieprzeczytanych powiadomieĹ„ po zalogowaniu
- Oznaczanie powiadomieĹ„ jako przeczytane

### 2.7 System refleksji API
- Automatyczne odkrywanie struktury aplikacji
- Generowanie dokumentacji endpointĂłw API
- Analiza kontrolerĂłw i serwisĂłw
- DostÄ™p do struktury w formacie JSON i HTML

## 3. Wymagania systemowe i sprzÄ™towe

### Minimalne wymagania systemowe
- System operacyjny: Windows 10/11, macOS 10.15+, Linux (dystrybucje z kernelem 4.x+)
- Node.js w wersji 20.x lub nowszej
- npm w wersji 10.x lub nowszej
- Minimum 4 GB pamiÄ™ci RAM
- 500 MB wolnego miejsca na dysku
- PrzeglÄ…darka internetowa: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Rekomendowane wymagania
- 8 GB pamiÄ™ci RAM
- Procesor dwurdzeniowy 2.0 GHz lub lepszy
- PoĹ‚Ä…czenie internetowe (dla funkcji OAuth)

## 4. SposĂłb instalacji

### 4.1 Klonowanie repozytorium
```bash
git clone <adres-repozytorium>
cd zaliczenie
```

### 4.2 Instalacja zaleĹĽnoĹ›ci
```bash
npm install
```

### 4.3 Konfiguracja bazy danych
```bash
npm run prisma:generate -w backend
npm run prisma:migrate -w backend
```

### 4.4 Inicjalizacja danych testowych (opcjonalnie)
```bash
cd backend
npm run seed
```

### 4.5 Konfiguracja OAuth (opcjonalnie)
SzczegĂłĹ‚owe instrukcje znajdujÄ… siÄ™ w pliku `OAUTH_SETUP.md`. Wymagane utworzenie aplikacji w Google Cloud Console i GitHub Developer Settings oraz skonfigurowanie zmiennych Ĺ›rodowiskowych w pliku `frontend/.env.local`.

## 5. SposĂłb uĹĽycia

### 5.1 Uruchomienie aplikacji

#### Backend (port 3001)
```bash
npm run dev -w backend
```

#### Frontend (port 3000)
```bash
npm run dev -w frontend
```

### 5.2 DostÄ™p do aplikacji
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Dokumentacja API: http://localhost:3001/api-structure/html

### 5.3 DomyĹ›lne konta testowe
Po zainicjowaniu danych testowych dostÄ™pne sÄ… nastÄ™pujÄ…ce konta:
- Administrator: admin@bookstore.local / Admin123!
- Moderator: moderator@bookstore.local / Mod123!

### 5.4 PrzepĹ‚yw pracy uĹĽytkownika

#### UĹĽytkownik standardowy
1. Rejestracja w systemie poprzez formularz lub OAuth
2. PrzeglÄ…danie katalogu produktĂłw
3. Dodawanie komentarzy do produktĂłw
4. Dodawanie produktĂłw do koszyka
5. SkĹ‚adanie zamĂłwieĹ„
6. Tworzenie postĂłw
7. PrzeglÄ…danie powiadomieĹ„

#### Moderator
1. Wszystkie funkcje uĹĽytkownika standardowego
2. Zatwierdzanie postĂłw w przypisanych kategoriach
3. Moderacja komentarzy uĹĽytkownikĂłw
4. ZarzÄ…dzanie statusami zamĂłwieĹ„

#### Administrator
1. Wszystkie funkcje moderatora
2. Dodawanie nowych produktĂłw do systemu
3. ZarzÄ…dzanie galeriÄ… i sliderem
4. Tworzenie kategorii
5. Przypisywanie moderatorĂłw do kategorii

## 6. Wykorzystane narzÄ™dzia i biblioteki

### 6.1 Backend
- **NestJS** v10.3.8 - Framework aplikacyjny oparty o Node.js
- **Prisma** v5.13.0 - ORM do zarzÄ…dzania bazÄ… danych
- **SQLite** - Relacyjna baza danych
- **bcrypt** v5.1.1 - Biblioteka do hashowania haseĹ‚
- **express-session** v1.17.3 - ZarzÄ…dzanie sesjami uĹĽytkownikĂłw
- **TypeScript** v5.4.5 - Statyczne typowanie dla JavaScript
- **Reflect Metadata** v0.2.2 - Wsparcie dla refleksji i metadanych

### 6.2 Frontend
- **Next.js** v14.2.5 - Framework React z renderowaniem po stronie serwera
- **React** v18.3.1 - Biblioteka do budowy interfejsĂłw uĹĽytkownika
- **NextAuth** v5.0.0-beta.30 - Biblioteka autoryzacji dla Next.js
- **TypeScript** v5.4.5 - Statyczne typowanie dla JavaScript

### 6.3 NarzÄ™dzia deweloperskie
- **@nestjs/cli** v10.4.2 - NarzÄ™dzie CLI dla NestJS
- **ts-node** v10.9.2 - Wykonywanie kodu TypeScript
- **npm workspaces** - ZarzÄ…dzanie monorepo

## 7. Opis wykorzystania cech programowania obiektowego

### 7.1 Hermetyzacja

Hermetyzacja zostaĹ‚a zrealizowana poprzez ukrycie implementacji wewnÄ™trznej logiki biznesowej w klasach serwisĂłw z wykorzystaniem modyfikatorĂłw dostÄ™pu TypeScript.

**PrzykĹ‚ad w AuthService:**
```typescript
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // Pole prisma jest prywatne i niedostÄ™pne spoza klasy
}
```

Wszystkie serwisy (`AuthService`, `GalleryService`, `PostsService`, `CartService`, `ProductsService`, `UsersService`, `NotificationsService`) wykorzystujÄ… prywatne pola dla zaleĹĽnoĹ›ci oraz udostÄ™pniajÄ… publiczne metody jako interfejs komunikacji z logikÄ… biznesowÄ….

### 7.2 Dziedziczenie

Dziedziczenie zostaĹ‚o zaimplementowane w warstwie domenowej aplikacji poprzez hierarchiÄ™ klas reprezentujÄ…cych treĹ›ci.

**Implementacja (backend/src/domain/content.ts):**
```typescript
export abstract class ContentItem {
  constructor(protected title: string, protected body: string) {}
  abstract getSummary(): string;
}

export class PostItem extends ContentItem {
  getSummary(): string {
    return `Post: ${this.title}`;
  }
}

export class ProductItem extends ContentItem {
  getSummary(): string {
    return `Product: ${this.title}`;
  }
}
```

Klasa abstrakcyjna `ContentItem` definiuje wspĂłlnÄ… strukturÄ™ dla rĂłĹĽnych typĂłw treĹ›ci, natomiast klasy `PostItem` i `ProductItem` dziedziczÄ… po niej i rozszerzajÄ… jej funkcjonalnoĹ›Ä‡. Pola `title` i `body` sÄ… chronione (protected), co umoĹĽliwia dostÄ™p w klasach potomnych przy zachowaniu hermetyzacji.

### 7.3 Polimorfizm

Polimorfizm realizowany jest poprzez abstrakcyjnÄ… metodÄ™ `getSummary()`, ktĂłra posiada rĂłĹĽne implementacje w zaleĹĽnoĹ›ci od typu obiektu.

```typescript
const items: ContentItem[] = [
  new PostItem("TytuĹ‚ postu", "TreĹ›Ä‡"),
  new ProductItem("TytuĹ‚ produktu", "Opis")
];

items.forEach(item => {
  console.log(item.getSummary()); // WywoĹ‚anie odpowiedniej implementacji
});
```

KaĹĽda klasa potomna dostarcza wĹ‚asnÄ… implementacjÄ™ metody `getSummary()`, co pozwala na jednolite traktowanie rĂłĹĽnych typĂłw obiektĂłw przy zachowaniu specyficznego dla nich zachowania.

### 7.4 Dependency Injection

Aplikacja wykorzystuje wzorzec Dependency Injection, ktĂłry jest formÄ… realizacji zasad programowania obiektowego. NestJS automatycznie wstrzykuje zaleĹĽnoĹ›ci do konstruktorĂłw klas, co zwiÄ™ksza testowalnoĹ›Ä‡ i luĹşne powiÄ…zanie miÄ™dzy komponentami.

```typescript
@Module({
  imports: [PrismaModule, UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### 7.5 System refleksji jako metaprogramowanie obiektowe

ModuĹ‚ `ReflectionService` wykorzystuje zaawansowane techniki programowania obiektowego do dynamicznej analizy struktury aplikacji w czasie wykonania poprzez API refleksji TypeScript i NestJS.

## 8. Struktura projektu

```
zaliczenie/
â”śâ”€â”€ backend/                    # Aplikacja serwerowa NestJS
â”‚   â”śâ”€â”€ src/
â”‚   â”‚   â”śâ”€â”€ auth/              # ModuĹ‚ autoryzacji
â”‚   â”‚   â”śâ”€â”€ cart/              # ModuĹ‚ koszyka i zamĂłwieĹ„
â”‚   â”‚   â”śâ”€â”€ domain/            # Warstwa domenowa (OOP)
â”‚   â”‚   â”śâ”€â”€ gallery/           # ModuĹ‚ galerii
â”‚   â”‚   â”śâ”€â”€ notifications/     # ModuĹ‚ powiadomieĹ„
â”‚   â”‚   â”śâ”€â”€ posts/             # ModuĹ‚ postĂłw
â”‚   â”‚   â”śâ”€â”€ prisma/            # Konfiguracja ORM
â”‚   â”‚   â”śâ”€â”€ products/          # ModuĹ‚ produktĂłw
â”‚   â”‚   â”śâ”€â”€ reflection/        # System refleksji API
â”‚   â”‚   â”śâ”€â”€ users/             # ModuĹ‚ uĹĽytkownikĂłw
â”‚   â”‚   â”śâ”€â”€ app.module.ts      # GĹ‚Ăłwny moduĹ‚ aplikacji
â”‚   â”‚   â””â”€â”€ main.ts            # Punkt wejĹ›cia
â”‚   â””â”€â”€ prisma/
â”‚       â”śâ”€â”€ schema.prisma      # Schemat bazy danych
â”‚       â””â”€â”€ migrations/        # Migracje bazy danych
â”śâ”€â”€ frontend/                  # Aplikacja kliencka Next.js
â”‚   â”śâ”€â”€ app/                   # Routing i strony
â”‚   â”‚   â”śâ”€â”€ (auth)/           # Strony autoryzacji
â”‚   â”‚   â”śâ”€â”€ api/              # API routes (NextAuth)
â”‚   â”‚   â”śâ”€â”€ cart/             # Strona koszyka
â”‚   â”‚   â”śâ”€â”€ gallery/          # Galeria i zarzÄ…dzanie
â”‚   â”‚   â”śâ”€â”€ moderation/       # Panel moderacji
â”‚   â”‚   â”śâ”€â”€ orders/           # Historia zamĂłwieĹ„
â”‚   â”‚   â”śâ”€â”€ posts/            # Posty
â”‚   â”‚   â”śâ”€â”€ products/         # Katalog produktĂłw
â”‚   â”‚   â””â”€â”€ profile/          # Profil uĹĽytkownika
â”‚   â””â”€â”€ components/           # Komponenty React
â”śâ”€â”€ OAUTH_SETUP.md            # Instrukcja konfiguracji OAuth
â””â”€â”€ README.md                 # Niniejsza dokumentacja
```

## 9. Architektura aplikacji

### 9.1 Architektura backendowa

Backend oparty jest o architekturÄ™ moduĹ‚owÄ… NestJS, w ktĂłrej kaĹĽdy moduĹ‚ odpowiada za konkretnÄ… domenÄ™ biznesowÄ…:

- **Controller** - Warstwa obsĹ‚ugi ĹĽÄ…daĹ„ HTTP, walidacja uprawnieĹ„
- **Service** - Logika biznesowa, interakcja z bazÄ… danych
- **Module** - Definicja zaleĹĽnoĹ›ci i eksportowanych komponentĂłw

### 9.2 Baza danych

Aplikacja wykorzystuje SQLite jako relacyjnÄ… bazÄ™ danych zarzÄ…dzanÄ… przez Prisma ORM. Model danych obejmuje nastÄ™pujÄ…ce encje:

- User - UĹĽytkownicy systemu
- Category - Kategorie produktĂłw i postĂłw
- Post - Posty uĹĽytkownikĂłw
- Comment - Komentarze do produktĂłw
- Product - Produkty w katalogu
- Cart, CartItem - Koszyk zakupowy
- Order, OrderItem - ZamĂłwienia
- GalleryImage, SliderItem - Galeria i slider
- Notification - Powiadomienia uĹĽytkownikĂłw
- ModeratorCategory - Przypisania moderatorĂłw do kategorii

### 9.3 BezpieczeĹ„stwo

- Hashowanie haseĹ‚ przy uĹĽyciu bcrypt (10 rund)
- Ochrona przed SQL Injection przez Prisma ORM
- Sesyjne zarzÄ…dzanie autoryzacjÄ…
- Kontrola dostÄ™pu oparta na rolach (RBAC)
- Walidacja uprawnieĹ„ na poziomie kontrolerĂłw
- CORS skonfigurowany dla frontendu

## 10. API Endpoints

PeĹ‚na, aktualna dokumentacja endpointĂłw API dostÄ™pna jest pod adresem:
http://localhost:3001/api-structure/html

System automatycznie generuje dokumentacjÄ™ na podstawie refleksji struktury aplikacji.

### GĹ‚Ăłwne grupy endpointĂłw:

- **/auth** - Autoryzacja i zarzÄ…dzanie sesjÄ…
- **/users** - ZarzÄ…dzanie profilem uĹĽytkownika
- **/products** - Katalog produktĂłw i komentarze
- **/posts** - System postĂłw i kategorii
- **/cart** - Koszyk i zamĂłwienia
- **/gallery** - Galeria i slider
- **/notifications** - Powiadomienia uĹĽytkownikĂłw
- **/api-structure** - Dokumentacja API (refleksja)

## 11. Informacje o projekcie

Projekt zostaĹ‚ zrealizowany jako praca zaliczeniowa zgodnie z wymaganiami przedmiotu Zaawansowane Programowanie w Javie. Aplikacja speĹ‚nia wszystkie wymagania formalne, w tym wykorzystanie paradygmatu programowania obiektowego z zastosowaniem hermetyzacji, dziedziczenia i polimorfizmu.

### Repozytorium
Kod ĹşrĂłdĹ‚owy projektu jest zarzÄ…dzany przy uĹĽyciu systemu kontroli wersji Git. Commity wykonywane sÄ… przez wszystkich czĹ‚onkĂłw zespoĹ‚u projektowego zgodnie z wymaganiami projektu.

### Autorzy
[Do uzupeĹ‚nienia przez zespĂłĹ‚ projektowy]

### Licencja
[Do uzupeĹ‚nienia wedĹ‚ug wymagaĹ„]

# Modified on 2026-01-19 14:30:00
# Modified on 2026-01-19 14:30:00
# Modified on 2026-01-19 14:30:00
