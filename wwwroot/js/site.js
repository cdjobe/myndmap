// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// $(document).ready(function(){

    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    };

    // Distance between nodes
    var xDistance = 100;
    var yDistance = 100;

    
    var oldPoint = new Point(view.center.x, view.center.y);
    var currentPoint = new Point(view.center.x, view.center.y);
    var newPoint = new Point(view.center.x, view.center.y);

    var newShape = null;
    // The shape of the next node. Default is square
    var shape = "square";
    // The direction to travel from current node
    var direction = null;
    // Using lastItem to bring above the new trail
    var lastShape = null;
    var lastText = null;
    // using historyItem to replace 'red' stroke color to black
    var historyItem = null;

    var historyBack = [];
    var historyForward = [];

    var historyDisplay = new PointText(new Point(50,50));
    var initialized = false;

    var newText;

    /********************************
     * ******************************
     * Load File
     *******************************/
    $(".filePath").click(function(){
        project.clear();
        filePath = $(this).attr('path');
        $.ajax({
            traditional: true,
            type: "POST",
            url: "/getMap",
            data: {filePath: filePath},
            success: function(data) {
                project.importJSON(data);
            }
        });

    });
    var intro = new PointText(view.center);
    /***********************
    * Initialize
    * **********************/
    function initialize() {
        console.log("initialize")
        intro = new PointText(view.center);
        intro.content = "press 'o' to begin";
        intro.fontSize = 50;
        intro.justification = 'center';           
    }

    /*******************************
    ********************************
    *  Handle Input
     ******************************/

    function onKeyDown(event) {

        if (event.key == '1') {
            view.scale(.75);
        }
        if (event.key == '2') {
            view.scale(2);   
        }

        if ( initialized == false ) {
            if (event.key == 'o') {
                $("#inputBox").focus();
                intro.remove();
                initialized = true;
            }
            // if (event.key == 'enter') {
            //     newPoint = new Point(view.center.x, view.center.y);
            //     var newText = new PointText(newPoint);
            //     newText.fontSize = 18;
            //     newText.content = $('#inputBox').val();

            //     newText.fillColor = 'black';
            //     var rectangle = newText.handleBounds;
            //         rectangle.x -= 5;
            //         rectangle.y -= 5;
            //         rectangle.width += 20;
            //         rectangle.height += 20;
            //     newShape = new Path.Rectangle(rectangle);
            //     newShape.fillColor = '#e9e9ff';
          
            //     var group = new Group();

            //     group.addChild(newShape);
            //     group.addChild(newText);
                
            //     $("#inputBox").val("");
            //     $("#inputBox").blur();
            //     initialized = true;
            // }
        }
        
        else if ( initialized == true ) {
            var inputFocused = ($('#inputBox').is(':focus'));
 
            if ( !inputFocused && ((event.key == 'i')||(event.key =='up'))){
                $("#inputBox").focus();
                newPoint = new Point(currentPoint.x, currentPoint.y - yDistance);
                oldPoint = new Point(currentPoint.x, currentPoint.y);
                direction = 'up';
            } 

            else if (!inputFocused && ((event.key == 'j')||(event.key == 'left'))) {
                $('#inputBox').focus();
                newPoint = new Point(currentPoint.x - xDistance, currentPoint.y);
                oldPoint = new Point(currentPoint.x, currentPoint.y);
                direction = 'left';
            }

            else if (!inputFocused && ((event.key == 'k')||(event.key == 'down'))) {
                $('#inputBox').focus();
                console.log("down");
                newPoint = new Point(currentPoint.x, currentPoint.y + yDistance);
                oldPoint = new Point(currentPoint.x, currentPoint.y);
                direction = 'down';
            }

            else if (!inputFocused && ((event.key == 'l')||(event.key == 'right'))) {
                $('#inputBox').focus();
                newPoint = new Point(currentPoint.x + xDistance, currentPoint.y);
                oldPoint = new Point(currentPoint.x, currentPoint.y);
                direction = 'right';
            }

            else if (!inputFocused && event.key == 'o') {
                $('#inputBox').focus();
                newPoint = new Point(view.center.x, view.center.y);
                oldPoint = new Point(view.center.x, view.center.y);
            }
            
            else if (!inputFocused && event.key == 's') {
                shape = "square";
            }
            else if (!inputFocused && event.key == 'e') {
                shape = "ellipse";
            }

            else if (!inputFocused && event.key == '3') {
                var projectDataJSON = project.exportJSON(); 
                console.log(typeof projectDataJSON);
                $.ajax({
                    traditional: true,
                    type: "POST",
                    url: "/saveMap",
                    data: {allTheStuff: projectDataJSON},
                });
            }

            /****************************************
            // History
            ****************************************/
            else if (!inputFocused && event.key == 'b' && historyBack.length > 0) {
                var currentBox = historyBack.pop()
                currentPoint = currentBox.point
                console.log(currentBox)
                console.log(currentBox.point)
                currentBox.fillColor = 'green';
            }

            else if (!inputFocused && event.key == 'f') {
                currentPoint = historyForward.pop();
                console.log(currentPoint)
            }

            
            // hit test for placing blocks
            var hitResult = project.hitTest(newPoint, hitOptions);
            /* Defaults for avoiding colliding boxes
            - right/up - up & to the right
            - left/down - down & to the left */
            while (hitResult != null) {
                if (direction == null) {
                    newPoint = new Point(currentPoint.x-xDistance/2, currentPoint.y-yDistance/2);
                }
                else if (direction == 'up')
                newPoint = new Point(currentPoint.x+(xDistance/2), currentPoint.y+(yDistance/2));
                else if (direction == 'down')
                newPoint = new Point(currentPoint.x-xDistance/2, currentPoint.y-yDistance/2);
                else if (direction == 'right')
                newPoint = new Point(currentPoint.x+xDistance/2, currentPoint.y-yDistance/2);
                else if (direction == 'left')
                newPoint = new Point(currentPoint.x-xDistance/2, currentPoint.y+yDistance/2);
                var hitResult = project.hitTest(newPoint, hitOptions);
            }
            
            if (event.key == 'enter') {
                var inputText = $('#inputBox').val();   
                currentPoint = new Point(newPoint.x, newPoint.y);              
                
                var trail = new Path.Line(oldPoint, newPoint);
                trail.strokeColor = 'blue';
                trail.sendToBack();
                
                // Create the Text
                var newText = new PointText(newPoint);
                newText.content = inputText;
                newText.fontSize = 16;
                
                
                // Use newText size to create the background shape
                var rectangle = newText.handleBounds;
                rectangle.x -= 10;
                rectangle.y -= 10;
                rectangle.width += 20;
                rectangle.height += 20;
                
                
                if (shape == "ellipse")
                    newShape = new Path.Ellipse(rectangle);
                else
                    newShape = new Path.Rectangle(rectangle);
                newShape.fillColor = '#e9e9ff';
                
                var group = new Group();

                group.addChild(newShape);
                group.addChild(newText);
                // group.addChild(trail);
                trail.insertBelow(lastShape);

                // with line above, makes sure the trail stays behind the blocks
                // lastShape = newShape;

                $("#inputBox").val("");
                $("#inputBox").blur();
                historyBack.push(newText);
            }
        }
    }


    var myPath;
    var pointOne = null;
    var pointTwo = null;
    var clickFlag = false;
    
    function onMouseDown(event) {
        // console.log(event.item)
        if (clickFlag == false && event.item != null) {
            pointOne = new Point(event.point);
            // console.log(pointOne);
        }
        if (clickFlag == true && event.item != null) {
            pointTwo = new Point(event.point);
            var path = new Path.Line(pointOne, pointTwo);
            path.strokeColor = 'blue'; 
            event.item.addChild(path);
            path.sendToBack();
        }
        clickFlag = !clickFlag;
        currentPoint = event.point;
    }

    // Mouse Stuff for later
    // function onMouseUp(event) {
    //     upKeep(event.item);
    // }

    // function onMouseDrag(event) {
    //     // console.log(event.item.position);
        
    // }

    // function upKeep(item) {
    //     var numChild = item.children.length;
    //     var rectangle = item.children[item.children.length -2];
    //     // var text = item.lastChild;
    //     rectangle.scale(1 + numChild*.02)
    //     rectangle.fillColor = new Color(.2,.8,.5);
    //     text.scale(1 + numChild*.05)
    // }

    $("#newMap").click(function(){
        project.clear();
        initialized = false;
        initialize();
    });

initialize();
// });

