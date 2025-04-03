## Telepítés

### Követelmények
- **Node.js verzió**: minimum 20.17.0  
- **MySQL verzió**: 8.0.30  

### Böngészőkénti támogatottság
- Chrome 60+  
- Firefox 60+  
- Safari 12+  
- Edge 79+  
- Internet Explorer nem támogatott  

### Klónozd a repót
```bash
git clone https://github.com/Balint1040/Szakdolgozat_HS.git
cd (projekt elérési útja)
```

Telepítsd a függőségeket
Fortawesomeból legacy verziót használunk
```bash
npm i --legacy-peer-deps
```

Állítsd be az adatbázist
Hozd létre a hsmarket nevezetű adatbázis táblát.
Futtasd az adatbázis migrációkat és a seedert:

```bash
npm run db:setup
```

Indítsd el a szervert
```bash
npm run dev
```
