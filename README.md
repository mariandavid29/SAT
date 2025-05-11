SAT Project

Acest ghid explică pașii necesari pentru instalarea și configurarea mediului de dezvoltare, precum și modul de rulare a algoritmilor SAT și generarea testelor și rapoartelor CSV cu performanțele algoritmilor.

📦 1. Cerințe preliminare

Sistem de operare: Windows / macOS / Linux

Conexiune la internet pentru descărcarea și instalarea uneltelor

1.1. Node.js și npm

Accesează site-ul oficial Node.js: https://nodejs.org/

Descarcă versiunea LTS (Long Term Support) pentru platforma ta.

Rulează installer-ul și urmează pașii din wizard.

Installer-ul include automat și npm (Node Package Manager).

Verifică că instalarea s-a realizat cu succes:

node -v   # ar trebui să afișeze versiunea Node.js
npm -v    # ar trebui să afișeze versiunea npm

🚀 2. Clonarea proiectului

Deschide terminalul (Command Prompt, PowerShell, Terminal etc.)

Clonează repository-ul:

git clone <URL_REPO>
cd sat

🔧 3. Instalarea dependențelor

În directorul principal al proiectului, rulează:

npm install

Această comandă va descărca toate pachetele necesare definite în package.json.

⚙️ 4. Comenzi rapide

npm run startCompilează și rulează algoritmii SAT pe testele existente.

npm run generate:tests:<difficulty>Generează teste noi (easy / medium / hard).

npm run generate:summaryCreează fișiere CSV cu performanțele fiecarui algorit.

Toate fișierele CSV de ieșire se găsesc în dist/:

dp.summary.csv

dpll.summary.csv

resolution.summary.csv
