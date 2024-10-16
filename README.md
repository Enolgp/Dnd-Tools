# Dnd-Tools
Tools that can be usefull in dnd games for both GM and players (specially GM)
This projet started when my GM suggested me to make a tool for ease some parts of the dnd game such as calculate the price of a magic item. And I make this project to group different tools that I will make and sharing them with the community in the process

# Tools
### Price calculator
A tool for calculate the price of a magic object introducing the rarity of the object, the number and the lvl of the spells contained in the object, the permanency of the magic, if the object requires attunement and the charisma bonus of the character trying to buy the object.
The output is the base price, the discount or tax of the attunement and charisma bonus and the final price (considerating the tax or discount)
The formula was obtained from a [Reddit post](https://www.reddit.com/r/DnDBehindTheScreens/comments/uiwo1n/magic_items_pricing_guide_for_5e_a_spreadsheet)

To use the app you can download the project or only the folder and execute the file "init.html" in the web browser or you can use it from this url: https://enolgp.github.io/Dnd-Tools/price-calculator/

### Table Bingo
A Bingo panel that flips on click for the table to play BINGO with inside jokes of the group.
Initially the data for those jokes is gotten from an API containing the jokes of my group, but this data can be updated in the "Propiedades" button and is saved in the cookies of the Browser. This means that if you chage the browser, or the device, the changes won't remain. If you delete all the data, the app will fetch it from the API again.
The instructions for use of the applications are easy: personalize the data, click on the correspondent cell if it happened in your game and ask your DM for a mini-reward if you get a line or a Bingo
All the information about the bingo is saved in the cookies of your device, so you can reload your app without danger. If you want a new Bingo sheet, you only have to press the "Nuevo Bingo" button.
The form of the bingo Sheet can change depending of the number of elements. The maximum number of elements a bingo sheet can show at a time is 9, and this distribution is the only one that has both line and bingo.
The sounds used on the achievement of the line or the bingo are "solemn-fanfare-sound" and "fanfare-after-a-successfully-completed-computer-game" downloaded from [Sound Dino](https://sounddino.com/en/search/?s=fanfare)

To use the app you can download the project or only the folder and execute the file "init.html" in the web browser or you can use it from this url: https://enolgp.github.io/Dnd-Tools/bingo/

### Labyrinth generator (WIP)
A tool that generates a random disposition of a dungeon in labyrinth shape whit an input of the room number