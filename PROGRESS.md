## Features
| Beschreibung | Prio | Implemented in |
| --- | --- | --- |
| [NEWFEAT] Pushbutton soll ein Setting "toggle" bekommen und das Target togglen (beim Druck) | 1 | 6313b0e |
| [NEWFEAT] Pushbutton soll ein Setting "circle" bekommen, dadurch den Button nicht rechteckig, sondern kreisförmig zeichnen. keine Ellipse! | 1 | 6313b0e |
| [NEWWIDGET] themed_bar: einfache "Progressbar" im Neumorphism style. Basis versenkt und indicator über ähnlich der Checkbox, nur langggestreckt. Object ID, Min, Max Wert als Settings, Akzent setzbar, zusätzlich eine "color", die dann die Füllung des Indicators bestimmt, falls gesetzt. | 2 | 6313b0e |
| [NEWFEAT] themed_bar Checkbox für vertikal | 1 | 633fa36 | 
| [NEWFEAT] button Navigationsmodus: Button soll in den Settings eine Section haben (an/abschaltbar), die statt der Object ID dann eine Auswah | 1 | eiten anbietet| 

## Bugs
| Beschreibung | Prio | Widget (oder allg) | Fixed in |
| --- | --- | --- | --- |
| Pushbutton soll Wert nur beim Drücken schreiben und danach wieder zurückspringen | 1 | Pushbutton | 6313b0e |
| Pushbutton schreibt wert auch beim zurückspringen. Der Wert soll NUR beim Drücken geschrieben werden! | 1 | Button | 633fa36 |
| Bar color kill die gesamte Optik, da ohne shadows, transparenz und ähnliches. Auch sollte der "Barindicator" etwas (minimal) mehr Abstand zur versenkten Bar haben | 1 | Bar | 633fa36 | 
