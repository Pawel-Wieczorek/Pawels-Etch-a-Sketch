//Denna funktion täcker i princip hela min javascript-kod, och innehåller en del "under-funktioner. Jag använder mig utav denna struktur
//för att alla funktioner ska kunna använda sig utav alla nödvändiga canvas-variabler som finns i över-funktionen.
//InitialiseDrawing börjar med att placera markören (både den synliga, och funktionella) i mitten av canvaset.
function initialiseDrawing(){
    var canvasElement = document.querySelector("#EtchASketchCanvas");
    var canvasContext = canvasElement.getContext("2d");

    canvasContext.beginPath();
    var xCord = 150;
    var yCord = 75;
    canvasContext.moveTo(xCord, yCord);

    //Min lösning på att kunna rita diagonalt är att använda mig utav booliska värden, som kan detecta ifall mer än en nyckel är nertryckt
    var leftKey = false;
    var upKey = false;
    var rightKey = false;
    var downKey = false;
    
    //Nedanstående funktion anropas varje gång förflyttas
    function placeMarker(){
        document.fonts.ready.then(_ => {
        canvasContext.font = '600 13px "Font Awesome 5 Free"';
        canvasContext.fillStyle = "red";
        //Jag fick testa mig fram med x och y coordinaterna, för att mitten av markören skulle vara så nära linjen som möjligt
        setTimeout(_ => canvasContext.fillText("\uF05b", xCord-7, yCord+5), 200);
    });
    }
    //Markören placeras för första gången
    placeMarker();
    
    document.addEventListener('keydown', (event) => {
        if (event.defaultPrevented) {
            return;
        }
        
        //I varje case finns en if-sats, som kollar !diagonalConditions. Diagonalconditions  Uppfylls om två piltangenter är av rätt 
        //kombination är nertryckta samtidigt. Om inte, skickas rätt coordinat till funktionen Draw
        switch(event.key){
            case "ArrowLeft":
                document.getElementById('leftDownChakra').classList.add('reverse-spin');
                leftKey = true;
                if (xCord > 0 && !diagonalConditions()){
                    Draw(-1, 0);
                }
                break;
            case "ArrowRight":
                document.getElementById('leftDownChakra').classList.add('slow-spin');
                rightKey = true;
                if (xCord < 300 && !diagonalConditions()){
                    Draw(1, 0);
                }
                break;
            case "ArrowUp":
                document.getElementById('rightDownChakra').classList.add('slow-spin');
                upKey = true;
                if (yCord > 0 && !diagonalConditions()){
                    Draw(0, -1);
                }
                break;
            case "ArrowDown":
                document.getElementById('rightDownChakra').classList.add('reverse-spin');
                downKey = true;
                if (yCord < 150 && !diagonalConditions()){
                    Draw(0, 1);
                }
                break;
        }
        //Canvaset rensas, och markören placeras på nytt vid de nya koordinaterna
        if (event.key === "c" || event.key === "C" || event.key === " " ){
            canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasContext.beginPath();
            placeMarker();
            }
    })
    //Om man släpper piltangenterna, ska rattarna sluta att vrida, och tangenterna ska inte registreras som nertryckta
    window.addEventListener('keyup', (event) => {
        switch(event.key){
            case "ArrowLeft":
                document.getElementById('leftDownChakra').classList.remove('reverse-spin');
                leftKey = false;
                break;
            case "ArrowRight":
                document.getElementById('leftDownChakra').classList.remove('slow-spin');
                rightKey = false;
                break;
            case "ArrowUp":
                document.getElementById('rightDownChakra').classList.remove('slow-spin');
                upKey = false;
                break;
            case "ArrowDown":
                document.getElementById('rightDownChakra').classList.remove('reverse-spin');
                downKey = false;
                break;
        }
    })

    //Denna funktion hanterar ritandet, en pixel i taget. Koordinat-förändringarna skickas som parameter, och linjen ritas till de nya
    //koordinaterna
    function Draw(newX, newY){
        xCord += newX;
        yCord += newY;

        canvasContext.lineWidth = 1;
        //clearRect används för att sudda ut den gamla markören, så att den nya kan placeras. Udda nog, suddas inte linjen bort såvida 
        //man inte följer upp detta med beginPath(), vilket gynnar mig ganska så ordentligt här
        canvasContext.clearRect(xCord-9, yCord-9, 17, 17);
        canvasContext.strokeStyle = 'Black';
        canvasContext.stroke();

        canvasContext.lineTo(xCord, yCord);
        placeMarker();
    }

    //Funktionen kollar ifall rätt kombinationer av två piltangenter är nedtryckta samtidigt. Anledningen till att if-vilkoren är 
    //nestlade, är på grund av att diagonalvilkoren måste regstreras som att de uppfyllts (return true), även om linjen är vid kanten.
    //Om inte, brukar linjen i vissa fall tendera att glida längs gränsen ifall den närmar sig en kant diagonalt
    function diagonalConditions(){
        if (leftKey && upKey ){
            if (xCord > 0 && yCord > 0){
                Draw(-1, -1);
            }
            return true;
        }
        if (upKey && rightKey ){
            if (xCord < 300 && yCord > 0){
                Draw(1, -1);
            }
            return true;
        }
        if (rightKey && downKey ){
            if (xCord < 300 && yCord < 150){
                Draw(1, 1);
            }
            return true;
        }
        if (leftKey && downKey ){
            if (xCord > 0 && yCord < 150){
                Draw(-1, 1);
            }
            return true;
        }
    }
}

initialiseDrawing();