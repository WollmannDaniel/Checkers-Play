//show hover effect on gamefield
$('#gameTable td').hover(function () {
    // Coordinates of current cell
    const col = $(this).index();
    const row = $(this).closest('tr').index();

    if(row != 0 && col != 0){
        $(this).addClass("highlight-hover");
    }
}, function () {
    // Coordinates of current cell
    const col = $(this).index();
    const row = $(this).closest('tr').index();

    if(row != 0 && col != 0){
        $(this).removeClass("highlight-hover");
    }
});

//save user clicks from gamefield
let jumps = []
$('td').click(function () {
    const row_index = $(this).parent().index();
    const col_index = $(this).index();

    if (row_index != 0 && col_index != 0) {
        let position = {
            x: col_index - 1,
            y: row_index - 1
        }

        if($(this).hasClass("highlight-click")){
            const positionArray = jumps.at(-1);
            if(position.x == positionArray.x && position.y == positionArray.y){
                $(this).removeClass("highlight-click");
                jumps.pop();
                let jumpString = "";
                jumps.forEach(jmp => {
                    jumpString = jumpString + jmp.y + " " + jmp.x + " ";
                });
                $("#input-text-field-jumps").val(jumpString);
            }
        } else {
            jumps.push(position);
            let jumpString = "";
            jumps.forEach(jmp => {
                jumpString = jumpString + jmp.y + " " + jmp.x + " ";
            });

            //console.log(jumpString)

            $("#input-text-field-jumps").val(jumpString);
            $(this).addClass("highlight-click");
        }
    }
});

//show alert
$(document).ready(async function() {
    const text = $("#textMessage").text();

    if(text.includes("MOVE FROM") || text.includes("Created a new field")){
        iziToast.success({
            title: 'Success!',
            message: text
        });
    } else {
        iziToast.error({
            title: 'OOPS!',
            message: text
        });
    }
    initiateWinningScreen();
});

/////////////////////////////////
/////////Winning Screen//////////
/////////////////////////////////
function initiateWinningScreen() {
    let whiteHasStone = false;
    let blackHasStone = false;
    $("td").each(function() {
        if($(this).children("img").length > 0){
            const src = $($(this).children("img")[0]).attr('src')
            if(src.includes("white")){
                whiteHasStone = true;
            } else if(src.includes("black")){
                blackHasStone = true;
            }
        }
    });

    if(whiteHasStone && !blackHasStone){
        showWinningScreen("White has won!")
    } else if(blackHasStone && !whiteHasStone){
        showWinningScreen("Black has won!")
    }
}

function showWinningScreen(text) {
    iziToast.info({
        title: text,
        message: "Do you want to start a new game? Select game size:",
        position: "center",
        timeout: false,
        icon: '🎉',
        iconText: '🎉',
        close: false,
        drag: false,
        overlay: true,
        inputs: [
            ['<select><option value="8">8</option><option value="10">10</option><option value="12">12</option></select>', 'change', function (instance, toast, select, e) {
                $("#iziToastCreateNewGame").val(select.options[select.selectedIndex].value);
                }, true]
            ],
            buttons: [
                ['<button><b>Create</b></button>', function (instance, toast, button, e, inputs) {
                    $("#iziFormNewGame").submit();
                    //instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, false], // true to focus
            ]
    });

    var duration = 10 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 100 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

///////////////////////////////////
/////Game reset button actions/////
///////////////////////////////////
$('#button-reset-jumps').on("click", function () {
    $("td").each(function() {
        if($(this).hasClass("highlight-click")){
            $(this).removeClass("highlight-click");
        }
    });

    //reset vars
    jumps = [];
    $("#input-text-field-jumps").val("");

    iziToast.info({
        title: 'Selection reset',
        message: ""
    });
});

//Remove focus after button click
document.addEventListener('click', function(e) {
    if(document.activeElement.toString() == '[object HTMLButtonElement]'){
        document.activeElement.blur();
    }
});