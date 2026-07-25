## Features
| Beschreibung | Prio | Implemented in |
| --- | --- | --- |
| [NEWFEAT] Pushbutton soll ein Setting "toggle" bekommen und das Target togglen (beim Druck) | 1 | 6313b0e |
| [NEWFEAT] Pushbutton soll ein Setting "circle" bekommen, dadurch den Button nicht rechteckig, sondern kreisförmig zeichnen. keine Ellipse! | 1 | 6313b0e |
| [NEWWIDGET] themed_bar: einfache "Progressbar" im Neumorphism style. Basis versenkt und indicator über ähnlich der Checkbox, nur langggestreckt. Object ID, Min, Max Wert als Settings, Akzent setzbar, zusätzlich eine "color", die dann die Füllung des Indicators bestimmt, falls gesetzt. | 2 | 6313b0e |
| [NEWFEAT] themed_bar Checkbox für vertikal | 1 | 633fa36 | 
| [NEWFEAT] button Navigationsmodus: Button soll in den Settings eine Section haben (an/abschaltbar), die statt der Object ID dann eine Auswahl der Pages anbietet und eine Navigation dahin ausführt statt die Object ID zu beschreiben | 2 | 2bc845d | 
| [NEWFEAT] button image/Symbol Auswahl soll auch möglich sein und zusätzlich zum text (oder statt des text) dargestellt werden. Bei Symbol. Bei Symbol soll es auch noch zwei Auswahlmöglichkeiten für Farbe (aktiv/inaktiv) geben, default Textfarbe und Akzentfarbe | 2 | e92b757 | 
| [NEWFEAT] button Checkbox für Wert invertiert | 1 | e92b757 | 
| [NEWWIDGET] Slider. Wie die Bar, aber mit einem Anfasser. Weitere Eigenschaft "steps", auf die dann "gerundet" werden soll. Weiteres Setting "write delay" für Angabe in ms (default 500), wann, nach stabilem Halten oder loslassen eienr Position der Wert auch geschrieben werden soll | 2 | 1cabd9c | 
| [NEWFEAT] button Checkbox "disabled". Nicht mehr mit shadows up/down, sondern flach und text mit 50% alpha. Drücken nicht mehr möglich | 1 | 1cabd9c | 
| [NEWWIDGET] Dropdown Button (wie "https://themesberg.com/docs/neumorphism-ui/components/buttons/"). Auswahlliste der Werte und Einträge, damit zum Beispiel bei Auswahl "Links" der wert "left" in die Object ID geschrieben werden kann | 1 |  |

## Bugs
| Beschreibung | Prio | Widget (oder allg) | Fixed in |
| --- | --- | --- | --- |
| Pushbutton soll Wert nur beim Drücken schreiben und danach wieder zurückspringen | 1 | Pushbutton | 6313b0e |
| Pushbutton schreibt wert auch beim zurückspringen. Der Wert soll NUR beim Drücken geschrieben werden! | 1 | Button | 633fa36 |
| Bar color kill die gesamte Optik, da ohne shadows, transparenz und ähnliches. Auch sollte der "Barindicator" etwas (minimal) mehr Abstand zur versenkten Bar haben | 1 | Bar | 633fa36 | 
| Toggle soll in Verbindung mit Pushbutton auch immer wieder "herausspringen". Beim Drücken wird dann aber entweder true oder false geschrieben | 1 | Button | e92b757 |
| Pushbutton soll auch gedrückt werden können, wenn der Wert bereits passend steht. Dann erfolgt nur das optische Drücken | 1 | Button | e92b757 |
| Pushbutton funktioniert mit Drückeffekt noch nicht. Weder normal, noch toggle. Aktion wird ausgeführt (beim Toggle), aber ein "Drücken" ist nicht sichtbar| 1 | button | 1cabd9c |

