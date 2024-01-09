PARAMETRE UŽÍVATEĽSKÉHO ROZHRANIA


1. PARAMETRE SYSTEMU
(Vstupné požiadavky pre funkcie systému vyhodnocovania)
Systém by mal ideálne prímať SMS cez softwérovu SMS bránu s požadovanou kapacitov pre príjem SMS a mal by byť na to optimalizovaný s možnosťou použitia aj hardwarovej brány.
1.1 Základné
• Triedenie podľa ID zariadenia,
• možnosť dodatočnej ochrany PIN kódom
• možnosť meniť poradie zasielaných hodnôt
• pri alarmových stavoch vyhodnocovať podľa pozície typ alarmu, nastvaiteľné administrátorom
• nastavenie minimálnej a maximálnej hodnoty a z(slanie nastavenie do monitorovacej jednotky a rovnako prijatie nastavenie z jednotky, aby boli vždy rovnake)
• nastavenie základných parametrov a odoslanie do zariadenia (cez 1 SMS) a prijatie potvrdzovacej SMS (presný formát bude upresnený po vzájomnej kozultácii)
• konvertovanie do printového a tabuľkového formátu
• pri tlači možnosť vybrať len určité doby , alebo dáta (napríklad len jedno meranie
denne, pre týždenný alebo mesačný report)
1.2 Doplnkové
• Vyhodnocovanie omeškania SMS pri nastavenej periode
• ak sa zariadenie nehlási, zaslat alarmove hlásenie o chybe zariadenia
• možmost reťazenia SMS pri väčšom množstve dát (rozdelenie do napr. 2 SMS)
• možnosť vyžiadania, popríade pravidelného (priodického)vyžiadania v určených intervaloch a časoch buď prezvonením, alebo cez SMS. Poprípade možnosť nastavenia scheduleru
• možnosť záznamu, alebo poznámky, napríklad pre poruchu, alarm, haváriu...
• možnosť záložnej brány (aj HW)

2. FUNKCIE PRE UŽIVATEĽSKE ROZHRANIE 2.1 ADMINISTRTOR
• Množnosť vybraťa zoradiť s prijatých dát zobraziť len vybrate dáta. Možnosť pridť názov a veličinu danej hodnote pre zobrazenie v tabuľke
• vyhodnotenie alarmových stavov z prijatého protokolu
• nastavenie parametrov pre každy systém (číslo jednotky, tel. Číslo jednotky, perioda
zasielania, zmena t.č. brány, limity pre vyhlasenie alarmu, )
• nastavenie povolenia pre užívateľa ( nastavenie tabuľky pre zobrazenie hodnôt, možnosť
exportu do pdf, dodatočné odoslanie dát cez SMS)
• diaľkové nastavenie monitorovacej jednotky pre základné hodnoty(zmena brány,periody, limitov, ID zariadenia, pin kódu (po konzultácii), limitov)
2.2 UŽÍVATEľ
• Zobrazenie hodnôt v tabuľkovom formáte pdf
• Možnosť vyvolať dáta podľa dátumu, alebo alarmu (po povolení adminom)
• možnosť (po povolení administrátorom) prijímať alarmové alebo upozorňujúce SMS
• upozornenia primárné zasielané na e-mail, po povolení administrátorom aj SMS

***administrátor***
2.1.1 Vybratie a zoradenie dát
Pri prijatí protokolu a parsovaní dát z protokolu, mať možnosť tieto dáta dotatočné vybrať a zoradiť pre zobrazenie do tabuľky. Napríklad 1. hodnotu protokolu umiestniť na 4. miesto v tabuľke , 2. hodnotu na 1. miesto atď. Tymto hodnotám priradiť názov (npr. BOJLER), typ veličiny(napr.°C, Bar) a posun v desatinnej čiarke. Napr. Pre 0 bez posunu, pre 1 o jedno desatinné miest (napr. Hodnota 638 sa zobrazí ako hodnota 63,8) pre 2 o 2 desatinne miest atď.
(Príklady tabuliek nižšie) Do tabuľky pridať ešte jednu kolonku pre stav alarmov. A natane napríklad alarm na 3 vstupe, zobraziť hodnotu 3 v tejto kolonke, alebo priradený názov pre daný alarmovy vstup. Pri prekročení min, alebo max danej hodnoty, túto hodnotu faregbne zvýrazniť. Pri alarme z digitálnych vstupov farebne zvýrazniť hodnotu v tej kolonke, kde je alarm zobrazený.

 
2.1.2 Alarmové stavy
Pri alarmových stavoch priradiť podobnú tabuľku, ako pre analógové hodnoty vyšie, ale len s priradením názvu k danému alarmu (napr. Ako tab.1 ale bude obsahovať len ID(číslo alarmu) a hodnotu (názov alarmu) v tejto tabuľke. Pri detekcii alarmu zaslanie upozornenia na vybranne e- maily a zaslanie SMS na vybranne tel. Čisla. Príklad v tab.4


2.1.3 Nastavenie parametrov
Tabuľka pre zadanie hlavných parametrov pre funkciu zariadenia:
• číslo (kód) zariadenia (napr. 0002)
• tel.číslo zariadenia a tel.číslo SMS brány
• možnosť nastavenia PIN kodu ( po konzultácii)
• pridať nastavenie periody
• názov, umiestnenie zariadenia (kde sa používa) a typ zariadenia, pre ktoré sa používa
Príklad zadania základných parametrov.
2.1.4 Diaľkové nastavenie monitorovacej jednotky (cez SMS)
Pomocou SMS nastaviť parametre monitorovacej jednotky, ako napríklad zmenu čísla SMS brány , periody zasielania SMS, zmena čísla (názvu ID) zariadenia, poprípade PIN kódu zariadenia (treba konzultovať kvôli prístupu ostatných zauinteresovaných účastníkov k jednotke, zatiaľ nie je používaný) Rovnako pomocou SMS nastavenie limitov min a max pre rovnaké vyhodnotenie vrámci backendu a fronendu. Bude sa jednať o 2 nastavovacie SMS (nastavenie parametrov a nastavenie limitov)
 *** užívateľ ***

2.2.1 Zobrazenie tabuľky pre užívateľa
Pre používateľa zobrazenie len tabuľky v pdf formáte bez možnosti triedenia (len pre administrátora). (tab.3)
Po povolení administrátorom možnosť triedenia zobrazenia podľa času, alebo iných parametrov) Po povolení administrátorom možnosť zobrazenie aj web tabuľky (tab.2)
2.2.2
Poprípade možnosť povolenia (administrátorom) zasielania upozorňujúceho e-mailu, alebo SMS
