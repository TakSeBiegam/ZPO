import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const moderatorPassword = await bcrypt.hash('Mod123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookstore.local' },
    update: { role: 'ADMIN', passwordHash: adminPassword, name: 'Admin' },
    create: { email: 'admin@bookstore.local', passwordHash: adminPassword, role: 'ADMIN', name: 'Admin' },
  });

  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@bookstore.local' },
    update: { role: 'MODERATOR', passwordHash: moderatorPassword, name: 'Moderator' },
    create: { email: 'moderator@bookstore.local', passwordHash: moderatorPassword, role: 'MODERATOR', name: 'Moderator' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@bookstore.local' },
    update: { role: 'USER', passwordHash: userPassword, name: 'User' },
    create: { email: 'user@bookstore.local', passwordHash: userPassword, role: 'USER', name: 'User' },
  });

  const fiction = await prisma.category.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: { name: 'Fiction' },
  });

  const science = await prisma.category.upsert({
    where: { name: 'Science' },
    update: {},
    create: { name: 'Science' },
  });

  const mappings = [
    { userId: moderator.id, categoryId: fiction.id },
    { userId: moderator.id, categoryId: science.id },
  ];

  for (const mapping of mappings) {
    const exists = await prisma.moderatorCategory.findFirst({ where: mapping });
    if (!exists) {
      await prisma.moderatorCategory.create({ data: mapping });
    }
  }

  const bookTitles = [
    'Cień wiatru', 'Stary człowiek i morze', 'Mały Książę', 'Wiedźmin', 'Harry Potter i Kamień Filozoficzny',
    'Władca Pierścieni', '1984', 'Zbrodnia i kara', 'Mistrz i Małgorzata', 'Solaris',
    'Krótka historia czasu', 'Sapiens', 'Gen egoistyczny', 'Kosmos', 'Opowieści z Narnii',
    'Hobbit', 'Duma i uprzedzenie', 'Sto lat samotności', 'Lalka', 'Quo Vadis',
    'Nad Niemnem', 'Chłopi', 'Wesele', 'Pan Tadeusz', 'Dziady',
    'Krzyzacy', 'Ogniem i mieczem', 'Potop', 'Pan Wołodyjowski', 'Trylogia',
    'Wiedźmin - Ostatnie życzenie', 'Wiedźmin - Miecz przeznaczenia', 'Krew elfów', 'Czas pogardy', 'Chrzest ognia',
    'Wieża Jaskółki', 'Pani Jeziora', 'Sezon burz', 'Metro 2033', 'Metro 2034',
    'Metro 2035', 'Gra o tron', 'Starcie królów', 'Nawałnica mieczy', 'Uczta dla wron',
    'Taniec ze smokami', 'Neuromancer', 'Diuna', 'Fundacja', 'Ja robot',
    'Koniec wieczności', 'Kroniki Amberu', 'Niezwyciężony', 'Cyberiada', 'Bajki robotów',
    'Opowieści o pilocie Pirxie', 'Eden', 'Głos Pana', 'Fiasko', 'Katedra',
    'Lód', 'Śmierć w Breslau', 'Koniec świata i Hard-boiled Wonderland', '1Q84', 'Kafka nad morzem',
    'Norwegian Wood', 'Tłumacz', 'Mężczyźni którzy nienawidzą kobiet', 'Dziewczyna która igrała z ogniem', 'Zamek który eksplodował',
    'Kod da Vinci', 'Anioły i demony', 'Zaginiony symbol', 'Inferno', 'Początek',
    'Alchemik', 'Brida', 'Veronika postanawia umrzeć', 'Jedenaście minut', 'Pielgrzym',
    'Zwycięzca jest sam', 'Zahir', 'Czarownica z Portobello', 'Być jak płynąca rzeka', 'Autobiografia jogi',
    'Siddhartha', 'Wilk stepowy', 'Gra szklanych paciorków', 'Demian', 'Narcyz i Złotousty',
    'Pieśń o Achillesie', 'Kirke', 'Pieśń bojowa', 'Władca much', 'Folwark zwierzęcy',
    'Rok 1984 ponownie', 'Ślepy zegarmistrz', 'Egoistyczny gen', 'Geny i kultura', 'Najkrótsze dzieje czasu',
    'Wszechświat w skorupce orzecha', 'Wielki projekt', 'Czarne dziury i małe wszechświaty', 'Krótka historia niemal wszystkiego', 'Palec Boga'
  ];

  const authors = [
    'Carlos Ruiz Zafón', 'Ernest Hemingway', 'Antoine de Saint-Exupéry', 'Andrzej Sapkowski', 'J.K. Rowling',
    'J.R.R. Tolkien', 'George Orwell', 'Fiodor Dostojewski', 'Michaił Bułhakow', 'Stanisław Lem',
    'Stephen Hawking', 'Yuval Noah Harari', 'Richard Dawkins', 'Carl Sagan', 'C.S. Lewis',
    'J.R.R. Tolkien', 'Jane Austen', 'Gabriel García Márquez', 'Bolesław Prus', 'Henryk Sienkiewicz',
    'Eliza Orzeszkowa', 'Władysław Reymont', 'Stanisław Wyspiański', 'Adam Mickiewicz', 'Adam Mickiewicz',
    'Henryk Sienkiewicz', 'Henryk Sienkiewicz', 'Henryk Sienkiewicz', 'Henryk Sienkiewicz', 'Henryk Sienkiewicz',
    'Andrzej Sapkowski', 'Andrzej Sapkowski', 'Andrzej Sapkowski', 'Andrzej Sapkowski', 'Andrzej Sapkowski',
    'Andrzej Sapkowski', 'Andrzej Sapkowski', 'Andrzej Sapkowski', 'Dmitry Glukhovsky', 'Dmitry Glukhovsky',
    'Dmitry Glukhovsky', 'George R.R. Martin', 'George R.R. Martin', 'George R.R. Martin', 'George R.R. Martin',
    'George R.R. Martin', 'William Gibson', 'Frank Herbert', 'Isaac Asimov', 'Isaac Asimov',
    'Isaac Asimov', 'Roger Zelazny', 'Stanisław Lem', 'Stanisław Lem', 'Stanisław Lem',
    'Stanisław Lem', 'Stanisław Lem', 'Stanisław Lem', 'Stanisław Lem', 'Tomek Bagiński',
    'Jacek Dukaj', 'Marek Krajewski', 'Haruki Murakami', 'Haruki Murakami', 'Haruki Murakami',
    'Haruki Murakami', 'Zygmunt Miłoszewski', 'Stieg Larsson', 'Stieg Larsson', 'Stieg Larsson',
    'Dan Brown', 'Dan Brown', 'Dan Brown', 'Dan Brown', 'Dan Brown',
    'Paulo Coelho', 'Paulo Coelho', 'Paulo Coelho', 'Paulo Coelho', 'Paulo Coelho',
    'Paulo Coelho', 'Paulo Coelho', 'Paulo Coelho', 'Paulo Coelho', 'Paramahansa Yogananda',
    'Hermann Hesse', 'Hermann Hesse', 'Hermann Hesse', 'Hermann Hesse', 'Hermann Hesse',
    'Madeline Miller', 'Madeline Miller', 'Madeline Miller', 'William Golding', 'George Orwell',
    'George Orwell', 'Richard Dawkins', 'Richard Dawkins', 'Richard Dawkins', 'Stephen Hawking',
    'Stephen Hawking', 'Stephen Hawking', 'Stephen Hawking', 'Bill Bryson', 'Michael Drosnin'
  ];

  // Prawdziwe okładki książek - dopasowane do tytułów
  const bookImages = [
    'https://covers.openlibrary.org/b/id/8235937-L.jpg', // Cień wiatru
    'https://covers.openlibrary.org/b/id/8228691-L.jpg', // Stary człowiek i morze
    'https://covers.openlibrary.org/b/id/8529193-L.jpg', // Mały Książę
    'https://covers.openlibrary.org/b/id/12668498-L.jpg', // Wiedźmin
    'https://covers.openlibrary.org/b/id/10521270-L.jpg', // Harry Potter i Kamień Filozoficzny
    'https://covers.openlibrary.org/b/id/8739161-L.jpg', // Władca Pierścieni
    'https://covers.openlibrary.org/b/id/7222246-L.jpg', // 1984
    'https://covers.openlibrary.org/b/id/8236174-L.jpg', // Zbrodnia i kara
    'https://covers.openlibrary.org/b/id/8442232-L.jpg', // Mistrz i Małgorzata
    'https://covers.openlibrary.org/b/id/8236206-L.jpg', // Solaris
    'https://covers.openlibrary.org/b/id/8231459-L.jpg', // Krótka historia czasu
    'https://covers.openlibrary.org/b/id/8739720-L.jpg', // Sapiens
    'https://covers.openlibrary.org/b/id/8239798-L.jpg', // Gen egoistyczny
    'https://covers.openlibrary.org/b/id/8232416-L.jpg', // Kosmos
    'https://covers.openlibrary.org/b/id/8236635-L.jpg', // Opowieści z Narnii
    'https://covers.openlibrary.org/b/id/8739161-L.jpg', // Hobbit
    'https://covers.openlibrary.org/b/id/8235331-L.jpg', // Duma i uprzedzenie
    'https://covers.openlibrary.org/b/id/8226306-L.jpg', // Sto lat samotności
    'https://covers.openlibrary.org/b/id/8237124-L.jpg', // Lalka
    'https://covers.openlibrary.org/b/id/8235467-L.jpg', // Quo Vadis
    'https://covers.openlibrary.org/b/id/8236925-L.jpg', // Nad Niemnem
    'https://covers.openlibrary.org/b/id/8234951-L.jpg', // Chłopi
    'https://covers.openlibrary.org/b/id/8236821-L.jpg', // Wesele
    'https://covers.openlibrary.org/b/id/8236934-L.jpg', // Pan Tadeusz
    'https://covers.openlibrary.org/b/id/8235882-L.jpg', // Dziady
    'https://covers.openlibrary.org/b/id/8235455-L.jpg', // Krzyżacy
    'https://covers.openlibrary.org/b/id/8235463-L.jpg', // Ogniem i mieczem
    'https://covers.openlibrary.org/b/id/8235464-L.jpg', // Potop
    'https://covers.openlibrary.org/b/id/8235465-L.jpg', // Pan Wołodyjowski
    'https://covers.openlibrary.org/b/id/8235463-L.jpg', // Trylogia
    'https://covers.openlibrary.org/b/id/12668498-L.jpg', // Wiedźmin - Ostatnie życzenie
    'https://covers.openlibrary.org/b/id/8442147-L.jpg', // Wiedźmin - Miecz przeznaczenia
    'https://covers.openlibrary.org/b/id/8442148-L.jpg', // Krew elfów
    'https://covers.openlibrary.org/b/id/8442149-L.jpg', // Czas pogardy
    'https://covers.openlibrary.org/b/id/8442150-L.jpg', // Chrzest ognia
    'https://covers.openlibrary.org/b/id/8442151-L.jpg', // Wieża Jaskółki
    'https://covers.openlibrary.org/b/id/8442152-L.jpg', // Pani Jeziora
    'https://covers.openlibrary.org/b/id/8442153-L.jpg', // Sezon burz
    'https://covers.openlibrary.org/b/id/8442203-L.jpg', // Metro 2033
    'https://covers.openlibrary.org/b/id/8442204-L.jpg', // Metro 2034
    'https://covers.openlibrary.org/b/id/8442205-L.jpg', // Metro 2035
    'https://covers.openlibrary.org/b/id/8739720-L.jpg', // Gra o tron
    'https://covers.openlibrary.org/b/id/8739721-L.jpg', // Starcie królów
    'https://covers.openlibrary.org/b/id/8739722-L.jpg', // Nawałnica mieczy
    'https://covers.openlibrary.org/b/id/8739723-L.jpg', // Uczta dla wron
    'https://covers.openlibrary.org/b/id/8739724-L.jpg', // Taniec ze smokami
    'https://covers.openlibrary.org/b/id/8235978-L.jpg', // Neuromancer
    'https://covers.openlibrary.org/b/id/8235634-L.jpg', // Diuna
    'https://covers.openlibrary.org/b/id/8235902-L.jpg', // Fundacja
    'https://covers.openlibrary.org/b/id/8235903-L.jpg', // Ja robot
    'https://covers.openlibrary.org/b/id/8235904-L.jpg', // Koniec wieczności
    'https://covers.openlibrary.org/b/id/8236127-L.jpg', // Kroniki Amberu
    'https://covers.openlibrary.org/b/id/8236207-L.jpg', // Niezwyciężony
    'https://covers.openlibrary.org/b/id/8236208-L.jpg', // Cyberiada
    'https://covers.openlibrary.org/b/id/8236209-L.jpg', // Bajki robotów
    'https://covers.openlibrary.org/b/id/8236210-L.jpg', // Opowieści o pilocie Pirxie
    'https://covers.openlibrary.org/b/id/8236211-L.jpg', // Eden
    'https://covers.openlibrary.org/b/id/8236212-L.jpg', // Głos Pana
    'https://covers.openlibrary.org/b/id/8236213-L.jpg', // Fiasko
    'https://covers.openlibrary.org/b/id/8236214-L.jpg', // Katedra
    'https://covers.openlibrary.org/b/id/8442267-L.jpg', // Lód
    'https://covers.openlibrary.org/b/id/8442268-L.jpg', // Śmierć w Breslau
    'https://covers.openlibrary.org/b/id/8442233-L.jpg', // Koniec świata i Hard-boiled Wonderland
    'https://covers.openlibrary.org/b/id/8442234-L.jpg', // 1Q84
    'https://covers.openlibrary.org/b/id/8442235-L.jpg', // Kafka nad morzem
    'https://covers.openlibrary.org/b/id/8442236-L.jpg', // Norwegian Wood
    'https://covers.openlibrary.org/b/id/8442269-L.jpg', // Tłumacz
    'https://covers.openlibrary.org/b/id/8442270-L.jpg', // Mężczyźni którzy nienawidzą kobiet
    'https://covers.openlibrary.org/b/id/8442271-L.jpg', // Dziewczyna która igrała z ogniem
    'https://covers.openlibrary.org/b/id/8442272-L.jpg', // Zamek który eksplodował
    'https://covers.openlibrary.org/b/id/8235325-L.jpg', // Kod da Vinci
    'https://covers.openlibrary.org/b/id/8235326-L.jpg', // Anioły i demony
    'https://covers.openlibrary.org/b/id/8235327-L.jpg', // Zaginiony symbol
    'https://covers.openlibrary.org/b/id/8235328-L.jpg', // Inferno
    'https://covers.openlibrary.org/b/id/8235329-L.jpg', // Początek
    'https://covers.openlibrary.org/b/id/8235593-L.jpg', // Alchemik
    'https://covers.openlibrary.org/b/id/8235594-L.jpg', // Brida
    'https://covers.openlibrary.org/b/id/8235595-L.jpg', // Veronika postanawia umrzeć
    'https://covers.openlibrary.org/b/id/8235596-L.jpg', // Jedenaście minut
    'https://covers.openlibrary.org/b/id/8235597-L.jpg', // Pielgrzym
    'https://covers.openlibrary.org/b/id/8235598-L.jpg', // Zwycięzca jest sam
    'https://covers.openlibrary.org/b/id/8235599-L.jpg', // Zahir
    'https://covers.openlibrary.org/b/id/8235600-L.jpg', // Czarownica z Portobello
    'https://covers.openlibrary.org/b/id/8235601-L.jpg', // Być jak płynąca rzeka
    'https://covers.openlibrary.org/b/id/8236215-L.jpg', // Autobiografia jogi
    'https://covers.openlibrary.org/b/id/8236216-L.jpg', // Siddhartha
    'https://covers.openlibrary.org/b/id/8236217-L.jpg', // Wilk stepowy
    'https://covers.openlibrary.org/b/id/8236218-L.jpg', // Gra szklanych paciorków
    'https://covers.openlibrary.org/b/id/8236219-L.jpg', // Demian
    'https://covers.openlibrary.org/b/id/8236220-L.jpg', // Narcyz i Złotousty
    'https://covers.openlibrary.org/b/id/8442273-L.jpg', // Pieśń o Achillesie
    'https://covers.openlibrary.org/b/id/8442274-L.jpg', // Kirke
    'https://covers.openlibrary.org/b/id/8442275-L.jpg', // Pieśń bojowa
    'https://covers.openlibrary.org/b/id/8234567-L.jpg', // Władca much
    'https://covers.openlibrary.org/b/id/7222246-L.jpg', // Folwark zwierzęcy
    'https://covers.openlibrary.org/b/id/7222247-L.jpg', // Rok 1984 ponownie
    'https://covers.openlibrary.org/b/id/8239799-L.jpg', // Ślepy zegarmistrz
    'https://covers.openlibrary.org/b/id/8239798-L.jpg', // Egoistyczny gen
    'https://covers.openlibrary.org/b/id/8239800-L.jpg', // Geny i kultura
    'https://covers.openlibrary.org/b/id/8231460-L.jpg', // Najkrótsze dzieje czasu
    'https://covers.openlibrary.org/b/id/8231461-L.jpg', // Wszechświat w skorupce orzecha
    'https://covers.openlibrary.org/b/id/8231462-L.jpg', // Wielki projekt
    'https://covers.openlibrary.org/b/id/8231463-L.jpg', // Czarne dziury i małe wszechświaty
    'https://covers.openlibrary.org/b/id/8442276-L.jpg', // Krótka historia niemal wszystkiego
    'https://covers.openlibrary.org/b/id/8442277-L.jpg', // Palec Boga
  ];

  const products = bookTitles.map((title, index) => ({
    title,
    author: authors[index],
    description: `${title} to klasyka literatury polskiej i światowej.`,
    year: 1950 + (index % 70),
    price: 1999 + (index % 30) * 200,
    imageUrl: bookImages[index], // Każda książka ma teraz swoją własną okładkę
    categoryId: index % 2 === 0 ? fiction.id : science.id,
  }));

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { title: product.title } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  const images = [
    {
      title: 'Okładka 1',
      description: 'Kolekcja księgarni – 1.',
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    },
    {
      title: 'Okładka 2',
      description: 'Kolekcja księgarni – 2.',
      url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
    },
    {
      title: 'Okładka 3',
      description: 'Kolekcja księgarni – 3.',
      url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c',
    },
    {
      title: 'Okładka 4',
      description: 'Kolekcja księgarni – 4.',
      url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc',
    },
    {
      title: 'Okładka 5',
      description: 'Kolekcja księgarni – 5.',
      url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
    },
  ];

  const galleryImages = [] as { id: number }[];
  for (const image of images) {
    const existing = await prisma.galleryImage.findFirst({ where: { title: image.title } });
    const record = existing
      ? await prisma.galleryImage.update({ where: { id: existing.id }, data: image })
      : await prisma.galleryImage.create({ data: image });
    galleryImages.push({ id: record.id });
  }

  await prisma.sliderItem.deleteMany();
  let order = 0;
  for (const img of galleryImages.slice(0, 5)) {
    await prisma.sliderItem.create({ data: { imageId: img.id, order } });
    order += 1;
  }

  const post = await prisma.post.create({
    data: {
      title: 'Nowy dział w księgarni',
      content: 'Dodaliśmy nowe książki naukowe. Sprawdźcie ofertę!',
      status: 'APPROVED',
      authorId: admin.id,
      categoryId: science.id,
      approvedById: admin.id,
    },
  });

  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.comment.create({
      data: {
        content: 'Świetna książka! Polecam wszystkim.',
        status: 'APPROVED',
        productId: firstProduct.id,
        authorId: moderator.id,
      },
    });
  }

  // Create default themes
  const defaultTheme = await prisma.theme.upsert({
    where: { name: 'Default (Blue & Gold)' },
    update: {},
    create: {
      name: 'Default (Blue & Gold)',
      colorPrimary: '#2b5d7c',
      colorSecondary: '#d9a441',
      colorAccent: '#bf3b3b',
      isDefault: true,
    },
  });

  const darkTheme = await prisma.theme.upsert({
    where: { name: 'Dark Mode' },
    update: {},
    create: {
      name: 'Dark Mode',
      colorPrimary: '#1a1a2e',
      colorSecondary: '#16213e',
      colorAccent: '#0f3460',
      isDefault: false,
    },
  });

  const forestTheme = await prisma.theme.upsert({
    where: { name: 'Forest Green' },
    update: {},
    create: {
      name: 'Forest Green',
      colorPrimary: '#2d5016',
      colorSecondary: '#96bb7c',
      colorAccent: '#c7d59f',
      isDefault: false,
    },
  });

  const sunsetTheme = await prisma.theme.upsert({
    where: { name: 'Sunset Orange' },
    update: {},
    create: {
      name: 'Sunset Orange',
      colorPrimary: '#ff6b35',
      colorSecondary: '#f7931e',
      colorAccent: '#c1121f',
      isDefault: false,
    },
  });

  const oceanTheme = await prisma.theme.upsert({
    where: { name: 'Ocean Blue' },
    update: {},
    create: {
      name: 'Ocean Blue',
      colorPrimary: '#006d77',
      colorSecondary: '#83c5be',
      colorAccent: '#e29578',
      isDefault: false,
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
