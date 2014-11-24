// HemLabels - v1.0 
// Will Isenhour - Conder Flag Co

// A Note About Workflow
// This widget assumes that the edge of your artboard is also the edge of your banner (including hems, obviously).
// Labels will be placed according to the edges of the arboard, and nothing else.
// Because of this, it will not correctly label the hems of a banner that's not the same size as artboard 1, and aligned to it.

// v1.0 - 11.12.14

#target illustrator

do // Prevents garbage input for the scale dialog
{
    var scale = prompt("What is the scale of this artwork? 1/??", 1, "Scale");
    if ( isNaN(scale) )
    {
        alert("What you entered is not a number", "Invalid Input", true);
    }
} while( isNaN(scale) );


// All the placement and size variables not linked directly to the dimensions of 
// the document are adjusted here according to the data provided in the Scale dialog
var labelSize = (36 / scale);
var sideMargin = (2.5 / scale);
var topMargin = (0.3 / scale);
var bottomMargin = (0.1 / scale);

var labelText = prompt("Enter the text for the label", "Conder Flag", "Label Text");

// The scale and labelText prompts return null if canceled, and then cause a 
// crash since there's no data in the calls to the textFrames' .height and .width elements.
// By preventing the program from attempting to process in the presence of null
// values, we exit gracefully in the event of a cancel.
if (scale != null && labelText != null)
{
    var docRef = app.activeDocument;
    var artboardRef = docRef.artboards;
    var layerRef = docRef.layers.add();
        layerRef.name = "Hem Labels"

    var artboardLeft    = artboardRef[0].artboardRect[0]; //x
    var artboardTop     = artboardRef[0].artboardRect[1]; //y
    var artboardWidth   = artboardRef[0].artboardRect[2] - artboardRef[i].artboardRect[0]; //x
    var artboardHeight  = artboardRef[0].artboardRect[1] - artboardRef[i].artboardRect[3]; //y

    var labelLowerRight = generateLabel();
    labelLowerRight.name = "Lower right hand label";
    labelLowerRight.position = [ (artboardLeft + artboardWidth) - inchesToPoints(sideMargin) - labelLowerRight.width, (artboardTop - artboardHeight) + labelLowerRight.height + inchesToPoints(bottomMargin) ];

    var labelUpperRight = generateLabel();
    labelUpperRight.name = "Upper right hand label";
    labelUpperRight.position = [ (artboardLeft + artboardWidth) - inchesToPoints(sideMargin) - labelLowerRight.width, (artboardTop - labelUpperRight.height) + inchesToPoints(topMargin) ];

    var labelLowerLeft = generateLabel();
    labelLowerLeft.name = "Lower left hand label";
    labelLowerLeft.position = [ artboardLeft + inchesToPoints(sideMargin), (artboardTop - artboardHeight) + labelLowerLeft.height + inchesToPoints(bottomMargin) ];

    var labelUpperLeft = generateLabel();
    labelUpperLeft.name = "Upper left hand label";
    labelUpperLeft.position = [ artboardLeft + inchesToPoints(sideMargin), (artboardTop - labelUpperLeft.height) + inchesToPoints(topMargin) ];

    layerRef.locked = true;
}
else
{
    // bails in the event of a null
    alert("Either the 'Scale' or 'Label Text' entry dialog was cancelled.", "No Data!", true);
}

// Functions

// Converts inches to points.
function inchesToPoints(i)
{
    var points = i * 72;
    return points;
}

// Converts points to inches.
function pointsToInches(p)
{
    var inches = p / 72;
    return inches;
}

// Creates the textFrames that will go in each corner.
function generateLabel()
{
    var genLabel = docRef.textFrames.add();
    genLabel.textRange.characterAttributes.size = labelSize;
    genLabel.contents = (labelText);
    genLabel.rotate(180);
    return genLabel;
}