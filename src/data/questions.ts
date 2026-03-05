export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export type Category = 'law' | 'it' | 'games' | 'movies' | 'books';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  { id: 'law', name: 'Právo', icon: '⚖️', description: 'Otázky z českého a mezinárodního práva' },
  { id: 'it', name: 'IT', icon: '💻', description: 'Informační technologie a programování' },
  { id: 'games', name: 'Hry', icon: '🎮', description: 'Videoherní svět a historie' },
  { id: 'movies', name: 'Filmy & Seriály', icon: '🎬', description: 'Filmový a seriálový svět' },
  { id: 'books', name: 'Knihy', icon: '📚', description: 'Světová i česká literatura' },
];

const lawQuestions: Question[] = [
  { question: 'Kolik článků má Listina základních práv a svobod?', options: ['44', '42', '46', '40'], correctIndex: 0 },
  { question: 'Co je to habeas corpus?', options: ['Právo na soudní přezkum zadržení', 'Právo na obhajobu', 'Právo na odvolání', 'Právo na mlčení'], correctIndex: 0 },
  { question: 'Který soud je nejvyšší instancí v ČR pro občanskoprávní spory?', options: ['Nejvyšší soud', 'Ústavní soud', 'Nejvyšší správní soud', 'Vrchní soud'], correctIndex: 0 },
  { question: 'Co znamená zkratka GDPR?', options: ['General Data Protection Regulation', 'Global Data Privacy Rules', 'General Digital Privacy Regulation', 'Global Data Protection Rights'], correctIndex: 0 },
  { question: 'Kolik soudců má Ústavní soud ČR?', options: ['15', '12', '10', '20'], correctIndex: 0 },
  { question: 'Co je to presumpce neviny?', options: ['Dokud není prokázána vina, je obviněný nevinen', 'Právo na obhájce', 'Právo odmítnout výpověď', 'Právo na odvolání'], correctIndex: 0 },
  { question: 'Jaký je minimální věk pro trestní odpovědnost v ČR?', options: ['15 let', '14 let', '16 let', '18 let'], correctIndex: 0 },
  { question: 'Co je to precedent?', options: ['Soudní rozhodnutí sloužící jako vzor', 'Zákonné ustanovení', 'Ústavní dodatek', 'Procesní pravidlo'], correctIndex: 0 },
  { question: 'Který zákon upravuje pracovní právo v ČR?', options: ['Zákoník práce', 'Občanský zákoník', 'Obchodní zákoník', 'Trestní zákoník'], correctIndex: 0 },
  { question: 'Co je to exekuce?', options: ['Nucený výkon rozhodnutí', 'Soudní řízení', 'Zákonné opatření', 'Trestní stíhání'], correctIndex: 0 },
  { question: 'Kdo jmenuje soudce Ústavního soudu ČR?', options: ['Prezident se souhlasem Senátu', 'Předseda vlády', 'Parlament', 'Ministr spravedlnosti'], correctIndex: 0 },
  { question: 'Co je to občanský zákoník?', options: ['Základní právní předpis občanského práva', 'Zákon o trestním řízení', 'Ústava ČR', 'Zákon o obcích'], correctIndex: 0 },
  { question: 'Jaká je promlčecí lhůta u obecných občanskoprávních nároků?', options: ['3 roky', '5 let', '1 rok', '10 let'], correctIndex: 0 },
  { question: 'Co je to právní subjektivita?', options: ['Způsobilost mít práva a povinnosti', 'Schopnost jednat před soudem', 'Právo volit', 'Povinnost platit daně'], correctIndex: 0 },
  { question: 'Která instituce zastupuje stát v trestním řízení?', options: ['Státní zastupitelství', 'Advokacie', 'Notářství', 'Ombudsman'], correctIndex: 0 },
  { question: 'Co je to ústavní stížnost?', options: ['Návrh na ochranu základních práv u Ústavního soudu', 'Trestní oznámení', 'Správní žaloba', 'Odvolání k vrchnímu soudu'], correctIndex: 0 },
  { question: 'Jaký je rozdíl mezi veřejným a soukromým právem?', options: ['Veřejné reguluje vztahy se státem, soukromé mezi osobami', 'Veřejné je tajné, soukromé veřejné', 'Žádný rozdíl', 'Veřejné platí jen pro úředníky'], correctIndex: 0 },
  { question: 'Co je to notářský zápis?', options: ['Veřejná listina sepsaná notářem', 'Policejní protokol', 'Soudní rozsudek', 'Advokátní spis'], correctIndex: 0 },
  { question: 'Kolik komor má Parlament ČR?', options: ['2', '1', '3', '4'], correctIndex: 0 },
  { question: 'Co je to mediace?', options: ['Mimosoudní řešení sporů za pomoci třetí strany', 'Soudní řízení', 'Trestní stíhání', 'Exekuční řízení'], correctIndex: 0 },
  { question: 'Jaká je délka funkčního období prezidenta ČR?', options: ['5 let', '4 roky', '6 let', '7 let'], correctIndex: 0 },
  { question: 'Co je to správní řízení?', options: ['Postup správního orgánu při rozhodování', 'Trestní řízení', 'Civilní soudní spor', 'Exekuce'], correctIndex: 0 },
  { question: 'Který orgán kontroluje hospodaření státu?', options: ['Nejvyšší kontrolní úřad', 'Česká národní banka', 'Ústavní soud', 'Senát'], correctIndex: 0 },
  { question: 'Co je to amnestie?', options: ['Hromadné prominutí trestů prezidentem', 'Individuální milost', 'Odvolání rozsudku', 'Podmíněné propuštění'], correctIndex: 0 },
  { question: 'Jaká je minimální mzda v ČR regulována?', options: ['Nařízením vlády', 'Zákonem', 'Vyhláškou ministerstva', 'Ústavou'], correctIndex: 0 },
  { question: 'Co je to obchodní rejstřík?', options: ['Veřejný seznam podnikatelských subjektů', 'Seznam trestních případů', 'Daňový registr', 'Evidence obyvatel'], correctIndex: 0 },
  { question: 'Kdo je ombudsman?', options: ['Veřejný ochránce práv', 'Státní zástupce', 'Předseda Senátu', 'Prezident republiky'], correctIndex: 0 },
  { question: 'Co je to katastr nemovitostí?', options: ['Evidence nemovitostí a vlastnických práv', 'Seznam podnikatelů', 'Registr vozidel', 'Evidence obyvatel'], correctIndex: 0 },
  { question: 'Jaký je rozdíl mezi přečinem a zločinem?', options: ['Přečin má horní hranici sazby max 5 let, zločin více', 'Žádný rozdíl', 'Přečin je závažnější', 'Přečin se netrestá'], correctIndex: 0 },
  { question: 'Co je to svěřenský fond?', options: ['Majetek vyčleněný k určitému účelu', 'Státní rozpočet', 'Bankovní účet', 'Typ akcie'], correctIndex: 0 },
];

const itQuestions: Question[] = [
  { question: 'Co znamená zkratka HTML?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperTransfer Markup Language', 'Home Tool Markup Language'], correctIndex: 0 },
  { question: 'Kdo je považován za otce internetu?', options: ['Vint Cerf a Bob Kahn', 'Tim Berners-Lee', 'Steve Jobs', 'Bill Gates'], correctIndex: 0 },
  { question: 'Co je to SQL?', options: ['Structured Query Language', 'Simple Question Language', 'System Query Logic', 'Standard Quality Language'], correctIndex: 0 },
  { question: 'Jaký je nejpoužívanější programovací jazyk na světě (2024)?', options: ['JavaScript', 'Python', 'Java', 'C++'], correctIndex: 0 },
  { question: 'Co je to API?', options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Interface', 'Application Process Integration'], correctIndex: 0 },
  { question: 'Kolik bitů má jeden byte?', options: ['8', '4', '16', '32'], correctIndex: 0 },
  { question: 'Co je to Git?', options: ['Verzovací systém', 'Programovací jazyk', 'Operační systém', 'Databáze'], correctIndex: 0 },
  { question: 'Co znamená zkratka CPU?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], correctIndex: 0 },
  { question: 'Který jazyk vyvinul Guido van Rossum?', options: ['Python', 'Ruby', 'Java', 'PHP'], correctIndex: 0 },
  { question: 'Co je to firewall?', options: ['Bezpečnostní systém sítě', 'Antivirový program', 'Typ procesoru', 'Webový prohlížeč'], correctIndex: 0 },
  { question: 'Co je to open source?', options: ['Software s otevřeným zdrojovým kódem', 'Bezplatný hardware', 'Typ licence', 'Cloudová služba'], correctIndex: 0 },
  { question: 'Jaký protokol se používá pro zabezpečené webové stránky?', options: ['HTTPS', 'FTP', 'SMTP', 'TCP'], correctIndex: 0 },
  { question: 'Co je to RAM?', options: ['Random Access Memory', 'Read Access Memory', 'Rapid Application Memory', 'Remote Access Module'], correctIndex: 0 },
  { question: 'Který operační systém vyvinul Linus Torvalds?', options: ['Linux', 'Windows', 'macOS', 'Unix'], correctIndex: 0 },
  { question: 'Co je to blockchain?', options: ['Decentralizovaná databáze', 'Typ šifry', 'Programovací jazyk', 'Síťový protokol'], correctIndex: 0 },
  { question: 'Co je to DNS?', options: ['Domain Name System', 'Data Network Service', 'Digital Name Server', 'Dynamic Network System'], correctIndex: 0 },
  { question: 'Co je to SSD?', options: ['Solid State Drive', 'Super Speed Disk', 'System Storage Device', 'Secure Save Drive'], correctIndex: 0 },
  { question: 'Který jazyk se používá pro stylování webových stránek?', options: ['CSS', 'HTML', 'PHP', 'SQL'], correctIndex: 0 },
  { question: 'Co je to virtualizace?', options: ['Simulace hardwaru pomocí softwaru', 'Typ šifrování', 'Komprese dat', 'Síťový protokol'], correctIndex: 0 },
  { question: 'Co znamená IoT?', options: ['Internet of Things', 'Input of Technology', 'Internet of Transfer', 'Integrated Online Tools'], correctIndex: 0 },
  { question: 'Kdo založil Microsoft?', options: ['Bill Gates a Paul Allen', 'Steve Jobs', 'Larry Page', 'Mark Zuckerberg'], correctIndex: 0 },
  { question: 'Co je to Docker?', options: ['Kontejnerizační platforma', 'Programovací jazyk', 'Databáze', 'Operační systém'], correctIndex: 0 },
  { question: 'Co je to phishing?', options: ['Podvodné získávání citlivých údajů', 'Typ programování', 'Síťový protokol', 'Zálohovací metoda'], correctIndex: 0 },
  { question: 'Jaká je časová složitost binárního vyhledávání?', options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], correctIndex: 0 },
  { question: 'Co je to TypeScript?', options: ['Nadstavba JavaScriptu s typovým systémem', 'Databázový jazyk', 'Operační systém', 'Textový editor'], correctIndex: 0 },
  { question: 'Co je to VPN?', options: ['Virtual Private Network', 'Visual Programming Network', 'Virtual Process Node', 'Verified Private Node'], correctIndex: 0 },
  { question: 'Kdo vytvořil World Wide Web?', options: ['Tim Berners-Lee', 'Vint Cerf', 'Steve Wozniak', 'Alan Turing'], correctIndex: 0 },
  { question: 'Co je to GPU?', options: ['Graphics Processing Unit', 'General Purpose Unit', 'Global Processing Utility', 'Graphic Program Utility'], correctIndex: 0 },
  { question: 'Co je to algoritmus?', options: ['Přesný postup řešení problému', 'Programovací jazyk', 'Typ databáze', 'Druh procesoru'], correctIndex: 0 },
  { question: 'Co je to cloud computing?', options: ['Využívání výpočetních zdrojů přes internet', 'Typ pevného disku', 'Lokální síť', 'Antivirový program'], correctIndex: 0 },
];

const gamesQuestions: Question[] = [
  { question: 'Která hra je nejprodávanější všech dob?', options: ['Minecraft', 'GTA V', 'Tetris', 'Wii Sports'], correctIndex: 0 },
  { question: 'Kdo vytvořil hru Super Mario?', options: ['Shigeru Miyamoto', 'Hideo Kojima', 'Satoru Iwata', 'Masahiro Sakurai'], correctIndex: 0 },
  { question: 'Ve kterém roce vyšel první Doom?', options: ['1993', '1995', '1991', '1997'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava z Legend of Zelda?', options: ['Link', 'Zelda', 'Ganondorf', 'Epona'], correctIndex: 0 },
  { question: 'Která společnost vyvinula hru Fortnite?', options: ['Epic Games', 'Valve', 'EA', 'Ubisoft'], correctIndex: 0 },
  { question: 'Co je to RPG?', options: ['Role-Playing Game', 'Rapid Play Game', 'Real Player Gaming', 'Random Play Generator'], correctIndex: 0 },
  { question: 'Která herní konzole vyšla první?', options: ['Magnavox Odyssey', 'Atari 2600', 'NES', 'Sega Genesis'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava ze série Witcher?', options: ['Geralt z Rivie', 'Triss Merigold', 'Vesemir', 'Dandelion'], correctIndex: 0 },
  { question: 'Která hra popularizovala battle royale žánr?', options: ['PUBG', 'Fortnite', 'Apex Legends', 'H1Z1'], correctIndex: 0 },
  { question: 'Kdo vyvinul Half-Life?', options: ['Valve', 'id Software', 'Bungie', 'Epic Games'], correctIndex: 0 },
  { question: 'Jaký je název hlavní měny v Animal Crossing?', options: ['Bells', 'Coins', 'Rupees', 'Gil'], correctIndex: 0 },
  { question: 'Ve kterém roce vyšla první PlayStation?', options: ['1994', '1996', '1992', '1998'], correctIndex: 0 },
  { question: 'Která hra se odehrává v Night City?', options: ['Cyberpunk 2077', 'Deus Ex', 'Watch Dogs', 'Sleeping Dogs'], correctIndex: 0 },
  { question: 'Kdo vytvořil Minecraft?', options: ['Markus "Notch" Persson', 'Jeb', 'Phil Spencer', 'Gabe Newell'], correctIndex: 0 },
  { question: 'Co je to Steam?', options: ['Digitální distribuční platforma', 'Herní engine', 'Herní konzole', 'Streamovací služba'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava série God of War?', options: ['Kratos', 'Zeus', 'Ares', 'Baldur'], correctIndex: 0 },
  { question: 'Která hra zavedla mechaniku portálů?', options: ['Portal', 'Half-Life 2', 'Prey', 'Quantum Break'], correctIndex: 0 },
  { question: 'Co je to NPC?', options: ['Non-Player Character', 'New Player Content', 'Network Play Control', 'Next Phase Character'], correctIndex: 0 },
  { question: 'Která společnost vytvořila sérii Halo?', options: ['Bungie', 'Valve', '343 Industries', 'Naughty Dog'], correctIndex: 0 },
  { question: 'Ve které hře najdete Creepery?', options: ['Minecraft', 'Terraria', 'Roblox', 'Fortnite'], correctIndex: 0 },
  { question: 'Jak se jmenuje herní engine od Epic Games?', options: ['Unreal Engine', 'Unity', 'CryEngine', 'Frostbite'], correctIndex: 0 },
  { question: 'Která hra se odehrává v postapokalyptickém Bostonu?', options: ['Fallout 4', 'The Last of Us', 'Metro Exodus', 'Days Gone'], correctIndex: 0 },
  { question: 'Co je to speedrun?', options: ['Dokončení hry v co nejkratším čase', 'Závodní hra', 'Typ cheat kódu', 'Online turnaj'], correctIndex: 0 },
  { question: 'Která hra vyhrála Game of the Year 2023?', options: ['Baldur\'s Gate 3', 'Zelda: Tears of the Kingdom', 'Alan Wake 2', 'Resident Evil 4 Remake'], correctIndex: 0 },
  { question: 'Jak se jmenuje království v sérii Dark Souls?', options: ['Lordran', 'Hyrule', 'Tamriel', 'Thedas'], correctIndex: 0 },
  { question: 'Která společnost vyvinula Red Dead Redemption 2?', options: ['Rockstar Games', 'Ubisoft', 'Naughty Dog', 'CD Projekt Red'], correctIndex: 0 },
  { question: 'Co je to roguelike?', options: ['Žánr s permanentní smrtí a náhodně generovanými úrovněmi', 'Typ závodní hry', 'Sportovní simulátor', 'Logická hra'], correctIndex: 0 },
  { question: 'Ve kterém roce vyšla hra The Elder Scrolls V: Skyrim?', options: ['2011', '2012', '2010', '2013'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava Tomb Raider?', options: ['Lara Croft', 'Samus Aran', 'Jill Valentine', 'Ada Wong'], correctIndex: 0 },
  { question: 'Která hra představila koncept otevřeného světa v 3D?', options: ['GTA III', 'Morrowind', 'Shenmue', 'Ocarina of Time'], correctIndex: 0 },
];

const moviesQuestions: Question[] = [
  { question: 'Kdo režíroval film Pulp Fiction?', options: ['Quentin Tarantino', 'Martin Scorsese', 'Steven Spielberg', 'David Fincher'], correctIndex: 0 },
  { question: 'Kolik filmů má série Harry Potter?', options: ['8', '7', '9', '6'], correctIndex: 0 },
  { question: 'Který seriál má nejvíce epizod v historii?', options: ['Simpsonovi', 'Přátelé', 'Doctor Who', 'South Park'], correctIndex: 0 },
  { question: 'Kdo hrál Jokera v Temném rytíři?', options: ['Heath Ledger', 'Jack Nicholson', 'Joaquin Phoenix', 'Jared Leto'], correctIndex: 0 },
  { question: 'Ve kterém roce vyšel první Star Wars film?', options: ['1977', '1980', '1975', '1983'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava Breaking Bad?', options: ['Walter White', 'Jesse Pinkman', 'Hank Schrader', 'Saul Goodman'], correctIndex: 0 },
  { question: 'Který film získal Oscara za nejlepší film v roce 2020?', options: ['Parazit', '1917', 'Joker', 'Irčan'], correctIndex: 0 },
  { question: 'Kdo režíroval Pána prstenů?', options: ['Peter Jackson', 'Ridley Scott', 'James Cameron', 'Christopher Nolan'], correctIndex: 0 },
  { question: 'Kolik sezón má seriál Game of Thrones?', options: ['8', '7', '9', '10'], correctIndex: 0 },
  { question: 'Který herec hraje Iron Mana v MCU?', options: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'], correctIndex: 0 },
  { question: 'Jak se jmenuje planet z filmu Avatar?', options: ['Pandora', 'Tatooine', 'Arrakis', 'Krypton'], correctIndex: 0 },
  { question: 'Kdo napsal scénář k filmu Interstellar?', options: ['Jonathan a Christopher Nolan', 'Aaron Sorkin', 'Charlie Kaufman', 'Denis Villeneuve'], correctIndex: 0 },
  { question: 'Který seriál se odehrává v městečku Hawkins?', options: ['Stranger Things', 'Dark', 'Twin Peaks', 'Riverdale'], correctIndex: 0 },
  { question: 'Kolik filmů má série Rychle a zběsile (k roku 2024)?', options: ['11', '9', '10', '12'], correctIndex: 0 },
  { question: 'Kdo hraje Sherlocka v BBC seriálu Sherlock?', options: ['Benedict Cumberbatch', 'Robert Downey Jr.', 'Jonny Lee Miller', 'Ian McKellen'], correctIndex: 0 },
  { question: 'Který film režíroval Christopher Nolan o snech?', options: ['Inception', 'Interstellar', 'Tenet', 'Memento'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava seriálu The Office (US)?', options: ['Michael Scott', 'Jim Halpert', 'Dwight Schrute', 'Andy Bernard'], correctIndex: 0 },
  { question: 'Který film z roku 1994 se odehrává ve vězení Shawshank?', options: ['Vykoupení z věznice Shawshank', 'Zelená míle', 'Pulp Fiction', 'Forrest Gump'], correctIndex: 0 },
  { question: 'Kdo režíroval Titanic?', options: ['James Cameron', 'Steven Spielberg', 'Ridley Scott', 'Peter Jackson'], correctIndex: 0 },
  { question: 'Jak se jmenuje kontinent ve Hře o trůny?', options: ['Westeros', 'Středozem', 'Narnie', 'Azeroth'], correctIndex: 0 },
  { question: 'Který herec hraje Jacka Sparrowa?', options: ['Johnny Depp', 'Orlando Bloom', 'Brad Pitt', 'Leonardo DiCaprio'], correctIndex: 0 },
  { question: 'Kolik filmů má série Matrix?', options: ['4', '3', '5', '2'], correctIndex: 0 },
  { question: 'Který seriál vytvořili bratři Dufferové?', options: ['Stranger Things', 'Dark', 'Lost', 'Westworld'], correctIndex: 0 },
  { question: 'Kdo hraje Thora v MCU?', options: ['Chris Hemsworth', 'Chris Evans', 'Chris Pratt', 'Tom Hiddleston'], correctIndex: 0 },
  { question: 'Který film vyhrál nejvíce Oscarů v historii?', options: ['Ben-Hur, Titanic a Pán prstenů (11)', 'Schindlerův seznam', 'Gladiátor', 'Forrest Gump'], correctIndex: 0 },
  { question: 'Jak se jmenuje hlavní postava seriálu Peaky Blinders?', options: ['Thomas Shelby', 'Arthur Shelby', 'John Shelby', 'Alfie Solomons'], correctIndex: 0 },
  { question: 'Který režisér je známý twisty na konci filmů?', options: ['M. Night Shyamalan', 'David Lynch', 'Darren Aronofsky', 'Denis Villeneuve'], correctIndex: 0 },
  { question: 'Ve kterém roce vyšel první díl Harryho Pottera (film)?', options: ['2001', '2000', '2002', '1999'], correctIndex: 0 },
  { question: 'Který seriál se odehrává v Albuquerque?', options: ['Breaking Bad', 'Narcos', 'Ozark', 'Dexter'], correctIndex: 0 },
  { question: 'Kdo režíroval Schindlerův seznam?', options: ['Steven Spielberg', 'Martin Scorsese', 'Francis Ford Coppola', 'Roman Polanski'], correctIndex: 0 },
];

const booksQuestions: Question[] = [
  { question: 'Kdo napsal Malého prince?', options: ['Antoine de Saint-Exupéry', 'Jules Verne', 'Victor Hugo', 'Albert Camus'], correctIndex: 0 },
  { question: 'Jak se jmenuje autor Harryho Pottera?', options: ['J.K. Rowling', 'J.R.R. Tolkien', 'George R.R. Martin', 'Stephen King'], correctIndex: 0 },
  { question: 'Kdo napsal Válku a mír?', options: ['Lev Tolstoj', 'Fjodor Dostojevskij', 'Anton Čechov', 'Nikolaj Gogol'], correctIndex: 0 },
  { question: 'Který český autor napsal Babičku?', options: ['Božena Němcová', 'Karel Čapek', 'Jan Neruda', 'Alois Jirásek'], correctIndex: 0 },
  { question: 'Co napsal George Orwell?', options: ['1984', 'Brave New World', 'Fahrenheit 451', 'Konec civilizace'], correctIndex: 0 },
  { question: 'Kdo napsal Odysseu?', options: ['Homér', 'Sofokles', 'Vergilius', 'Aristoteles'], correctIndex: 0 },
  { question: 'Který autor vytvořil Středozem?', options: ['J.R.R. Tolkien', 'C.S. Lewis', 'Terry Pratchett', 'George R.R. Martin'], correctIndex: 0 },
  { question: 'Jak se jmenuje nejslavnější dílo Franze Kafky?', options: ['Proměna', 'Proces', 'Zámek', 'Amerika'], correctIndex: 0 },
  { question: 'Kdo napsal Don Quijota?', options: ['Miguel de Cervantes', 'Federico García Lorca', 'Gabriel García Márquez', 'Pablo Neruda'], correctIndex: 0 },
  { question: 'Který český autor napsal R.U.R.?', options: ['Karel Čapek', 'Jaroslav Hašek', 'Bohumil Hrabal', 'Milan Kundera'], correctIndex: 0 },
  { question: 'Co je to Duna?', options: ['Sci-fi román Franka Herberta', 'Fantasy od Tolkiena', 'Detektivka Agathy Christie', 'Horor Stephena Kinga'], correctIndex: 0 },
  { question: 'Kdo napsal Osudy dobrého vojáka Švejka?', options: ['Jaroslav Hašek', 'Karel Čapek', 'Bohumil Hrabal', 'Jan Neruda'], correctIndex: 0 },
  { question: 'Jaký žánr psal H.P. Lovecraft?', options: ['Kosmický horor', 'Fantasy', 'Sci-fi', 'Detektivka'], correctIndex: 0 },
  { question: 'Kdo napsal Sto roků samoty?', options: ['Gabriel García Márquez', 'Jorge Luis Borges', 'Isabel Allende', 'Paulo Coelho'], correctIndex: 0 },
  { question: 'Který autor napsal Nesnesitelnou lehkost bytí?', options: ['Milan Kundera', 'Bohumil Hrabal', 'Václav Havel', 'Ivan Klíma'], correctIndex: 0 },
  { question: 'Kdo napsal Zločin a trest?', options: ['Fjodor Dostojevskij', 'Lev Tolstoj', 'Anton Čechov', 'Ivan Turgeněv'], correctIndex: 0 },
  { question: 'Která kniha začíná větou "Bylo to nejlepší z dob, bylo to nejhorší z dob"?', options: ['Příběh dvou měst', '1984', 'Velký Gatsby', 'Chyťte toho chytáka'], correctIndex: 0 },
  { question: 'Kdo napsal Stopařův průvodce po Galaxii?', options: ['Douglas Adams', 'Isaac Asimov', 'Arthur C. Clarke', 'Philip K. Dick'], correctIndex: 0 },
  { question: 'Který autor napsal Pýchu a předsudek?', options: ['Jane Austen', 'Charlotte Brontë', 'Emily Brontë', 'Virginia Woolf'], correctIndex: 0 },
  { question: 'Co napsal Ray Bradbury?', options: ['Fahrenheit 451', '1984', 'Brave New World', 'Solaris'], correctIndex: 0 },
  { question: 'Kdo napsal Hraběte Monte Christo?', options: ['Alexandre Dumas', 'Victor Hugo', 'Honoré de Balzac', 'Gustave Flaubert'], correctIndex: 0 },
  { question: 'Který český autor napsal Postřižiny?', options: ['Bohumil Hrabal', 'Milan Kundera', 'Jaroslav Hašek', 'Karel Čapek'], correctIndex: 0 },
  { question: 'Kdo napsal Alenku v říši divů?', options: ['Lewis Carroll', 'Oscar Wilde', 'Charles Dickens', 'Mark Twain'], correctIndex: 0 },
  { question: 'Který autor je znám sérií Letopisy Narnie?', options: ['C.S. Lewis', 'J.R.R. Tolkien', 'Terry Pratchett', 'Ursula K. Le Guin'], correctIndex: 0 },
  { question: 'Kdo napsal Starce a moře?', options: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'], correctIndex: 0 },
  { question: 'Která kniha Stephena Kinga se odehrává v hotelu Overlook?', options: ['Osvícení', 'To', 'Misery', 'Zelená míle'], correctIndex: 0 },
  { question: 'Kdo napsal Piknik u cesty (předloha Stalkera)?', options: ['Bratři Strugačtí', 'Stanislaw Lem', 'Isaac Asimov', 'Philip K. Dick'], correctIndex: 0 },
  { question: 'Který autor napsal sérii Zaklínač?', options: ['Andrzej Sapkowski', 'Stanislaw Lem', 'Brandon Sanderson', 'Terry Pratchett'], correctIndex: 0 },
  { question: 'Co napsal Aldous Huxley?', options: ['Brave New World (Konec civilizace)', '1984', 'Fahrenheit 451', 'My'], correctIndex: 0 },
  { question: 'Kdo napsal Jméno růže?', options: ['Umberto Eco', 'Italo Calvino', 'Dante Alighieri', 'Luigi Pirandello'], correctIndex: 0 },
];

const questionBanks: Record<Category, Question[]> = {
  law: lawQuestions,
  it: itQuestions,
  games: gamesQuestions,
  movies: moviesQuestions,
  books: booksQuestions,
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateQuiz(category: Category, count: number = 10): Question[] {
  const bank = questionBanks[category];
  const selected = shuffleArray(bank).slice(0, count);
  
  // Shuffle options for each question while tracking correct answer
  return selected.map(q => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    return { ...q, options: shuffledOptions, correctIndex: newCorrectIndex };
  });
}
